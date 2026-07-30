<div align="center">
  <img src="public/assets/branding/logo.png" alt="LucID Logo" width="120" height="120" style="border-radius: 1rem; box-shadow: 0 0.5rem 1.5rem rgba(0,0,0,0.3);" />
  <h1>LucID</h1>
  <p><strong>Ultra-lightweight Self-Hosted & Open-Source Note Application featuring Client-Side AES-256-GCM End-to-End Encryption (E2EE), Native Markdown Formatting, and Zero Subscriptions.</strong></p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)
  [![Docker Hub Image](https://img.shields.io/badge/Docker_Hub-assarelius%2Flucid%3Alatest-blue.svg)](https://hub.docker.com/r/assarelius/lucid)
  [![GHCR Image](https://img.shields.io/badge/GHCR-ghcr.io%2Farelius--d%2Flucid%3Alatest-purple.svg)](https://github.com/Arelius-D/LucID/pkgs/container/lucid)
  [![Client-Side E2EE](https://img.shields.io/badge/Encryption-AES--256--GCM-emerald.svg)](#security--architecture)
</div>

---

## Why LucID Exists

Most note applications force a tradeoff between data privacy and seamless access:
- **Cloud Note Services**: Store your unencrypted notes on third-party servers, creating data privacy and lock-in risks.
- **Local Markdown Files**: Require desktop software, complex sync plugins, and lack built-in web access on mobile devices.

LucID resolves this by placing cryptography directly inside your browser. All notes, titles, and tags are encrypted using client-side **AES-256-GCM** keys derived via **PBKDF2** (100,000 iterations). Your server stores exclusively encrypted Base64 payloads—it never sees your master passphrase or unencrypted notes.

---

## Key Features

- **Built-in Client-Side E2EE**: Native Web Crypto API (`crypto.subtle`) encrypts data locally before network transmission.
- **Native Markdown Formatting**: Full support for code blocks, tables, task lists (`- [ ]`), blockquotes, and GitHub-style alerts.
- **Dual Split Views**: Toggle between Side-by-Side (Left/Right) and Top-Bottom editor split layouts.
- **Explorer Tags & Folders**: Organized hierarchy with instant fuzzy search across notes and tags.
- **Dual Visual Themes**: Dusk Ember (Dark) and Warm Linen (Light) curated themes.
- **Ultra-Lightweight Footprint**: Node.js Alpine base image utilizing minimal RAM resources.

---

## Security & Architecture

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant Memory as Transient RAM
    participant Crypto as Web Crypto API
    participant Caddy as Caddy TLS Reverse Proxy
    participant Server as Express Backend
    participant Storage as Store JSON

    User->>Memory: Enter Master Passphrase
    Memory->>Crypto: Derive 256-bit Key via PBKDF2 (100k iterations)
    Crypto-->>Memory: Return Encryption Key (Transient Only)
    User->>Crypto: Encrypt Note Payload (AES-256-GCM)
    Crypto-->>User: Encrypted Base64 Payload (ENC:...)
    User->>Caddy: HTTPS TLS Encrypted Transmission (Port 443)
    Caddy->>Server: HTTP Proxy /api/store (Ciphertext Only)
    Server->>Storage: Persist Ciphertext to data/store.json
```

---

## Deployment Options

### Option 1: Automated Setup Script

Run the automated environment check, port verification, and setup script:

```bash
curl -fsSL https://raw.githubusercontent.com/Arelius-D/LucID/main/install.sh | bash
```

To completely uninstall and wipe all containers, images, volumes, and temporary files:

```bash
./install.sh --purge
```

---

### Option 2: Docker Compose (App + Official Caddy HTTPS Sidecar)

LucID includes an official `caddy:latest` HTTPS sidecar in its default `docker-compose.yml`:

```yaml
services:
  app:
    image: assarelius/lucid:latest
    container_name: lucid-app
    restart: unless-stopped
    ports:
      - "24002:3000"
    volumes:
      - ./data:/app/data

  caddy:
    image: caddy:latest
    container_name: lucid-caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    environment:
      - DOMAIN_NAME=${DOMAIN_NAME:-localhost}
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - app

volumes:
  caddy_data:
  caddy_config:
```

Start the stack:

```bash
docker compose up -d
```

---

### Option 3: Docker CLI (`docker run`)

```bash
docker run -d \
  --name lucid \
  -p 24002:3000 \
  -v $(pwd)/data:/app/data \
  --restart unless-stopped \
  assarelius/lucid:latest
```

---

### Option 4: Manual Node.js Installation

```bash
git clone https://github.com/Arelius-D/LucID.git
cd LucID
npm install --only=production
npm start
```

---

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.
