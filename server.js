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
  const startedId = newId('f');
  const now = new Date().toISOString();
  return {
    schemaVersion: 2,
    kdf: null,
    folders: [
      { id: startedId, name: 'Getting Started', parentId: null },
      { id: newId('f'), name: 'Personal', parentId: null }
    ],
    notes: [
      {
        id: newId('n'),
        folderId: startedId,
        title: 'Start here',
        content: "# Start here\n\nA tour of what isn't obvious.\n\n## Layout\n\n**Editor**, **Split** and **Preview** sit above the centre pane. Click **Split** again while it is already active and the layout flips between side-by-side and top-and-bottom. That choice sticks per browser, including across locks.\n\nThe arrows in the top corners collapse either side pane, and any divider can be dragged to resize. The inspector on the right carries the note's outline, its tags and its metrics. Click an outline entry to jump to that heading.\n\n## The three explorer views\n\nThe pills above your folders switch the left pane between **folders**, **tags** and **pinned**. Search covers titles and tags, filtering as you type.\n\nThis note is pinned, which is why it has a view of its own. Right-click any note for pin, tags, rename and delete.\n\n## Tags are a library, not labels\n\nRight-click a note and choose **Tags…**. Every tag in the vault is listed with a toggle: on where this note carries it, off where it is yours to apply. The menu stays open, so tagging several notes takes a few clicks instead of a few dialogs.\n\n`#ideas` is here, attached to nothing. Switch it on for this note, then switch it off. It stays in the list, because a tag belongs to the vault rather than to one note. It will still be there when you want it back months from now. **New tag…** is the only place you type a name, which is what keeps `#meeting` and `#meetings` from both existing. Renaming a tag renames it everywhere at once.\n\n## Delete is reversible until you say otherwise\n\nNotes and folders move to **Trash** at the bottom left with no confirmation, because nothing is lost yet. Click a trashed note to read it: it opens read-only, so you can identify something before deciding its fate. Drag a note onto the trash to delete it, drag it out onto a folder to restore it there, or use the right-click menu. The trash empties only when you empty it.\n\n## Footer\n\n- **Brush** — three themes: Dusk Ember, Amber Hour, Warm Linen.\n- **Aa** — four typefaces, all served from this machine, never a font CDN.\n- **Hourglass** — idle auto-lock, five minutes by default. One hour is the hard ceiling: the vault locks then whatever you set.\n- **Octocat** — the repository. It breathes when a newer release exists.\n- **Cloud** — saves are automatic and debounced. Click to flush and sync now.\n- **Pulse** — server health, re-checked every minute or on click.\n- **Shield** — encryption is live. It turns red when the browser has no Web Crypto, which in practice means the page is not on HTTPS.\n- **Lock** — locks the vault. Unlocking needs the passphrase, or the session key if the browser has stayed open.\n\n## The one irreversible thing\n\nYour passphrase derives the key that encrypts every title, body, tag and folder name before any of it is sent. The key never leaves the browser and is stored nowhere, so there is no reset and no recovery. Root access to the machine running this does not help either: the vault on disk is ciphertext, and the passphrase is not in it. Back the passphrase up the way you would back up a key to a safe.\n\n## Worth trying now\n\n- [ ] Click **Split** twice to flip the orientation\n- [ ] Switch `#ideas` on for this note, then off\n- [ ] Delete this note and restore it from the trash\n- [ ] Change theme and typeface in the footer\n",
        isEncrypted: false,
        tags: ['guide'],
        pinned: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: newId('n'),
        folderId: startedId,
        title: 'Markdown playground',
        content: "# Markdown playground\n\nStandard markdown, rendered live. Open **Split** and edit the left side.\n\n**Bold**, *italic*, ~~struck~~, `inline code`, and a [link](https://github.com/Arelius-D/LucID) that opens in a new tab.\n\n1. Ordered lists\n2. And nested ones\n   - like this\n   - and this\n\n- [x] Task lists render as checkboxes\n- [ ] Including unticked ones\n\n| Shortcut | Does |\n| :--- | :--- |\n| `Ctrl`/`Cmd` + `S` | Flush the pending save |\n| `Esc` | Close search |\n| Arrows / `Enter` | Move and open in the tree |\n\n```js\n// Fenced blocks are highlighted, and the highlight theme follows the app theme.\nconst carried = notes.filter(n => !n.trashed);\nconsole.log(`${carried.length} notes, encrypted before any of them leaves the browser`);\n```\n\n> Blockquotes for the thing you want to find again.\n\n---\n\nThe outline on the right is built from the headings above. Metrics under it count words and characters as you type.\n",
        isEncrypted: false,
        tags: ['guide', 'markdown'],
        createdAt: now,
        updatedAt: now
      }
    ],
    // The tag library ships with one tag applied to nothing, so a fresh vault
    // shows the off state of the tag toggles without the user creating anything.
    tags: ['guide', 'ideas', 'markdown'],
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
const APP_VERSION = process.env.VERSION || pkg.version || '2.10.0-dev';

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
  const { folders, notes, tags, authVerifier, kdf, schemaVersion } = req.body || {};
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
      // The tag library: tags exist independently of any note carrying them, so
      // a tag removed from its last note can still be re-applied later. Absent
      // from the payload (an older client) means keep what is stored, exactly
      // like kdf and authVerifier — an old app can never silently drop it.
      tags: Array.isArray(tags) ? tags : (existing.tags || []),
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
