/* ═══════════════════════════════════════════════════
   LucID — Client Application
   Auto-save, E2EE, Inline Iconsax SVGs, In-App Modals,
   Cryptographic Passphrase Validation, Seamless Theme Toggle,
   Expandable Tag Tree, Dual-Orientation Split View with Iconsax SVGs,
   and Context Menu Actions
   ═══════════════════════════════════════════════════ */

// ─── INLINE ICONSAX SVG MAP ─────────────────────────
const ICONS = {
  chevron: `<svg class="icon-svg tree-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>`,
  folderClosed: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11v6c0 4-1 5-5 5H7c-4 0-5-1-5-5V7c0-4 1-5 5-5h1.5c1.5 0 1.83.44 2.4 1.2l1.5 2c.38.5.6.8 1.6.8h3c4 0 5 1 5 5z"/><path d="M8 2h9c2 0 3 1 3 3v1.38"/></svg>`,
  folderOpen: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.67 14.3l-.4 5c-.15 1.53-.27 2.7-2.98 2.7H5.71C3 22 2.88 20.83 2.73 19.3l-.4-5c-.08-.83.18-1.6.65-2.19l.02-.02C3.55 11.42 4.38 11 5.31 11h13.38c.93 0 1.75.42 2.29 1.07.01.01.02.02.02.03.49.59.76 1.36.67 2.2z"/><path d="M3.5 11.43V6.28c0-3.4.85-4.25 4.25-4.25h1.27c1.27 0 1.56.38 2.04 1.02l1.27 1.7c.32.42.51.68 1.36.68h2.55c3.4 0 4.25.85 4.25 4.25v1.79M9.43 17h5.14"/></svg>`,
  folderCross: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13.81 15.73l-3.54-3.54M13.77 12.23l-3.54 3.54"/><path d="M22 11v6c0 4-1 5-5 5H7c-4 0-5-1-5-5V7c0-4 1-5 5-5h1.5c1.5 0 1.83.44 2.4 1.2l1.5 2c.38.5.6.8 1.6.8h3c4 0 5 1 5 5z"/></svg>`,
  folderAdd: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12.06 16.5v-5M14.5 14h-5"/><path d="M22 11v6c0 4-1 5-5 5H7c-4 0-5-1-5-5V7c0-4 1-5 5-5h1.5c1.5 0 1.83.44 2.4 1.2l1.5 2c.38.5.6.8 1.6.8h3c4 0 5 1 5 5z"/></svg>`,
  note: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z"/><path d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 13h4M8 17h8"/></svg>`,
  noteAdd: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.56 18v-5M12 15.5H7M8 2v3M16 2v3M15.81 3.42c3.34.12 5.03 1.35 5.13 6.05l.13 6.17c.08 4.12-.87 6.19-5.87 6.3l-6 .12c-5 .1-6.04-1.94-6.12-6.05l-.14-6.18c-.1-4.7 1.55-6 4.87-6.25l8-.16z"/></svg>`,
  noteRemove: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v10c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V7c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z"/><path d="M14.5 4.5v2c0 1.1.9 2 2 2h2M8 14h8"/></svg>`,
  tagCross: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3H6C4.34 3 3 4.34 3 6v4c0 .8.32 1.56.88 2.12l8 8c1.17 1.17 3.07 1.17 4.24 0l4-4c1.17-1.17 1.17-3.07 0-4.24l-8-8C11.56 3.32 10.8 3 10 3z"/><path d="M14.83 9.17l-5.66 5.66M14.83 14.83L9.17 9.17"/></svg>`,
  closeSquare: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.17 14.83l5.66-5.66M14.83 14.83L9.17 9.17M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7z"/></svg>`,
  securitySafe: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.91 11.12c0 4.89-3.55 9.47-8.4 10.81-.33.09-.69.09-1.02 0-4.85-1.34-8.4-5.92-8.4-10.81V6.73c0-.82.62-1.75 1.39-2.06l5.57-2.28c1.25-.51 2.66-.51 3.91 0l5.57 2.28c.76.31 1.39 1.24 1.39 2.06l-.01 4.39z"/><path d="M12 12.5a2 2 0 100-4 2 2 0 000 4zM12 12.5v3"/></svg>`,
  sun: `<svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
  moon: `<svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`,
  eye: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15.58 12c0 1.98-1.6 3.58-3.58 3.58S8.42 13.98 8.42 12s1.6-3.58 3.58-3.58 3.58 1.6 3.58 3.58z"/><path d="M12 20.27c3.53 0 6.82-2.08 9.11-5.68.9-1.41.9-3.78 0-5.19-2.29-3.6-5.58-5.68-9.11-5.68-3.53 0-6.82 2.08-9.11 5.68-.9 1.41-.9 3.78 0 5.19 2.29 3.6 5.58 5.68 9.11 5.68z"/></svg>`,
  info: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10zM12 8v5"/><path stroke-width="2" d="M11.995 16h.009"/></svg>`,
  tickCircle: `<svg class="icon-svg check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z"/><path d="M7.75 12l2.83 2.83 5.67-5.66"/></svg>`,
  refresh2: `<svg class="icon-svg icon-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2c3.04 0 5.78 1.36 7.64 3.51M22 2v4h-4"/></svg>`,
  syncError: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z"/><path d="M9.17 14.83l5.66-5.66M14.83 14.83L9.17 9.17"/></svg>`,
  edit: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13.26 3.6L5.05 12.29c-.31.33-.61.97-.67 1.41l-.37 3.22c-.13 1.17.7 1.98 1.86 1.81l3.2-.46c.44-.06 1.07-.38 1.38-.7l8.21-8.69c1.42-1.5 2.06-3.21-.09-5.24-2.14-2.01-3.83-1.32-5.31.16z"/><path d="M11.89 5.05l5.06 4.77"/></svg>`,
  elementSplit: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3H3v7h7V3zM21 3h-7v7h7V3zM10 14H3v7h7v-7zM21 14h-7v7h7v-7z"/></svg>`,
  element3: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3H3v18h7V3zM21 3h-7v18h7V3z"/></svg>`,
  element2: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10V3h18v7H3zM3 21v-7h18v7H3z"/></svg>`,
  tag: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3H6C4.34 3 3 4.34 3 6v4c0 .8.32 1.56.88 2.12l8 8c1.17 1.17 3.07 1.17 4.24 0l4-4c1.17-1.17 1.17-3.07 0-4.24l-8-8C11.56 3.32 10.8 3 10 3z"/><path d="M7 7h.01"/></svg>`,
  arrowCircleLeft: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10zM13.26 15.53L9.74 12l3.52-3.53"/></svg>`,
  arrowCircleRight: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10zM10.74 15.53L14.26 12l-3.52-3.53"/></svg>`
};

const AUTH_MAGIC_SENTINEL = 'LUCID_VAULT_AUTHENTICATED_V1';

// First-run view: editor + preview stacked top/bottom (works on any screen width).
const DEFAULT_VIEW_MODE = 'split-vertical';

// --- STATE ---
const state = {
  folders: [],
  notes: [],
  authVerifier: null,
  activeNoteId: null,
  activeFolderId: null,
  searchQuery: '',
  encryptionKey: null,
  saveTimeout: null,
  pendingNoteId: null,     // note the debounced save is bound to (J-02)
  rawStore: null,          // encrypted store exactly as received from the server
  kdf: null,               // { algo, iterations, salt } — per-vault, from the store
  schemaVersion: null,
  openFolderIds: new Set(),
  openTagNames: new Set(),
  treeFocusId: null,
  dragNoteId: null,
  viewMode: DEFAULT_VIEW_MODE, // see DEFAULT_VIEW_MODE — single source of truth (J-07)
  explorerMode: 'folders', // 'folders' or 'tags'
  activeTagFilter: null,
  decryptedTitleCache: new Map(),
};

// --- API PATH ---
function apiPath(endpoint) {
  const base = window.location.pathname.replace(/\/+$/, '');
  return base + '/' + endpoint;
}

// ─── MODAL FOCUS MANAGEMENT (A-02) ─────────────────
// Without this, Tab walks out of an open dialog into the page behind it and the
// invoking control loses focus when the dialog closes.
const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

function trapFocus(modal) {
  const previouslyFocused = document.activeElement;
  function onKeydown(e) {
    if (e.key !== 'Tab') return;
    const items = [...modal.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  modal.addEventListener('keydown', onKeydown);
  // Returns a cleanup that also restores focus to whatever opened the dialog.
  return () => {
    modal.removeEventListener('keydown', onKeydown);
    if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
  };
}

// ─── IN-APP MODALS ─────────────────────────────────
function showConfirmModal(title, message) {
  return new Promise(resolve => {
    const modal = document.getElementById('modal-confirm');
    const titleEl = document.getElementById('modal-confirm-title');
    const msgEl = document.getElementById('modal-confirm-msg');
    const cancelBtn = document.getElementById('modal-btn-cancel');
    const dangerBtn = document.getElementById('modal-btn-danger');

    titleEl.textContent = title;
    msgEl.textContent = message;
    modal.classList.remove('hidden');
    const releaseFocus = trapFocus(modal);
    cancelBtn.focus();   // safe default on a destructive dialog

    function cleanup() {
      modal.classList.add('hidden');
      cancelBtn.removeEventListener('click', onCancel);
      dangerBtn.removeEventListener('click', onDanger);
      modal.removeEventListener('keydown', onKeyDown);
      releaseFocus();
    }

    function onCancel() { cleanup(); resolve(false); }
    function onDanger() { cleanup(); resolve(true); }
    // A-03: the destructive dialog is the one that most needs an escape route.
    function onKeyDown(e) { if (e.key === 'Escape') onCancel(); }

    cancelBtn.addEventListener('click', onCancel);
    dangerBtn.addEventListener('click', onDanger);
    modal.addEventListener('keydown', onKeyDown);
  });
}

function showPromptModal(title, message, defaultValue = '') {
  return new Promise(resolve => {
    const modal = document.getElementById('modal-prompt');
    const titleEl = document.getElementById('modal-prompt-title');
    const msgEl = document.getElementById('modal-prompt-msg');
    const inputEl = document.getElementById('modal-prompt-input');
    const cancelBtn = document.getElementById('modal-prompt-btn-cancel');
    const submitBtn = document.getElementById('modal-prompt-btn-submit');

    titleEl.textContent = title;
    msgEl.textContent = message;
    inputEl.value = defaultValue;
    modal.classList.remove('hidden');
    const releaseFocus = trapFocus(modal);
    inputEl.focus();
    inputEl.select();

    function cleanup() {
      modal.classList.add('hidden');
      cancelBtn.removeEventListener('click', onCancel);
      submitBtn.removeEventListener('click', onSubmit);
      inputEl.removeEventListener('keydown', onKeyDown);
      releaseFocus();
    }

    function onCancel() { cleanup(); resolve(null); }
    function onSubmit() { const val = inputEl.value.trim(); cleanup(); resolve(val || null); }
    function onKeyDown(e) { if (e.key === 'Enter') onSubmit(); if (e.key === 'Escape') onCancel(); }

    cancelBtn.addEventListener('click', onCancel);
    submitBtn.addEventListener('click', onSubmit);
    inputEl.addEventListener('keydown', onKeyDown);
  });
}

// ─── E2EE CRYPTO ───────────────────────────────────
// ─── KDF PARAMETERS (S-01 / S-02) ──────────────────
// The salt is RANDOM PER VAULT and stored (unencrypted, as it must be) in the
// store. It is not secret; its job is to make every vault's key derivation
// unique, so one precomputed table cannot attack multiple vaults and the same
// passphrase never yields the same key on two installs.
const KDF_DEFAULTS = { algo: 'PBKDF2-SHA256', iterations: 600000, hash: 'SHA-256' };
const SCHEMA_VERSION = 2;

function bytesToB64(bytes) { return btoa(String.fromCharCode(...bytes)); }
function b64ToBytes(b64) {
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
function newKdfParams() {
  return {
    algo: KDF_DEFAULTS.algo,
    iterations: KDF_DEFAULTS.iterations,
    salt: bytesToB64(crypto.getRandomValues(new Uint8Array(16)))
  };
}

async function deriveKey(passphrase, kdf) {
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('SECURE_CONTEXT_REQUIRED');
  }
  if (!kdf || !kdf.salt) throw new Error('KDF_PARAMS_MISSING');
  const enc = new TextEncoder();
  const km = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: b64ToBytes(kdf.salt),
      iterations: kdf.iterations || KDF_DEFAULTS.iterations,
      hash: KDF_DEFAULTS.hash
    },
    km,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}


// ─── SESSION KEY STORAGE (S-03) ────────────────────
// The master passphrase is NEVER persisted. We keep the derived, non-extractable
// CryptoKey in IndexedDB — its bytes cannot be read back by any script (unlike a
// passphrase string in sessionStorage, which an XSS could simply read). A per-tab
// session token gates reuse, preserving the previous "unlocked until tab closes"
// behaviour.
const IDB_NAME = 'lucid-vault';
const IDB_STORE = 'keys';
const IDB_RECORD = 'session-key';
const SESSION_TOKEN = 'lucid-session';

function idbOpen() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(IDB_STORE)) req.result.createObjectStore(IDB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbPut(value) {
  return idbOpen().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put(value, IDB_RECORD);
    tx.oncomplete = () => { db.close(); resolve(true); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  }));
}

function idbGet() {
  return idbOpen().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readonly');
    const r = tx.objectStore(IDB_STORE).get(IDB_RECORD);
    r.onsuccess = () => { db.close(); resolve(r.result || null); };
    r.onerror = () => { db.close(); reject(r.error); };
  }));
}

async function persistSessionKey(key) {
  try {
    const token = (crypto.randomUUID && crypto.randomUUID()) ||
      String(Date.now()) + Math.random().toString(36).slice(2);
    await idbPut({ key, token });
    sessionStorage.setItem(SESSION_TOKEN, token);
  } catch (e) {
    console.warn('Session key not persisted; passphrase will be required after reload.', e);
  }
}

async function clearSessionKey() {
  sessionStorage.removeItem(SESSION_TOKEN);
  try {
    const db = await idbOpen();
    await new Promise(resolve => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete(IDB_RECORD);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); resolve(); };
    });
  } catch (e) { /* nothing to clear */ }
}

async function restoreKeyFromSession() {
  const token = sessionStorage.getItem(SESSION_TOKEN);
  if (!token) return false;
  try {
    const rec = await idbGet();
    if (rec && rec.key && rec.token === token && state.authVerifier) {
      const check = await tryDecryptText(state.authVerifier, rec.key);
      if (check === AUTH_MAGIC_SENTINEL) {
        state.encryptionKey = rec.key;
        const src = state.rawStore || { folders: state.folders, notes: state.notes };
        const plain = await decryptVaultIntoState(src, rec.key);
        state.folders = plain.folders;
        state.notes = plain.notes;
        return true;
      }
    }
  } catch (e) {
    console.warn('Session key restore failed:', e);
  }
  await clearSessionKey();
  return false;
}

async function encryptText(text, key) {
  // S-06: fail CLOSED. Returning plaintext when the key is missing would silently
  // write unencrypted notes to the server while the UI still claims E2EE.
  if (!key) throw new Error('ENCRYPT_WITHOUT_KEY');
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(text));
  const buf = new Uint8Array(ct);
  const payload = new Uint8Array(iv.length + buf.length);
  payload.set(iv);
  payload.set(buf, iv.length);
  return 'ENC:' + btoa(String.fromCharCode(...payload));
}

// S-05: on failure this THROWS. It must never return a placeholder string that
// could land in the editor and then be encrypted back over the real ciphertext.
async function decryptText(data, key) {
  if (!key || !data || !data.startsWith('ENC:')) return data;
  const raw = atob(data.substring(4));
  const buf = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i);
  const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: buf.slice(0, 12) }, key, buf.slice(12));
  return new TextDecoder().decode(dec);
}

// Convenience for the one place a failed decrypt is tolerable (passphrase check).
async function tryDecryptText(data, key) {
  try { return await decryptText(data, key); } catch (e) { return null; }
}

// ─── VAULT BOUNDARY (S-07) ─────────────────────────
// EVERYTHING the user authors is encrypted at rest: note titles, note bodies,
// tags, and folder names. Only structural ids, timestamps and the KDF params
// stay in clear (ids are opaque; the salt must be readable to derive the key).
//
// Ciphertext is non-deterministic (random IV per encryption), so the same tag
// encrypts to different bytes each time. Grouping/filtering therefore CANNOT be
// done on ciphertext — the vault is decrypted once into memory on unlock, the
// app works entirely in plaintext, and everything is re-encrypted on save.

async function decryptVaultIntoState(raw, key) {
  const folders = [];
  for (const f of (raw.folders || [])) {
    folders.push({ ...f, name: await decryptText(f.name, key) });
  }
  const notes = [];
  for (const n of (raw.notes || [])) {
    const tags = [];
    for (const t of (n.tags || [])) tags.push(await decryptText(t, key));
    notes.push({
      ...n,
      title: await decryptText(n.title, key),
      content: await decryptText(n.content, key),
      tags
    });
  }
  return { folders, notes };
}

async function encryptVaultFromState(key) {
  const folders = [];
  for (const f of state.folders) {
    folders.push({ ...f, name: await encryptText(f.name || '', key) });
  }
  const notes = [];
  for (const n of state.notes) {
    const tags = [];
    for (const t of (n.tags || [])) tags.push(await encryptText(t, key));
    notes.push({
      ...n,
      title: await encryptText(n.title || '', key),
      content: await encryptText(n.content || '', key),
      tags,
      isEncrypted: true
    });
  }
  return { folders, notes };
}

// ─── PERSISTENCE ───────────────────────────────────
async function fetchStore() {
  try {
    const res = await fetch(apiPath('api/store'));
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    // Held as-is (still encrypted) until a key exists; decrypted on unlock.
    state.rawStore = data;
    state.schemaVersion = data.schemaVersion || 1;
    state.kdf = data.kdf || null;
    if (data.folders && data.folders.length) state.folders = data.folders;
    if (data.notes && data.notes.length) state.notes = data.notes;
    state.authVerifier = data.authVerifier || null;

    // Restore saved tree open/collapse state; first run (no saved state) defaults to all folders open.
    const savedOpenFolders = localStorage.getItem('lucid-open-folders');
    if (savedOpenFolders !== null) {
      try { state.openFolderIds = new Set(JSON.parse(savedOpenFolders)); }
      catch (e) { state.folders.forEach(f => state.openFolderIds.add(f.id)); }
    } else {
      state.folders.forEach(f => state.openFolderIds.add(f.id));
    }
    const savedOpenTags = localStorage.getItem('lucid-open-tags');
    if (savedOpenTags !== null) {
      try { state.openTagNames = new Set(JSON.parse(savedOpenTags)); } catch (e) {}
    }

    if (state.notes.length > 0) {
      state.activeNoteId = state.notes[0].id;
      state.activeFolderId = state.notes[0].folderId;
    }
    await preloadDecryptedTitles();
    renderAll();
    updateLockScreenUI();
  } catch (err) {
    console.warn('fetchStore failed:', err);
    showSave('Error loading', 'error');
  }
}

// Top-level so both fetchStore() and the DOMContentLoaded init can call it.
function updateLockScreenUI() {
  const lockTitle = document.getElementById('lock-title');
  const lockSubDesc = document.getElementById('lock-sub-desc');
  const lockConfirmInput = document.getElementById('lock-passphrase-confirm');
  const lockBtn = document.getElementById('lock-unlock-btn');
  const lockStatus = document.getElementById('lock-status');

  if (!state.authVerifier) {
    // first-time setup: not "locked" yet, so hide the locked cue
    if (lockStatus) lockStatus.classList.add('hidden');
    if (lockTitle) lockTitle.textContent = 'Initialize LucID';
    if (lockSubDesc) lockSubDesc.innerHTML = 'Create your master passphrase to initialize your vault. All data is encrypted client-side with <strong>AES-256-GCM</strong> before reaching the server.';
    if (lockConfirmInput) lockConfirmInput.classList.remove('hidden');
    if (lockBtn) {
      lockBtn.textContent = 'Next';
      lockBtn.disabled = true;
    }
  } else {
    if (lockStatus) lockStatus.classList.remove('hidden');
    if (lockTitle) lockTitle.textContent = 'LucID';
    if (lockSubDesc) lockSubDesc.innerHTML = 'Enter your master passphrase to unlock. All data is encrypted client-side with <strong>AES-256-GCM</strong> before reaching the server.';
    if (lockConfirmInput) lockConfirmInput.classList.add('hidden');
    if (lockBtn) {
      lockBtn.textContent = 'Unlock';
      lockBtn.disabled = false;
    }
  }
}

// Persist tree open/collapse to localStorage (non-sensitive UI pref).
function saveTreeState() {
  try {
    localStorage.setItem('lucid-open-folders', JSON.stringify([...state.openFolderIds]));
    localStorage.setItem('lucid-open-tags', JSON.stringify([...state.openTagNames]));
  } catch (e) {}
}

async function saveStore() {
  // Fail closed: never write the in-memory PLAINTEXT vault to the server.
  if (!state.encryptionKey || !state.kdf) {
    console.warn('saveStore aborted: vault is locked.');
    return;
  }
  try {
    showSave('Syncing…', 'saving');
    const { folders, notes } = await encryptVaultFromState(state.encryptionKey);
    const res = await fetch(apiPath('api/store'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        schemaVersion: SCHEMA_VERSION,
        kdf: state.kdf,
        folders,
        notes,
        authVerifier: state.authVerifier
      })
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    showSave('Synced', '');
  } catch (err) {
    console.error('saveStore failed:', err);
    showSave('Sync error', 'error');
  }
}

// After decryptVaultIntoState(), note titles in state are already plaintext.
// The cache is kept only so existing render call-sites keep working.
async function preloadDecryptedTitles() {
  for (const n of state.notes) {
    state.decryptedTitleCache.set(n.id, n.title || 'Untitled');
  }
}

function extractTitleFromContent(content) {
  if (!content) return 'Untitled';
  const lines = content.trim().split('\n');
  if (!lines.length) return 'Untitled';
  const firstLine = lines[0].replace(/^[#\s*->]+/, '').trim();
  return firstLine.substring(0, 50) || 'Untitled';
}

// J-01/J-02: copy the editor into the note it belongs to. Captured against a
// specific note id, so a note switch inside the debounce window can no longer
// write one note's text into another — or silently discard it.
function commitEditorToNote(noteId) {
  const note = state.notes.find(n => n.id === noteId);
  const ta = document.getElementById('markdown-textarea');
  if (!note || !ta || ta.readOnly) return false;
  const rawContent = ta.value || '';
  const rawTitle = extractTitleFromContent(rawContent);
  if (note.content === rawContent && note.title === rawTitle) return false; // nothing changed
  note.title = rawTitle;
  note.content = rawContent;
  note.isEncrypted = true;
  note.updatedAt = new Date().toISOString();
  state.decryptedTitleCache.set(note.id, rawTitle);
  return true;
}

function triggerAutoSave() {
  if (state.saveTimeout) clearTimeout(state.saveTimeout);
  if (!state.encryptionKey) return;
  const targetId = state.activeNoteId;      // bind now, not when the timer fires
  state.pendingNoteId = targetId;
  showSave('Syncing…', 'saving');
  state.saveTimeout = setTimeout(async () => {
    state.saveTimeout = null;
    commitEditorToNote(targetId);
    state.pendingNoteId = null;
    await saveStore();
    if (state.explorerMode === 'folders') renderTree();
    else renderTagTree();
    renderTOC();
  }, 500);
}

// Run any pending autosave immediately instead of waiting out the debounce.
// Called before switching notes, and when the tab is hidden or closed.
async function flushPendingSave() {
  if (!state.saveTimeout) return;
  clearTimeout(state.saveTimeout);
  state.saveTimeout = null;
  const targetId = state.pendingNoteId || state.activeNoteId;
  state.pendingNoteId = null;
  if (!state.encryptionKey) return;
  commitEditorToNote(targetId);
  await saveStore();
}

function showSave(text, cls) {
  const el = document.getElementById('save-indicator');
  if (!el) return;
  el.className = 'sync-status-badge' + (cls ? ' ' + cls : '');
  if (cls === 'error') {
    el.title = 'Sync error: Failed to save changes';
    el.innerHTML = `${ICONS.syncError} <span>Sync error</span>`;
  } else if (cls === 'saving') {
    el.title = 'Syncing changes to vault…';
    el.innerHTML = `${ICONS.refresh2} <span>Syncing…</span>`;
  } else {
    el.title = 'Synced';
    el.innerHTML = `${ICONS.tickCircle} <span>Synced</span>`;
  }
}

// ─── RENDERERS ─────────────────────────────────────
function renderAll() {
  const folderTree = document.getElementById('folder-tree');
  const tagTree = document.getElementById('tag-tree');
  if (state.explorerMode === 'folders') {
    if (tagTree) tagTree.classList.add('hidden');
    if (folderTree) folderTree.classList.remove('hidden');
    renderTree();
  } else {
    if (folderTree) folderTree.classList.add('hidden');
    if (tagTree) tagTree.classList.remove('hidden');
    renderTagTree();
  }
  renderActiveNote();
  renderTOC();
  renderMetrics();
  renderTags();
  updateE2EEUI();
}

function renderTree() {
  const container = document.getElementById('folder-tree');
  if (!container) return;
  container.innerHTML = '';
  container.setAttribute('role', 'tree');
  container.setAttribute('aria-label', 'Folders');
  const q = state.searchQuery.toLowerCase();

  state.folders.forEach(folder => {
    const folderNotes = state.notes.filter(n => {
      if (n.folderId !== folder.id) return false;
      if (state.activeTagFilter && (!n.tags || !n.tags.includes(state.activeTagFilter))) return false;
      if (!q) return true;
      const title = state.decryptedTitleCache.get(n.id) || n.title || '';
      return (title && title.toLowerCase().includes(q)) ||
             (n.tags && n.tags.some(t => t.toLowerCase().includes(q)));
    });

    const isOpen = state.openFolderIds.has(folder.id);
    const isActive = state.activeFolderId === folder.id;

    const wrapper = document.createElement('div');
    wrapper.className = 'tree-folder';

    const header = document.createElement('div');
    header.className = 'tree-folder-header' + (isActive ? ' active' : '') + (isOpen ? ' open' : '');
    header.setAttribute('role', 'treeitem');
    header.setAttribute('aria-expanded', String(isOpen));
    header.tabIndex = -1;
    header.dataset.treeId = 'folder:' + folder.id;

    const folderIconHtml = isOpen ? ICONS.folderOpen : ICONS.folderClosed;
    header.innerHTML = `${ICONS.chevron}${folderIconHtml} <span>${escapeHtml(folder.name)}</span><span class="count-badge">${folderNotes.length}</span>`;

    header.addEventListener('click', () => {
      state.activeFolderId = folder.id;
      if (state.openFolderIds.has(folder.id)) state.openFolderIds.delete(folder.id);
      else state.openFolderIds.add(folder.id);
      saveTreeState();
      renderTree();
    });

    // Right-click context menu for Folder
    header.addEventListener('contextmenu', e => {
      e.preventDefault();
      showTreeContextMenu(e.clientX, e.clientY, [
        { label: 'New Note in Folder', icon: ICONS.noteAdd, action: () => createNoteInFolder(folder.id) },
        { label: 'Rename Folder', icon: ICONS.edit, action: () => renameFolder(folder) },
        { divider: true },
        { label: 'Delete Folder', icon: ICONS.folderCross, danger: true, action: () => deleteFolder(folder) }
      ]);
    });

    wrapper.appendChild(header);

    const notesContainer = document.createElement('div');
    notesContainer.className = 'tree-notes' + (isOpen ? '' : ' collapsed');
    notesContainer.setAttribute('role', 'group');
    notesContainer.style.maxHeight = isOpen ? ((folderNotes.length * 36 + 12) / 16) + 'rem' : '0';

    folderNotes.forEach(note => {
      const noteEl = document.createElement('div');
      noteEl.className = 'tree-note' + (note.id === state.activeNoteId ? ' active' : '');
      noteEl.setAttribute('role', 'treeitem');
      noteEl.setAttribute('aria-selected', String(note.id === state.activeNoteId));
      noteEl.tabIndex = -1;
      noteEl.dataset.treeId = 'note:' + note.id;

      let displayTitle = state.decryptedTitleCache.get(note.id);
      if (!displayTitle || displayTitle.startsWith('ENC:')) {
        displayTitle = note.title && !note.title.startsWith('ENC:') ? note.title : 'Untitled Note';
      }

      noteEl.innerHTML = `${ICONS.note} <span>${escapeHtml(displayTitle)}</span>`;

      noteEl.addEventListener('click', async e => {
        e.stopPropagation();
        await flushPendingSave();   // J-02: never drop the previous note's edits
        state.activeNoteId = note.id;
        state.activeFolderId = note.folderId;
        renderAll();
      });

      // Right-click context menu for Note
      noteEl.addEventListener('contextmenu', e => {
        e.preventDefault();
        showTreeContextMenu(e.clientX, e.clientY, [
          { label: 'Rename Note', icon: ICONS.edit, action: () => renameNote(note) },
          { label: 'Manage Tags', icon: ICONS.tag, action: () => manageNoteTags(note) },
          { divider: true },
          { label: 'Delete Note', icon: ICONS.noteRemove, danger: true, action: () => deleteNote(note) }
        ]);
      });

      notesContainer.appendChild(noteEl);
    });

    wrapper.appendChild(notesContainer);
    container.appendChild(wrapper);
  });
  updateTreeRoving(container);
}

// ─── EXPANDABLE NESTED TAG TREE IN TAG VIEW ──────
function renderTagTree() {
  const container = document.getElementById('tag-tree');
  if (!container) return;
  container.innerHTML = '';
  container.setAttribute('role', 'tree');
  container.setAttribute('aria-label', 'Tags');
  const q = state.searchQuery.toLowerCase();

  const tagMap = new Map();
  state.notes.forEach(n => {
    if (n.tags && n.tags.length) {
      n.tags.forEach(t => {
        if (!q || t.toLowerCase().includes(q)) {
          const list = tagMap.get(t) || [];
          list.push(n);
          tagMap.set(t, list);
        }
      });
    }
  });

  if (!tagMap.size) {
    container.innerHTML = '<div class="empty-state" style="padding:1rem;text-align:center">No matching tags</div>';
    return;
  }

  Array.from(tagMap.entries()).sort((a,b) => a[0].localeCompare(b[0])).forEach(([tag, tagNotes]) => {
    const isOpen = state.openTagNames.has(tag);
    const wrapper = document.createElement('div');
    wrapper.className = 'tree-folder';

    const header = document.createElement('div');
    header.className = 'tree-folder-header' + (isOpen ? ' open' : '');
    header.setAttribute('role', 'treeitem');
    header.setAttribute('aria-expanded', String(isOpen));
    header.tabIndex = -1;
    header.dataset.treeId = 'tag:' + tag;
    header.innerHTML = `${ICONS.chevron}${ICONS.tag} <span>#${escapeHtml(tag)}</span><span class="count-badge">${tagNotes.length}</span>`;

    header.addEventListener('click', () => {
      if (state.openTagNames.has(tag)) state.openTagNames.delete(tag);
      else state.openTagNames.add(tag);
      saveTreeState();
      renderTagTree();
    });

    header.addEventListener('contextmenu', e => {
      e.preventDefault();
      showTreeContextMenu(e.clientX, e.clientY, [
        { label: `Rename Tag #${tag}`, icon: ICONS.edit, action: () => renameTagGlobal(tag) },
        { label: `Remove Tag #${tag}`, icon: ICONS.tagCross, danger: true, action: () => removeTagGlobal(tag) }
      ]);
    });

    wrapper.appendChild(header);

    const notesContainer = document.createElement('div');
    notesContainer.className = 'tree-notes' + (isOpen ? '' : ' collapsed');
    notesContainer.setAttribute('role', 'group');
    notesContainer.style.maxHeight = isOpen ? ((tagNotes.length * 36 + 12) / 16) + 'rem' : '0';

    tagNotes.forEach(note => {
      const noteEl = document.createElement('div');
      noteEl.className = 'tree-note' + (note.id === state.activeNoteId ? ' active' : '');
      noteEl.setAttribute('role', 'treeitem');
      noteEl.setAttribute('aria-selected', String(note.id === state.activeNoteId));
      noteEl.tabIndex = -1;
      noteEl.dataset.treeId = 'note:' + note.id;

      let displayTitle = state.decryptedTitleCache.get(note.id);
      if (!displayTitle || displayTitle.startsWith('ENC:')) {
        displayTitle = note.title && !note.title.startsWith('ENC:') ? note.title : 'Untitled Note';
      }

      noteEl.innerHTML = `${ICONS.note} <span>${escapeHtml(displayTitle)}</span>`;

      noteEl.addEventListener('click', async e => {
        e.stopPropagation();
        await flushPendingSave();   // J-02: never drop the previous note's edits
        state.activeNoteId = note.id;
        state.activeFolderId = note.folderId;
        renderAll();
      });

      noteEl.addEventListener('contextmenu', e => {
        e.preventDefault();
        showTreeContextMenu(e.clientX, e.clientY, [
          { label: 'Rename Note', icon: ICONS.edit, action: () => renameNote(note) },
          { label: 'Manage Tags', icon: ICONS.tag, action: () => manageNoteTags(note) },
          { divider: true },
          { label: 'Delete Note', icon: ICONS.noteRemove, danger: true, action: () => deleteNote(note) }
        ]);
      });

      notesContainer.appendChild(noteEl);
    });

    wrapper.appendChild(notesContainer);
    container.appendChild(wrapper);
  });
  updateTreeRoving(container);
}

// ─── TREE KEYBOARD NAVIGATION + ARIA ROVING TABINDEX ───────────────
function isTreeItemVisible(el) {
  return !!el && el.offsetParent !== null && !el.closest('.tree-notes.collapsed');
}
function updateTreeRoving(container) {
  const all = [...container.querySelectorAll('[role="treeitem"]')];
  const items = all.filter(isTreeItemVisible);
  if (!items.length) return;
  all.forEach(i => { i.tabIndex = -1; });
  let cur = state.treeFocusId ? items.find(i => i.dataset.treeId === state.treeFocusId) : null;
  if (!cur) cur = container.querySelector('.tree-note.active');
  if (!cur || !isTreeItemVisible(cur)) cur = items[0];
  cur.tabIndex = 0;
}
function refocusTree(container) {
  const all = [...container.querySelectorAll('[role="treeitem"]')];
  let el = state.treeFocusId ? all.find(i => i.dataset.treeId === state.treeFocusId && isTreeItemVisible(i)) : null;
  if (!el) el = all.find(i => i.tabIndex === 0 && isTreeItemVisible(i));
  if (el) { all.forEach(i => i.tabIndex = -1); el.tabIndex = 0; el.focus(); }
}
function initTreeKeyboard() {
  ['folder-tree', 'tag-tree'].forEach(id => {
    const container = document.getElementById(id);
    if (!container) return;
    container.addEventListener('keydown', e => {
      const items = [...container.querySelectorAll('[role="treeitem"]')].filter(isTreeItemVisible);
      const cur = document.activeElement;
      const idx = items.indexOf(cur);
      if (idx < 0) return;
      const isFolder = cur.classList.contains('tree-folder-header');
      const move = el => { if (!el) return; items.forEach(i => i.tabIndex = -1); el.tabIndex = 0; el.focus(); state.treeFocusId = el.dataset.treeId; };
      const activate = () => { state.treeFocusId = cur.dataset.treeId; cur.click(); requestAnimationFrame(() => refocusTree(container)); };
      switch (e.key) {
        case 'ArrowDown': e.preventDefault(); move(items[Math.min(idx + 1, items.length - 1)]); break;
        case 'ArrowUp':   e.preventDefault(); move(items[Math.max(idx - 1, 0)]); break;
        case 'Home':      e.preventDefault(); move(items[0]); break;
        case 'End':       e.preventDefault(); move(items[items.length - 1]); break;
        case 'Enter':
        case ' ':         e.preventDefault(); activate(); break;
        case 'ArrowRight':
          if (isFolder) {
            e.preventDefault();
            if (cur.getAttribute('aria-expanded') === 'false') activate();
            else move(items[idx + 1]);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (isFolder && cur.getAttribute('aria-expanded') === 'true') activate();
          else { for (let j = idx - 1; j >= 0; j--) { if (items[j].classList.contains('tree-folder-header')) { move(items[j]); break; } } }
          break;
      }
    });
  });
}

// ─── RIGHT-CLICK CONTEXT MENU SYSTEM ───────────────
function showTreeContextMenu(x, y, items) {
  const menu = document.getElementById('tree-context-menu');
  menu.innerHTML = '';
  
  items.forEach(item => {
    if (item.divider) {
      const div = document.createElement('div');
      div.className = 'context-menu-divider';
      menu.appendChild(div);
      return;
    }
    const btn = document.createElement('button');
    btn.className = 'context-menu-item' + (item.danger ? ' danger' : '');
    btn.innerHTML = (item.icon || '') + `<span>${escapeHtml(item.label)}</span>`;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      closeContextMenu();
      item.action();
    });
    menu.appendChild(btn);
  });

  menu.style.left = Math.min(x, window.innerWidth - 200) + 'px';
  menu.style.top = Math.min(y, window.innerHeight - 200) + 'px';
  menu.classList.remove('hidden');
}

function closeContextMenu() {
  const menu = document.getElementById('tree-context-menu');
  if (menu) menu.classList.add('hidden');
}

document.addEventListener('click', closeContextMenu);

// Context menu actions
async function createNoteInFolder(folderId) {
  const newNote = {
    id: 'n-' + Date.now(),
    folderId,
    title: 'New Note',
    content: '# New Note\n\nStart writing here...',
    isEncrypted: !!state.encryptionKey,
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  state.notes.unshift(newNote);
  state.activeNoteId = newNote.id;
  state.activeFolderId = folderId;
  state.openFolderIds.add(folderId);
  saveTreeState();
  state.decryptedTitleCache.set(newNote.id, 'New Note');
  await saveStore();
  renderAll();
}

async function renameFolder(folder) {
  const name = await showPromptModal('Rename Folder', 'Enter new folder name:', folder.name);
  if (!name || name === folder.name) return;
  folder.name = name;
  await saveStore();
  renderAll();
}

async function deleteFolder(folder) {
  const ok = await showConfirmModal('Delete Folder', `Are you sure you want to delete folder "${folder.name}"? Notes will be moved to Uncategorized.`);
  if (!ok) return;
  state.folders = state.folders.filter(f => f.id !== folder.id);
  state.notes.forEach(n => {
    if (n.folderId === folder.id) n.folderId = state.folders.length ? state.folders[0].id : null;
  });
  if (state.activeFolderId === folder.id) {
    state.activeFolderId = state.folders.length ? state.folders[0].id : null;
  }
  await saveStore();
  renderAll();
}

async function renameNote(note) {
  const currentTitle = state.decryptedTitleCache.get(note.id) || 'Untitled Note';
  const newTitle = await showPromptModal('Rename Note', 'Enter new title:', currentTitle);
  if (!newTitle || newTitle === currentTitle) return;
  
  const content = note.content || '';   // already plaintext in state
  const lines = content.split('\n');
  if (lines.length > 0 && lines[0].startsWith('#')) {
    lines[0] = '# ' + newTitle;
  } else {
    lines.unshift('# ' + newTitle);
  }
  const updatedContent = lines.join('\n');
  
  note.title = newTitle;
  note.content = updatedContent;
  state.decryptedTitleCache.set(note.id, newTitle);
  await saveStore();
  renderAll();
}

async function deleteNote(note) {
  const ok = await showConfirmModal('Delete Note', `Are you sure you want to delete this note?`);
  if (!ok) return;
  state.notes = state.notes.filter(n => n.id !== note.id);
  state.decryptedTitleCache.delete(note.id);   // J-08: don't retain a decrypted title after delete
  state.activeNoteId = state.notes.length ? state.notes[0].id : null;
  await saveStore();
  renderAll();
}

async function manageNoteTags(note) {
  const tagStr = (note.tags || []).join(', ');
  const input = await showPromptModal('Manage Tags', 'Enter tags separated by commas:', tagStr);
  if (input === null) return;
  note.tags = input.split(',').map(t => t.trim().replace(/^#/, '').toLowerCase()).filter(Boolean);
  triggerAutoSave();
  renderTags();
  renderTagTree();
}

async function renameTagGlobal(oldTag) {
  const newTag = await showPromptModal('Rename Tag', `Rename tag #${oldTag} to:`, oldTag);
  if (!newTag || newTag === oldTag) return;
  const clean = newTag.replace(/^#/, '').trim().toLowerCase();
  state.notes.forEach(n => {
    if (n.tags) {
      const idx = n.tags.indexOf(oldTag);
      if (idx !== -1) n.tags[idx] = clean;
    }
  });
  triggerAutoSave();
  renderAll();
}

async function removeTagGlobal(tag) {
  const ok = await showConfirmModal('Remove Tag', `Remove tag #${tag} from all notes in vault?`);
  if (!ok) return;
  state.notes.forEach(n => {
    if (n.tags) n.tags = n.tags.filter(t => t !== tag);
  });
  triggerAutoSave();
  renderAll();
}

async function renderActiveNote() {
  const note = state.notes.find(n => n.id === state.activeNoteId);
  const textarea = document.getElementById('markdown-textarea');
  const preview = document.getElementById('markdown-preview');

  if (!note) {
    textarea.value = '';
    preview.innerHTML = '<div class="empty-state empty-state-pane">Select or create a note to start writing</div>';
    return;
  }

  const content = note.content || '';   // plaintext in state after unlock

  // S-05 guard: if anything here is still ciphertext, decryption failed for this
  // note. Show it as a locked, READ-ONLY state — never place it in the editor,
  // where autosave would encrypt the placeholder over the real content.
  if (typeof content === 'string' && content.startsWith('ENC:')) {
    textarea.value = '';
    textarea.readOnly = true;
    preview.innerHTML = '<div class="empty-state locked-note">This note could not be decrypted with the current passphrase. It is shown read-only so its stored content is not overwritten.</div>';
    return;
  }
  textarea.readOnly = false;

  textarea.value = content;
  renderPreview(content);
}

function renderPreview(md) {
  const preview = document.getElementById('markdown-preview');
  if (!md || !md.trim()) {
    preview.innerHTML = '<div class="empty-state empty-state-preview">Preview will appear here…</div>';
    return;
  }
  // S-04: never inject raw marked output. Note content is untrusted input — it can
  // arrive from a restored vault, a synced file, or an unauthenticated API write.
  // Sanitize BEFORE it touches innerHTML; highlight AFTER, on the cleaned DOM.
  preview.innerHTML = sanitizeHtml(marked.parse(md));
  preview.querySelectorAll('pre code').forEach(block => {
    hljs.highlightElement(block);
  });
}

function renderTOC() {
  const container = document.getElementById('toc-container');
  const headings = document.querySelectorAll('#markdown-preview h1, #markdown-preview h2, #markdown-preview h3');
  if (!headings.length) {
    container.innerHTML = '<div class="empty-state">No headings</div>';
    return;
  }
  container.innerHTML = '';
  headings.forEach(h => {
    const item = document.createElement('div');
    const level = h.tagName.toLowerCase();
    item.className = 'toc-item toc-' + level;
    item.textContent = h.textContent;
    item.addEventListener('click', () => h.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    container.appendChild(item);
  });
}

function renderTags() {
  const container = document.getElementById('tags-container');
  const note = state.notes.find(n => n.id === state.activeNoteId);
  if (!note || !note.tags || !note.tags.length) {
    container.innerHTML = '<div class="empty-state">No tags</div>';
    return;
  }
  container.innerHTML = '';
  note.tags.forEach((tag, idx) => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.innerHTML = `#${escapeHtml(tag)} <span class="tag-del-btn" title="Remove Tag">×</span>`;
    
    chip.querySelector('.tag-del-btn').addEventListener('click', async e => {
      e.stopPropagation();
      note.tags.splice(idx, 1);
      triggerAutoSave();
      renderTags();
      renderTagTree();
    });

    container.appendChild(chip);
  });
}

function renderMetrics() {
  const text = document.getElementById('markdown-textarea').value || '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  document.getElementById('val-words').textContent = words.toLocaleString();
  document.getElementById('val-chars').textContent = text.length.toLocaleString();
  document.getElementById('val-lines').textContent = text ? text.split('\n').length.toLocaleString() : '0';
}

function updateE2EEUI() {
  const dot = document.getElementById('e2ee-dot');
  const text = document.getElementById('e2ee-text');
  if (dot) dot.classList.add('active');
  if (text) text.textContent = 'E2EE Active · AES-256-GCM';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ─── HTML SANITIZER (S-04) ─────────────────────────
// Rendered markdown is untrusted. DOMPurify strips <script>, event handlers
// (on*), and javascript:/data: URLs. Fails CLOSED: if the vendored library is
// missing, we escape rather than render, so a load failure can never downgrade
// us to injecting raw HTML.
const SANITIZE_CONFIG = {
  USE_PROFILES: { html: true },
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'base', 'meta'],
  FORBID_ATTR: ['style', 'formaction', 'srcdoc', 'ping'],
  ALLOW_DATA_ATTR: false
};

function sanitizeHtml(dirty) {
  if (typeof DOMPurify === 'undefined' || !DOMPurify.sanitize) {
    console.error('DOMPurify missing — refusing to render unsanitized HTML.');
    return escapeHtml(String(dirty));
  }
  return DOMPurify.sanitize(dirty, SANITIZE_CONFIG);
}

// Any link surviving sanitization opens safely (no window.opener access).
if (typeof DOMPurify !== 'undefined' && DOMPurify.addHook) {
  DOMPurify.addHook('afterSanitizeAttributes', node => {
    if (node.tagName === 'A' && node.hasAttribute('href')) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

// ─── HORIZONTAL SIDEBAR RESIZERS ───────────────────
function initSidebarResizers() {
  const leftResizer = document.getElementById('resizer-left');
  const rightResizer = document.getElementById('resizer-right');
  const leftPane = document.getElementById('sidebar-left');
  const rightPane = document.getElementById('sidebar-right');

  const root = document.documentElement;
  const px2rem = px => (px / 16) + 'rem';
  const savedLeft = localStorage.getItem('lucid-left-width');
  const savedRight = localStorage.getItem('lucid-right-width');
  if (savedLeft) root.style.setProperty('--left-w', px2rem(savedLeft));
  if (savedRight) root.style.setProperty('--right-w', px2rem(savedRight));

  if (leftResizer && leftPane) {
    let dragging = false;
    leftResizer.addEventListener('mousedown', e => {
      e.preventDefault();
      dragging = true;
      leftResizer.classList.add('resizing');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      const newWidth = Math.max(208, Math.min(480, e.clientX));
      root.style.setProperty('--left-w', px2rem(newWidth));
      localStorage.setItem('lucid-left-width', newWidth);
    });
    window.addEventListener('mouseup', () => {
      if (dragging) {
        dragging = false;
        leftResizer.classList.remove('resizing');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    });
  }

  if (rightResizer && rightPane) {
    let dragging = false;
    rightResizer.addEventListener('mousedown', e => {
      e.preventDefault();
      dragging = true;
      rightResizer.classList.add('resizing');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      const newWidth = Math.max(180, Math.min(400, window.innerWidth - e.clientX));
      root.style.setProperty('--right-w', px2rem(newWidth));
      localStorage.setItem('lucid-right-width', newWidth);
    });
    window.addEventListener('mouseup', () => {
      if (dragging) {
        dragging = false;
        rightResizer.classList.remove('resizing');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    });
  }
}

// ─── SPLIT HANDLE DRAG (DYNAMIC RESIZING FOR BOTH VERTICAL AND HORIZONTAL SPLITS) ──────
function initSplitHandle() {
  const handle = document.getElementById('split-handle');
  const split = document.getElementById('editor-split');
  const editorPane = split.querySelector('.editor-pane');
  const previewPane = split.querySelector('.preview-pane');
  let dragging = false;

  if (!handle) return;
  handle.addEventListener('mousedown', e => {
    e.preventDefault();
    dragging = true;
    const isHorizontal = state.viewMode === 'split-horizontal';
    document.body.style.cursor = isHorizontal ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  });

  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    const rect = split.getBoundingClientRect();
    if (state.viewMode === 'split-horizontal') {
      const x = e.clientX - rect.left;
      const pct = Math.max(15, Math.min(85, (x / rect.width) * 100));
      split.style.setProperty('--split-pct', pct + '%');
    } else if (state.viewMode === 'split-vertical') {
      const y = e.clientY - rect.top;
      const pct = Math.max(15, Math.min(85, (y / rect.height) * 100));
      split.style.setProperty('--split-pct', pct + '%');
    }
  });

  window.addEventListener('mouseup', () => {
    if (dragging) {
      dragging = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });
}

// ─── VIEW MODE TABS WITH OPTION A ICONSAX SVGS ──────
function initViewModeTabs() {
  const tabEditor = document.getElementById('tab-mode-editor');
  const tabSplit = document.getElementById('tab-mode-split');
  const tabPreview = document.getElementById('tab-mode-preview');
  const splitContainer = document.getElementById('editor-split');

  function setViewMode(mode) {
    state.viewMode = mode;
    [tabEditor, tabSplit, tabPreview].forEach(t => t && t.classList.remove('active'));
    splitContainer.className = 'editor-split mode-' + mode;

    const iconSpan = tabSplit ? tabSplit.querySelector('.split-tab-icon') : null;

    if (mode === 'editor') {
      tabEditor && tabEditor.classList.add('active');
      if (iconSpan) iconSpan.innerHTML = ICONS.elementSplit; // lin-element-4.svg
    } else if (mode.startsWith('split')) {
      tabSplit && tabSplit.classList.add('active');
      if (iconSpan) {
        // Option A: lin-element-3.svg for Side-by-Side (Left/Right) and lin-element-2.svg for Top/Bottom
        iconSpan.innerHTML = mode === 'split-horizontal' ? ICONS.element3 : ICONS.element2;
      }
      tabSplit.title = mode === 'split-horizontal' ? 'Split View (Side-by-Side Left/Right — Click to switch to Top/Bottom)' : 'Split View (Top/Bottom — Click to switch to Left/Right)';
    } else if (mode === 'preview') {
      tabPreview && tabPreview.classList.add('active');
      if (iconSpan) iconSpan.innerHTML = ICONS.elementSplit; // lin-element-4.svg
    }

    localStorage.setItem('lucid-view-mode', mode);
  }

  if (tabEditor) tabEditor.addEventListener('click', () => setViewMode('editor'));
  
  if (tabSplit) {
    tabSplit.addEventListener('click', () => {
      if (state.viewMode === 'split-horizontal') {
        setViewMode('split-vertical');
      } else {
        setViewMode('split-horizontal');
      }
    });
  }
  
  if (tabPreview) tabPreview.addEventListener('click', () => setViewMode('preview'));

  // First-run default: split with preview ON, stacked top/bottom (works on any screen width).
  const savedMode = localStorage.getItem('lucid-view-mode') || DEFAULT_VIEW_MODE;
  setViewMode(savedMode === 'split' ? DEFAULT_VIEW_MODE : savedMode);
}

// ─── SEAMLESS GLOWING SUN / MOON THEME TOGGLE ──────
function applyTheme(themeId) {
  document.body.setAttribute('data-theme', themeId);
  document.documentElement.setAttribute('data-theme', themeId);
  localStorage.setItem('lucid-theme', themeId);

  // Swap the highlight.js code theme to match the app theme
  const hljsTheme = document.getElementById('hljs-theme');
  if (hljsTheme) {
    const style = themeId === 'warm-linen' ? 'github' : 'github-dark';
    hljsTheme.href = `vendor/hljs-styles/${style}.min.css`;
  }

  const iconEl = document.getElementById('theme-toggle-icon');
  const btn = document.getElementById('btn-theme-toggle');
  if (iconEl && btn) {
    if (themeId === 'warm-linen') {
      iconEl.innerHTML = ICONS.moon;
      btn.title = "Switch to Dark Theme (Dusk Ember)";
    } else {
      iconEl.innerHTML = ICONS.sun;
      btn.title = "Switch to Light Theme (Warm Linen)";
    }
  }
}

function initThemeToggle() {
  const btn = document.getElementById('btn-theme-toggle');
  if (!btn) return;
  
  const saved = localStorage.getItem('lucid-theme') || 'dusk-ember';
  applyTheme(saved);

  btn.addEventListener('click', () => {
    const current = localStorage.getItem('lucid-theme') || 'dusk-ember';
    const next = current === 'dusk-ember' ? 'warm-linen' : 'dusk-ember';
    applyTheme(next);
  });
}

// ─── EXPLORER DUAL MODE PILL TOGGLE (Folders vs Tags) ─
function initExplorerModeToggle() {
  const btnFolders = document.getElementById('btn-mode-folders');
  const btnTags = document.getElementById('btn-mode-tags');
  const folderTree = document.getElementById('folder-tree');
  const tagTree = document.getElementById('tag-tree');

  function updateExplorerUI(mode) {
    state.explorerMode = mode;
    if (mode === 'folders') {
      if (btnFolders) btnFolders.classList.add('active');
      if (btnTags) btnTags.classList.remove('active');
      if (tagTree) tagTree.classList.add('hidden');
      if (folderTree) folderTree.classList.remove('hidden');
      renderTree();
    } else {
      if (btnTags) btnTags.classList.add('active');
      if (btnFolders) btnFolders.classList.remove('active');
      if (folderTree) folderTree.classList.add('hidden');
      if (tagTree) tagTree.classList.remove('hidden');
      renderTagTree();
    }
  }

  if (btnFolders) btnFolders.addEventListener('click', () => updateExplorerUI('folders'));
  if (btnTags) btnTags.addEventListener('click', () => updateExplorerUI('tags'));

  updateExplorerUI(state.explorerMode);
}

// ─── SMART GITHUB ICON & UPDATE INDICATOR ──────────
async function checkVersionAndUpdateIndicator() {
  const githubLink = document.querySelector('.footer-github-link');
  if (!githubLink) return;

  let currentVersion = '2.0.0-dev';
  try {
    const res = await fetch(apiPath('api/version'));
    if (res.ok) {
      const data = await res.json();
      if (data.version) currentVersion = data.version;
    }
  } catch (e) {
    console.warn('Could not fetch local version:', e);
  }

  // Detect build environment
  const isDevBuild = window.location.hostname === 'localhost' || window.location.port === '58243';
  const buildTag = isDevBuild ? 'dev build' : 'production';

  // Native title tooltip (matches the sync/lock controls beside it)
  const upToDateMsg = `LucID v${currentVersion} (${buildTag}) — Up to date`;
  githubLink.setAttribute('title', upToDateMsg);
  githubLink.setAttribute('aria-label', upToDateMsg);

  try {
    const ghRes = await fetch('https://api.github.com/repos/Arelius-D/LucID/releases/latest');
    if (ghRes.ok) {
      const ghData = await ghRes.json();
      const latestTag = (ghData.tag_name || '').replace(/^v/, '');
      if (latestTag && compareVersions(latestTag, currentVersion) > 0) {
        githubLink.classList.add('update-available');
        const updateMsg = `LucID v${currentVersion} (${buildTag}) • Update Available (v${latestTag})`;
        githubLink.setAttribute('title', updateMsg);
        githubLink.setAttribute('aria-label', updateMsg);
        githubLink.href = 'https://github.com/Arelius-D/LucID/releases/latest';
      }
    }
  } catch (err) {
    // Silent fallback if GitHub API rate limited or offline
  }
}

function compareVersions(v1, v2) {
  const p1 = v1.split('.').map(Number);
  const p2 = v2.split('.').map(Number);
  for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
    const n1 = p1[i] || 0;
    const n2 = p2[i] || 0;
    if (n1 > n2) return 1;
    if (n1 < n2) return -1;
  }
  return 0;
}

// ─── FAILURE VISIBILITY & EXIT SAFETY (J-01 / J-06) ─
// Async failures previously surfaced only in the console: the user saw a frozen
// or half-rendered UI with no signal. Now anything unhandled is shown.
function reportFatal(what, err) {
  console.error(what, err);
  const el = document.getElementById('save-indicator');
  if (el) {
    el.className = 'sync-status-badge error';
    el.title = what + ': ' + ((err && err.message) || err || 'unknown error');
    el.innerHTML = `${ICONS.syncError} <span>Error</span>`;
  }
}
window.addEventListener('error', e => reportFatal('Unexpected error', e.error || e.message));
window.addEventListener('unhandledrejection', e => reportFatal('Unexpected error', e.reason));

// Tab hidden / navigating away: run the pending save now rather than losing it
// to the debounce window. visibilitychange still permits async work.
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') flushPendingSave();
});
window.addEventListener('pagehide', () => { flushPendingSave(); });

// Encryption + upload cannot complete synchronously in beforeunload, so if a
// save is still pending we ask the browser to confirm rather than lose the text.
window.addEventListener('beforeunload', e => {
  if (state.saveTimeout) { e.preventDefault(); e.returnValue = ''; return ''; }
});

// ─── INITIALIZATION ────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: false,
    mangle: false,
  });

  document.getElementById('app').style.display = 'none';

  await fetchStore();
  initSidebarResizers();
  initSplitHandle();
  initViewModeTabs();
  initTreeKeyboard();
  initThemeToggle();
  initExplorerModeToggle();
  checkVersionAndUpdateIndicator();

  // Sidebar toggles with docked button in top-bar-left (left sidebar expanded by default)
  const sidebarLeft = document.getElementById('sidebar-left');
  const btnExpandLeft = document.getElementById('btn-expand-left');
  const btnToggleLeft = document.getElementById('btn-toggle-left');

  if (btnToggleLeft && sidebarLeft && btnExpandLeft) {
    btnToggleLeft.addEventListener('click', () => {
      sidebarLeft.classList.add('collapsed');
      btnExpandLeft.classList.remove('hidden');
    });
    btnExpandLeft.addEventListener('click', () => {
      sidebarLeft.classList.remove('collapsed');
      btnExpandLeft.classList.add('hidden');
    });
  }

  // Inspector toggle mirrors the left sidebar: an in-panel collapse button, and
  // a docked expand button in top-bar-right that only shows while collapsed.
  const sidebarRight = document.getElementById('sidebar-right');
  const btnToggleRight = document.getElementById('btn-toggle-right');   // in-panel collapse
  const btnExpandRight = document.getElementById('btn-expand-right');   // docked expand
  if (sidebarRight && btnToggleRight && btnExpandRight) {
    const syncRight = () =>
      btnExpandRight.classList.toggle('hidden', !sidebarRight.classList.contains('collapsed'));
    btnToggleRight.addEventListener('click', () => { sidebarRight.classList.add('collapsed'); syncRight(); });
    btnExpandRight.addEventListener('click', () => { sidebarRight.classList.remove('collapsed'); syncRight(); });
    syncRight(); // collapsed by default → expand button visible on load
  }

  // EXPANDABLE SEARCH BELOW EXPLORER HEADER ROW
  const btnSearch = document.getElementById('btn-toggle-search');
  const headerRow = document.getElementById('tree-header-row');
  const btnSearchClose = document.getElementById('btn-search-close');
  const searchInput = document.getElementById('search-input');

  if (btnSearch && headerRow && searchInput) {
    const openSearch = () => {
      headerRow.classList.add('searching');
      searchInput.focus();
    };
    const closeSearch = () => {
      headerRow.classList.remove('searching');
      state.searchQuery = '';
      searchInput.value = '';
      renderAll();
    };

    btnSearch.addEventListener('click', () => {
      if (headerRow.classList.contains('searching')) closeSearch();
      else openSearch();
    });

    if (btnSearchClose) btnSearchClose.addEventListener('click', closeSearch);

    searchInput.addEventListener('blur', () => {
      if (!searchInput.value.trim()) headerRow.classList.remove('searching');
    });

    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeSearch();
    });

    searchInput.addEventListener('input', e => {
      state.searchQuery = e.target.value;
      if (state.explorerMode === 'folders') renderTree();
      else renderTagTree();
    });
  }

  // Interactive Tag Add Button
  const btnAddTag = document.getElementById('btn-add-tag');
  if (btnAddTag) {
    btnAddTag.addEventListener('click', async () => {
      const note = state.notes.find(n => n.id === state.activeNoteId);
      if (!note) return;
      const tag = await showPromptModal('Add Tag', 'Enter tag name (without #):');
      if (!tag) return;
      if (!note.tags) note.tags = [];
      const cleanTag = tag.replace(/^#/, '').trim().toLowerCase();
      if (cleanTag && !note.tags.includes(cleanTag)) {
        note.tags.push(cleanTag);
        triggerAutoSave();
        renderTags();
        renderTagTree();
      }
    });
  }

  // Live editing with auto-save
  document.getElementById('markdown-textarea').addEventListener('input', e => {
    renderPreview(e.target.value);
    renderTOC();
    renderMetrics();
    triggerAutoSave();
  });

  // New note button
  document.getElementById('btn-new-note').addEventListener('click', async () => {
    const folderId = state.activeFolderId || (state.folders.length ? state.folders[0].id : null);
    if (!folderId) return;
    createNoteInFolder(folderId);
  });

  // New folder button
  document.getElementById('btn-new-folder').addEventListener('click', async () => {
    const name = await showPromptModal('New Folder', 'Enter a name for the new folder:');
    if (!name || !name.trim()) return;
    const folder = { id: 'f-' + Date.now(), name: name.trim(), parentId: null };
    state.folders.push(folder);
    state.activeFolderId = folder.id;
    state.openFolderIds.add(folder.id);
    saveTreeState();
    await saveStore();
    renderAll();
  });

  // MANDATORY E2EE LOCK SCREEN & CRYPTOGRAPHIC PASSPHRASE VALIDATION
  const lockScreen = document.getElementById('lock-screen');
  const lockInput = document.getElementById('lock-passphrase');
  const lockConfirmInput = document.getElementById('lock-passphrase-confirm');
  const lockBtn = document.getElementById('lock-unlock-btn');
  const lockError = document.getElementById('lock-error');

  updateLockScreenUI();

  function checkPassphraseMatch() {
    if (state.authVerifier) return;
    const v1 = lockInput ? lockInput.value : '';
    const v2 = lockConfirmInput ? lockConfirmInput.value : '';

    if (lockError) lockError.style.display = 'none';

    // 1. Either empty -> Neutral disabled state
    if (!v1 || !v2) {
      if (lockInput) lockInput.classList.remove('is-matched', 'is-mismatch');
      if (lockConfirmInput) lockConfirmInput.classList.remove('is-matched', 'is-mismatch');
      if (lockBtn) {
        lockBtn.classList.remove('is-ready');
        lockBtn.textContent = 'Next';
        lockBtn.disabled = true;
      }
      return;
    }

    // 2. Exact 100% Match -> Both glow gold (the app's success/accent colour), Button becomes "Continue" & enabled!
    if (v1 === v2) {
      if (lockInput) {
        lockInput.classList.add('is-matched');
        lockInput.classList.remove('is-mismatch');
      }
      if (lockConfirmInput) {
        lockConfirmInput.classList.add('is-matched');
        lockConfirmInput.classList.remove('is-mismatch');
      }
      if (lockBtn) {
        lockBtn.classList.add('is-ready');
        lockBtn.textContent = 'Continue';
        lockBtn.disabled = false;
      }
      return;
    }

    // 3. User is typing a valid prefix of Field 1 (e.g. v1="1234", v2="12") -> Stay calm, no red error yet!
    if (v1.startsWith(v2)) {
      if (lockInput) lockInput.classList.remove('is-matched', 'is-mismatch');
      if (lockConfirmInput) lockConfirmInput.classList.remove('is-matched', 'is-mismatch');
      if (lockBtn) {
        lockBtn.classList.remove('is-ready');
        lockBtn.textContent = 'Next';
        lockBtn.disabled = true;
      }
      return;
    }

    // 4. v2 does NOT start with v1 (e.g. v1="1234", v2="1231" or "x") -> INSTANT RED MISMATCH GLOW!
    if (lockInput) {
      lockInput.classList.remove('is-matched');
      lockInput.classList.add('is-mismatch');
    }
    if (lockConfirmInput) {
      lockConfirmInput.classList.remove('is-matched');
      lockConfirmInput.classList.add('is-mismatch');
    }
    if (lockError) {
      lockError.textContent = 'Passphrases do not match. Please try again.';
      lockError.style.display = 'block';
    }
    if (lockBtn) {
      lockBtn.classList.remove('is-ready');
      lockBtn.textContent = 'Next';
      lockBtn.disabled = true;
    }
  }

  async function unlockVault() {
    const pass = lockInput ? lockInput.value : '';
    const confirmPass = lockConfirmInput ? lockConfirmInput.value : '';

    if (!pass) {
      lockError.textContent = 'Please enter a passphrase.';
      lockError.style.display = 'block';
      return;
    }

    // Validation for Initial Vault Creation Setup
    if (!state.authVerifier) {
      if (!confirmPass) {
        lockError.textContent = 'Please confirm your master passphrase.';
        lockError.style.display = 'block';
        return;
      }
      if (pass !== confirmPass) {
        lockError.textContent = 'Passphrases do not match. Please try again.';
        lockError.style.display = 'block';
        return;
      }
    }

    lockBtn.textContent = !state.authVerifier ? 'Creating Vault…' : 'Verifying Passphrase…';
    lockBtn.disabled = true;
    lockError.style.display = 'none';

    try {
      // First-time setup mints fresh per-vault KDF params (random salt).
      const isSetup = !state.authVerifier;
      if (isSetup && !state.kdf) state.kdf = newKdfParams();
      const derived = await deriveKey(pass, state.kdf);

      if (state.authVerifier) {
        // STRICT PASSPHRASE VERIFICATION: must decrypt the sentinel exactly.
        const check = await tryDecryptText(state.authVerifier, derived);
        if (check !== AUTH_MAGIC_SENTINEL) {
          lockError.textContent = 'Invalid master passphrase. Access denied.';
          lockError.style.display = 'block';
          lockBtn.textContent = 'Unlock';
          lockBtn.disabled = false;
          state.encryptionKey = null;
          await clearSessionKey();
          return;
        }
      }

      if (isSetup) {
        // First setup: state.folders/notes currently hold the plaintext seed data,
        // so mint the sentinel and write the whole vault out encrypted.
        state.authVerifier = await encryptText(AUTH_MAGIC_SENTINEL, derived);
        state.encryptionKey = derived;
        await saveStore();
      } else {
        // Returning user: decrypt the stored vault into memory as plaintext.
        state.encryptionKey = derived;
        const src = state.rawStore || { folders: state.folders, notes: state.notes };
        const plain = await decryptVaultIntoState(src, derived);
        state.folders = plain.folders;
        state.notes = plain.notes;
      }

      await persistSessionKey(derived);   // stores the non-extractable key, not the passphrase
      lockScreen.classList.add('hidden');
      document.getElementById('app').style.display = 'flex';
      updateE2EEUI();
      renderAll();
    } catch (err) {
      if (err && err.message === 'SECURE_CONTEXT_REQUIRED') {
        lockError.textContent = 'Web Crypto E2EE requires HTTPS or localhost. Plain HTTP to an IP address blocks browser encryption.';
      } else {
        lockError.textContent = 'Authentication error. Access denied.';
      }
      lockError.style.display = 'block';
      lockBtn.textContent = !state.authVerifier ? 'Next' : 'Unlock';
      lockBtn.disabled = !state.authVerifier;
    }
  }

  if (lockInput) {
    lockInput.addEventListener('input', checkPassphraseMatch);
    lockInput.addEventListener('keydown', e => { if (e.key === 'Enter') unlockVault(); });
  }

  if (lockConfirmInput) {
    lockConfirmInput.addEventListener('input', checkPassphraseMatch);
    lockConfirmInput.addEventListener('keydown', e => { if (e.key === 'Enter') unlockVault(); });
  }

  if (lockBtn) lockBtn.addEventListener('click', unlockVault);

  // Show/hide passphrase toggle (eye ↔ eye-slash)
  const lockReveal = document.getElementById('lock-reveal-btn');
  if (lockReveal && lockInput) {
    lockReveal.addEventListener('click', () => {
      const show = lockInput.type === 'password';
      lockInput.type = show ? 'text' : 'password';
      lockReveal.classList.toggle('revealed', show);
      const label = show ? 'Hide passphrase' : 'Show passphrase';
      lockReveal.title = label;
      lockReveal.setAttribute('aria-label', label);
      lockInput.focus();
    });
  }

  // Caps Lock heads-up while typing the passphrase
  const lockCaps = document.getElementById('lock-capslock');
  function capsCheck(e) {
    if (!lockCaps || !e.getModifierState) return;
    lockCaps.classList.toggle('hidden', !e.getModifierState('CapsLock'));
  }
  [lockInput, lockConfirmInput].forEach(el => {
    if (!el) return;
    el.addEventListener('keydown', capsCheck);
    el.addEventListener('keyup', capsCheck);
    el.addEventListener('blur', () => { if (lockCaps) lockCaps.classList.add('hidden'); });
  });

  // ── Vault lock: shared routine for the manual button AND idle auto-lock ──
  function lockVault() {
    clearSessionKey();          // wipes the stored CryptoKey + session token
    state.encryptionKey = null;
    document.getElementById('app').style.display = 'none';
    lockScreen.classList.remove('hidden');
    lockInput.value = '';
    if (lockError) lockError.style.display = 'none';
    updateLockScreenUI();
    lockBtn.disabled = false;
  }
  const lockVaultBtn = document.getElementById('btn-lock-vault');
  if (lockVaultBtn) {
    lockVaultBtn.addEventListener('click', e => { e.preventDefault(); lockVault(); });
  }

  // ── Idle auto-lock ──
  // Soft timeout is user-chosen (Off/5/15/30 min, default 5); a fixed 60-min
  // hard ceiling always locks even when soft is Off. Only in-tab activity counts.
  const AUTOLOCK_HARD_CEILING_MIN = 60;
  let idleLastActivity = Date.now();
  function getAutolockMs() {
    const raw = parseInt(localStorage.getItem('lucid-autolock-min'), 10);
    const soft = Number.isFinite(raw) ? raw : 5;              // default 5 min
    const eff = soft > 0 ? Math.min(soft, AUTOLOCK_HARD_CEILING_MIN) : AUTOLOCK_HARD_CEILING_MIN;
    return eff * 60 * 1000;
  }
  const markActivity = () => { idleLastActivity = Date.now(); };
  ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'].forEach(evt =>
    document.addEventListener(evt, markActivity, { passive: true }));
  setInterval(() => {
    if (!state.encryptionKey) return;                          // only while unlocked
    if (Date.now() - idleLastActivity >= getAutolockMs()) lockVault();
  }, 15000);

  // ── Auto-lock timeout picker (footer) ──
  const AUTOLOCK_OPTIONS = [
    { min: 0,  label: 'Off' },
    { min: 5,  label: '5 minutes' },
    { min: 15, label: '15 minutes' },
    { min: 30, label: '30 minutes' },
  ];
  const btnAutolock = document.getElementById('btn-autolock');
  function autolockLabel() {
    const raw = parseInt(localStorage.getItem('lucid-autolock-min'), 10);
    const soft = Number.isFinite(raw) ? raw : 5;
    return soft > 0 ? `Auto-lock: ${soft} min` : 'Auto-lock: Off (still locks after 60 min idle)';
  }
  if (btnAutolock) {
    const syncAutolockLabel = () => {
      btnAutolock.title = autolockLabel();
      btnAutolock.setAttribute('aria-label', autolockLabel());
    };
    syncAutolockLabel();
    btnAutolock.addEventListener('click', e => {
      e.stopPropagation();
      const raw = parseInt(localStorage.getItem('lucid-autolock-min'), 10);
      const current = Number.isFinite(raw) ? raw : 5;
      const rect = btnAutolock.getBoundingClientRect();
      const items = AUTOLOCK_OPTIONS.map(o => ({
        label: o.label,
        icon: o.min === current ? ICONS.tickCircle : '<span class="menu-icon-blank"></span>',
        action: () => {
          localStorage.setItem('lucid-autolock-min', String(o.min));
          idleLastActivity = Date.now();
          syncAutolockLabel();
        }
      }));
      showTreeContextMenu(rect.left, rect.top, items);
    });
  }

  const restored = await restoreKeyFromSession();
  if (restored) {
    await preloadDecryptedTitles();
    lockScreen.classList.add('hidden');
    document.getElementById('app').style.display = 'flex';
    updateE2EEUI();
    renderAll();
  } else {
    lockScreen.classList.remove('hidden');
    updateLockScreenUI();
  }

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      triggerAutoSave();
    }
  });
});
