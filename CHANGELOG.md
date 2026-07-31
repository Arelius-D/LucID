# LucID Change Log

All notable changes to the LucID application will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

---

## [1.1.0] - 2026-07-31

### Added
- Real-Time Passphrase Input Match Validation: Dynamic Emerald Green (#10b981) border and background glow when master passphrases match 100%.
- Prefix-Aware Instant Red Mismatch Detection: Immediate Red (#ff6b6b) border glow and error text notification ("Passphrases do not match. Please try again.") if character mismatch occurs.
- JetBrains Mono Password Dot Font: Password input fields styled with crisp, centered JetBrains Mono font for dots and placeholders.
- Smart GitHub Release Update Indicator: Backend /api/version endpoint integrated with GitHub Releases API; floating tooltip (LucID v1.1.0 • Up to date / Update Available!) positioned above cursor without clipping.
- Dynamic Button Transitions: Lock screen button transitions from Next (disabled by default) to Continue (enabled + green glow upon 100% passphrase match).

### Fixed and Refined
- Anchored Header Toolbar Pills: Left sidebar header pills (Folders | Tags and + Note | + Folder | Search) anchored side-by-side from the left with 0.5rem gap spacing, eliminating floating to the far right.
- Enforced 284px Sidebar Floor: Resizer drag handler and CSS enforce 284px (17.75rem) minimum sidebar width, preventing toolbar element clipping.
- Clean Footer Lines: Removed top border lines above left sidebar footer and right inspector footer for seamless visual flow.
- Automated Deployment Stack: Upgraded update-lucid.sh with GitHub API polling loop to wait for Docker Hub build completion automatically.

---

## [1.0.1] - 2026-07-30

### Security and Core E2EE
- Strict Cryptographic Passphrase Sentinel (authVerifier): Lock screen validates master key against PBKDF2 AES-256-GCM sentinel, rejecting incorrect passphrases with access denied errors.
- In-Browser Note Editor & E2EE Storage: Full client-side encryption before reaching server storage.

---

## [1.0.0] - 2026-07-29

### Initial Release
- Initial release of LucID web note-taking application.
