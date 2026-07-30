<div align="center">
  <img src="public/assets/branding/logo.png" alt="LucID Logo" width="120" height="120" style="border-radius: 1rem; box-shadow: 0 0.5rem 1.5rem rgba(0,0,0,0.3);" />
  <h1>LucID</h1>
  <p><strong>100% Free & Open-Source Client-Side End-to-End Encrypted (E2EE) Note-Taking Web Application</strong></p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)
  [![Docker Hub Image](https://img.shields.io/badge/Docker_Hub-areliusd%2Flucid%3Alatest-blue.svg)](https://hub.docker.com/r/areliusd/lucid)
  [![GHCR Image](https://img.shields.io/badge/GHCR-ghcr.io%2Farelius--d%2Flucid%3Alatest-purple.svg)](https://github.com/Arelius-D/LucID/pkgs/container/lucid)
  [![Client-Side E2EE](https://img.shields.io/badge/Encryption-AES--256--GCM-emerald.svg)](#-security--architecture)
</div>

---

## 💡 Why LucID Exists

LucID was built from scratch to break free from proprietary note-taking platforms that enforce subscription paywalls, gate core features behind paid tiers, track user data on third-party servers, or consume hundreds of megabytes of RAM.

LucID provides a **privacy-first, ultra-lightweight, zero-subscription** note-taking experience with native client-side encryption and cross-platform responsive support across Desktop and Mobile Web browsers.

---

## ✨ Key Features

- 🔒 **Client-Side E2EE (AES-256-GCM)**: All note titles, content, and tags are encrypted locally inside your web browser using Web Crypto API PBKDF2 (100,000 iterations) + AES-GCM 256-bit encryption before reaching the server.
- ↕️↔️ **Dual Split View**: Smoothly toggle between Side-by-Side (Left/Right) and Top-Bottom split views with live synchronized Markdown preview.
- ☀️🌙 **Theme Engine**:
  - **Dusk Ember** (Matte metallic steel & gold dark mode)
  - **Warm Linen** (Warm paper light mode)
- 📁🏷️ **Explorer with Expandable Tag Tree**: Organize via nested folder trees or expandable tag views with right-click context menus.
- ⚡ **Ultra-Low Resource Footprint**: Memory usage under ~25MB RAM, ~0% idle CPU, zero heavy framework overhead.
- 📱 **Cross-Platform & Mobile PWA**: Responsive user interface tailored for Desktop (macOS, Linux, Windows) and Mobile (iOS, Android).

---

## 🏗️ Technical Stack & Container Architecture

LucID is built with a minimal, dependency-light tech stack designed for speed, security, and long-term maintainability:

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Base Image** | `node:alpine` | Minimal Alpine Linux base image (~50MB footprint) |
| **Backend** | Node.js Current / Express | Fast REST API & static file provider |
| **Frontend** | Vanilla HTML5 / CSS3 / JS | Native LucID Design System (No framework overhead) |
| **Cryptography** | Web Crypto API | `crypto.subtle` PBKDF2 key derivation & AES-256-GCM |
| **Parser** | Marked.js & Highlight.js | GFM Markdown parsing & code syntax highlighting |

---

## 🛡️ Security & Architecture

```
┌────────────────────────────────────────────────────────┐
│                   BROWSER CLIENT                       │
│  User Passphrase ──> PBKDF2 Key Derivation              │
│  Plaintext Markdown ──> AES-256-GCM Encryption         │
└──────────────────────────┬─────────────────────────────┘
                           │ (Ciphertext Only: ENC:base64...)
                           ▼
┌────────────────────────────────────────────────────────┐
│                    EXPRESS BACKEND                     │
│  Stores Ciphertext Payload in /data/store.json         │
└──────────────────────────┬─────────────────────────────┘
```

Your master passphrase never leaves your browser. If an unauthorized party gains access to the server disk, they only see AES-256-GCM ciphertext strings.

---

## 🚀 Deployment Options

LucID is published on **Docker Hub** (`areliusd/lucid:latest`) and **GitHub Container Registry** (`ghcr.io/arelius-d/lucid:latest`) for multi-architecture deployments (`amd64` and `arm64`).

### Option 1: Docker Compose (Recommended)

Create a `docker-compose.yml` file:

```yaml
services:
  lucid:
    image: areliusd/lucid:latest
    container_name: lucid
    ports:
      - "8484:3000"
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

Start the service:
```bash
docker compose up -d
```

### Option 2: Docker CLI (`docker run`)

Run LucID as a standalone container directly from Docker Hub:

```bash
docker run -d \
  --name lucid \
  -p 8484:3000 \
  -v $(pwd)/data:/app/data \
  --restart unless-stopped \
  areliusd/lucid:latest
```

### Option 3: Manual Node.js Installation

Requirements: Node.js >= 20

```bash
git clone https://github.com/Arelius-D/LucID.git
cd LucID
npm install --only=production
npm start
```

Access LucID in your web browser at `http://localhost:8484` (or `http://localhost:3000` for manual Node.js).

---

## 📜 License

LucID is 100% Free and Open-Source Software licensed under the **MIT License**.
