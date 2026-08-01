# Security Policy

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Report privately via GitHub's [Report a vulnerability](https://github.com/Arelius-D/LucID/security/advisories/new) form, which creates a private advisory visible only to the maintainer.

Please include what you can: affected version, reproduction steps, and the impact you believe it has. A proof of concept helps but is not required.

LucID is maintained by one person as an open-source project. There is no paid support contract and no bug bounty, but security reports are taken seriously and prioritised above feature work.

## Supported versions

| Version | Supported |
| :--- | :--- |
| 2.x | ✅ Yes |
| 1.x | ❌ No — superseded by 2.0.0, which changed the vault format and key derivation |

Fixes land on the latest release. Older versions are not patched.

## Important: the cryptography has not been independently audited

LucID implements client-side end-to-end encryption using the browser's native Web Crypto API (`crypto.subtle`) — AES-256-GCM for content, PBKDF2-HMAC-SHA256 for key derivation. These are standard, well-reviewed primitives, and LucID does not implement its own cryptography.

However, **the implementation as a whole has not been reviewed by an independent security auditor.** Treat it accordingly: it is built carefully and in the open, but it has not been externally verified. If you are protecting information where compromise would cause serious harm, weigh that honestly.

## Threat model — what LucID does and does not protect against

**Protected:**

- **A compromised or hostile server.** Note titles, note contents, tags, and folder names are encrypted in the browser before transmission. The server stores ciphertext it cannot read, and never receives the passphrase.
- **Someone reading the data at rest.** Anyone with filesystem or backup access to `data/store.json` sees only ciphertext.
- **Network interception.** TLS in transit, and the payload is already encrypted underneath it.
- **Malicious note content.** Rendered markdown is sanitised (DOMPurify) and a strict Content-Security-Policy blocks script execution, so note content cannot run code.
- **Third-party code injection.** All runtime libraries are vendored and version-pinned; the app loads no executable code from external CDNs.
- **Cross-site access to the vault.** The API rejects cross-origin writes, and services bind to loopback with the reverse proxy as sole ingress.

**Not protected:**

- **A compromised endpoint.** If your device has malware, a keylogger, or a hostile browser extension, the passphrase can be captured as you type it. No client-side encryption survives a compromised client.
- **A weak passphrase.** Key strength derives from your passphrase. 600,000 PBKDF2 iterations raise the cost per guess, but a short or common passphrase remains brute-forceable.
- **Metadata.** Record identifiers, timestamps, and the count and structure of notes and folders are stored in plaintext. An observer with server access can see *that* you have 40 notes across 5 folders and when they were modified — never *what* they contain.
- **Lost passphrases.** There is no backdoor, no recovery key, no reset. If you lose your passphrase your notes are permanently unreadable. This is a deliberate consequence of zero-knowledge encryption, not an oversight.
- **An attacker who already controls the server binary.** A modified server could serve modified client JavaScript. Verify the image you deploy, and prefer published tags over unverified builds.

## Cryptographic details

| Property | Value |
| :--- | :--- |
| Content cipher | AES-256-GCM (authenticated encryption) |
| IV | 12 bytes, randomly generated per encryption operation, never reused |
| Key derivation | PBKDF2-HMAC-SHA256 |
| Iterations | 600,000 |
| Salt | 16 random bytes, generated per vault, stored in the vault |
| Key handling | Non-extractable `CryptoKey`; raw key material is never exposed to JavaScript |
| Passphrase storage | Never persisted, in any form, anywhere |
| Session handling | Non-extractable key held in IndexedDB, gated by a per-tab session token; destroyed on lock and on idle auto-lock |

The salt is stored unencrypted by necessity — it must be readable to derive the key. A salt is not a secret; its purpose is to make every vault's derivation unique so that one precomputed attack cannot be reused across vaults.

## Keeping your deployment secure

- Run behind the bundled Caddy reverse proxy so traffic is TLS-encrypted. **Web Crypto requires a secure context** — over plain HTTP to a bare IP, the browser disables encryption entirely and LucID will refuse to unlock.
- Do not publish the application port directly to the internet. The bundled `docker-compose.yml` binds it to `127.0.0.1` for this reason.
- Keep the image current. Dependencies are updated automatically via Dependabot and the build fails on known high-severity vulnerabilities, but that only reaches you when you pull.
- Use a long, unique passphrase. It is the only thing standing between an attacker with your vault file and your notes.
