const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default data if store file doesn't exist
const initialData = {
  folders: [
    { id: 'f-welcome', name: 'General', parentId: null },
    { id: 'f-personal', name: 'Personal', parentId: null }
  ],
  notes: [
    {
      id: 'n-welcome',
      folderId: 'f-welcome',
      title: 'Welcome to LucID',
      content: '# Welcome to LucID\n\nLucID is a modern, privacy-focused note-taking application featuring client-side **AES-256-GCM End-to-End Encryption (E2EE)**.\n\n## Capabilities\n- 🔒 **Client-Side E2EE**: Your master passphrase encrypts all note titles and contents locally in your browser before storage.\n- ↕️↔️ **Dual Split View**: Easily toggle between Side-by-Side (Left/Right) and Top-Bottom split views.\n- ☀️🌙 **Theme Engine**: Dusk Ember (Dark) and Warm Linen (Light) themes.\n- 📁🏷️ **Folders & Tags**: Expandable hierarchy with instant search.',
      isEncrypted: false,
      tags: ['welcome', 'lucid'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  authVerifier: null
};

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading data file:', err);
    return initialData;
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing data file:', err);
  }
}

// REST Endpoints
app.get('/api/store', (req, res) => {
  const data = readData();
  res.json(data);
});

app.post('/api/store', (req, res) => {
  const { folders, notes, authVerifier } = req.body;
  if (Array.isArray(folders) && Array.isArray(notes)) {
    const existing = readData();
    writeData({
      folders,
      notes,
      authVerifier: authVerifier !== undefined ? authVerifier : (existing.authVerifier || null)
    });
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } else {
    res.status(400).json({ error: 'Invalid payload structure' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`LucID server running on http://0.0.0.0:${PORT}`);
});
