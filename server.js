const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
// DATA_DIR is overridable so a dev server can keep its vault outside the repo
// (and so deployments can point at any mount). Defaults to ./data as before.
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// B-04/S-04: no wildcard CORS. The UI is served from this same origin, so cross-origin
// access is never required. Previously `cors()` sent Access-Control-Allow-Origin: *,
// which let ANY website a user visited read or overwrite their vault from the browser.
// Set CORS_ORIGIN only if you deliberately serve the UI from a different origin.
const CORS_ORIGIN = process.env.CORS_ORIGIN || '';
if (CORS_ORIGIN) {
  app.use(cors({ origin: CORS_ORIGIN.split(',').map(s => s.trim()), credentials: false }));
}

// S-12: the CSP is also sent as an HTTP header. The meta tag in index.html stays as
// defense in depth, but browsers IGNORE frame-ancestors in meta-delivered policies,
// so until this header existed the app was embeddable by any site (clickjacking).
// Sent from the app rather than the reverse proxy so every deployment shape gets
// it, including bare `node server.js` and loopback-direct access. Unlike the meta,
// style-src carries no 'unsafe-inline': the app has no inline styles, DOMPurify
// strips style attributes from rendered markdown, and CSSOM writes are not CSP-gated.
const CSP_HEADER = [
  "default-src 'self'",
  "script-src 'self' 'sha256-ZMl5Q4bsZIF4pDz2yEQ03V8J2tcYWAFBcZl4acDp6Yw='",
  "style-src 'self'",
  "font-src 'self'",
  "img-src 'self' data: blob:",
  "connect-src 'self' https://api.github.com",
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'none'"
].join('; ');
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', CSP_HEADER);
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Record identifiers are stored in plaintext by design: the client must be able
// to address a record without decrypting it. They therefore must not describe
// their own contents. Seeded ids are generated randomly for the same reason
// user-created ids are timestamps, so nothing about a vault is legible from the
// key set alone.
function newId(prefix) {
  return prefix + '-' + crypto.randomBytes(8).toString('hex');
}

// Initial default data if store file doesn't exist
function buildInitialData() {
  const generalId = newId('f');
  const now = new Date().toISOString();
  return {
    schemaVersion: 2,
    kdf: null,
    folders: [
      { id: generalId, name: 'General', parentId: null },
      { id: newId('f'), name: 'Personal', parentId: null }
    ],
    notes: [
      {
        id: newId('n'),
        folderId: generalId,
        title: 'Welcome to LucID',
        content: '# Welcome to LucID\n\nLucID is a self-hosted, privacy-focused note-taking application with client-side **AES-256-GCM end-to-end encryption**.\n\n## Capabilities\n- **Client-side E2EE**: your passphrase encrypts note titles, contents, tags and folder names in the browser before anything is stored. The server holds ciphertext it cannot read.\n- **Dual split view**: toggle between side-by-side and top-bottom layouts.\n- **Theme engine**: Dusk Ember (dark), Amber Hour (twilight) and Warm Linen (light).\n- **Folders and tags**: expandable hierarchy with instant search.\n\nDelete this note whenever you like. Nothing depends on it.',
        isEncrypted: false,
        tags: ['welcome', 'lucid'],
        createdAt: now,
        updatedAt: now
      }
    ],
    authVerifier: null
  };
}

// B-02: a corrupt store must NEVER silently become the default vault. If we
// returned defaults here, the client would load them and the next autosave would
// overwrite the damaged-but-possibly-recoverable file. Instead we throw, the API
// returns an error, and the client stays locked so nothing is written.
function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    const seeded = buildInitialData();
    writeData(seeded);
    return seeded;
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    const backup = DATA_FILE + '.corrupt-' + Date.now();
    try { fs.copyFileSync(DATA_FILE, backup); } catch (e) { /* best effort */ }
    console.error(`Store is not valid JSON. Preserved a copy at ${backup}. Refusing to serve defaults.`);
    const e = new Error('STORE_CORRUPT');
    e.backup = backup;
    throw e;
  }
}

// B-01: atomic write — serialize, write to a temp file in the same directory,
// fsync, then rename. A crash or full disk can no longer truncate the live vault.
// B-05: throws on failure so the caller can report a real error instead of "ok".
function writeData(data) {
  const tmp = DATA_FILE + '.tmp-' + process.pid;
  const payload = JSON.stringify(data, null, 2);
  let fd;
  try {
    fd = fs.openSync(tmp, 'w');
    fs.writeFileSync(fd, payload);
    fs.fsyncSync(fd);
    fs.closeSync(fd);
    fd = undefined;
    fs.renameSync(tmp, DATA_FILE);
  } catch (err) {
    if (fd !== undefined) { try { fs.closeSync(fd); } catch (e) {} }
    try { if (fs.existsSync(tmp)) fs.unlinkSync(tmp); } catch (e) {}
    console.error('Error writing data file:', err);
    throw err;
  }
}

const pkg = require('./package.json');
const APP_VERSION = process.env.VERSION || pkg.version || '2.4.0-dev';

// REST Endpoints
app.get('/api/version', (req, res) => {
  res.json({ version: APP_VERSION });
});

app.get('/api/store', (req, res) => {
  try {
    res.json(readData());
  } catch (err) {
    res.status(500).json({
      error: 'STORE_CORRUPT',
      message: 'Vault file is unreadable. A copy has been preserved on the server; it was not overwritten.'
    });
  }
});

// B-04: same-origin guard on state-changing requests. Blocks cross-site writes
// (CSRF) even for request types that bypass CORS preflight.
function sameOriginOnly(req, res, next) {
  const origin = req.get('Origin');
  if (!origin) return next(); // non-browser client (curl/CLI) — no ambient credentials to abuse
  if (CORS_ORIGIN && CORS_ORIGIN.split(',').map(s => s.trim()).includes(origin)) return next();
  try {
    if (new URL(origin).host === req.get('Host')) return next();
  } catch (e) { /* malformed Origin */ }
  return res.status(403).json({ error: 'Cross-origin write rejected' });
}

app.post('/api/store', sameOriginOnly, (req, res) => {
  const { folders, notes, authVerifier, kdf, schemaVersion } = req.body || {};
  if (!Array.isArray(folders) || !Array.isArray(notes)) {
    return res.status(400).json({ error: 'Invalid payload structure' });
  }

  // B-06: this endpoint REPLACES the whole vault. A structurally broken payload
  // (e.g. a half-built object from a client bug) would overwrite everything, so
  // reject anything that isn't a well-formed record before it can land.
  const wellFormed = v => v && typeof v === 'object' && !Array.isArray(v) && typeof v.id === 'string' && v.id.length > 0;
  if (!folders.every(wellFormed) || !notes.every(wellFormed)) {
    return res.status(400).json({ error: 'Malformed records — refusing to replace the vault' });
  }

  // Preserve fields the client did not send. If the store is corrupt we must NOT
  // fall back to defaults (that would discard the existing authVerifier/kdf and
  // make the vault permanently undecryptable) — refuse the write instead.
  let existing = {};
  try {
    existing = readData();
  } catch (err) {
    return res.status(409).json({
      error: 'STORE_CORRUPT',
      message: 'Refusing to overwrite an unreadable vault file. A copy has been preserved on the server.'
    });
  }

  try {
    writeData({
      schemaVersion: schemaVersion !== undefined ? schemaVersion : (existing.schemaVersion || 1),
      kdf: kdf !== undefined ? kdf : (existing.kdf || null),
      folders,
      notes,
      authVerifier: authVerifier !== undefined ? authVerifier : (existing.authVerifier || null)
    });
  } catch (err) {
    // B-05: never report success for a write that failed.
    return res.status(500).json({ error: 'WRITE_FAILED', message: 'Vault could not be written to disk.' });
  }
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`LucID server running on http://0.0.0.0:${PORT}`);
});

// B-08: graceful shutdown so a write in flight is never truncated by SIGTERM.
for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => {
    console.log(`${sig} received — closing server.`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 5000).unref();
  });
}
