# LucID Change Log

All notable changes to the LucID application will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

---

## [1.4.1] - 2026-07-31
### Added
- Idle Auto-Lock: Automatic vault lock on inactivity — user-selectable timeout (Off / 5 / 15 / 30 min, default 5) with a fixed 60-minute hard ceiling; footer timer picker persisted to localStorage. Reuses the existing lock flow (no new cryptography).
- Show/Hide Passphrase Toggle: Iconsax Linear eye / eye-slash control to reveal or mask the master passphrase on the unlock screen.
- Caps Lock Indicator & "Vault Locked" Cue: Live "Caps Lock is on" heads-up while typing, plus a padlock status pill so the unlock screen reads as a security gate.
- UI State Persistence: Tree folder/tag open-collapse state saved across sessions; first-run default view set to top/bottom split with preview on.
- Symmetrical Panel Toggles & Keyboard Navigation: Right inspector collapse/expand now mirrors the left sidebar; full roving-tabindex tree navigation with tree/treeitem ARIA roles.
### Changed
- OKLCH Tokenized Design System: All colors moved to hsl/oklch tokens with every hardcoded hex/rgba and `!important` removed, relational rem sizing throughout, and unified spacing / type / radius / motion / z-index scales; both Dusk Ember and Warm Linen themes brought to WCAG AA contrast.
- Rendered Markdown Preview: Full element styling (headings, lists, code, tables, blockquotes, task lists) with theme-aware highlight.js code blocks.
- GitHub Version/Update Indicator: Moved from the inspector into the left sidebar footer and switched from the custom cursor tooltip to a native browser tooltip.
- Fit-and-Finish: Center top-bar blended into one continuous surface; inspector metrics grid reflows responsively instead of clipping; header glyphs optically aligned; modals, context menu, and lock screen snapped onto the token scales.
### Fixed and Refined
- Confirm-Passphrase Field Hiding: The confirm field now correctly hides on the unlock screen for returning users (added the missing `.lock-input.hidden` rule).
- Lock-Screen Init Regression: Removed a duplicate `updateLockScreenUI` and hoisted a single top-level definition, fixing a `fetchStore` ReferenceError that surfaced as a footer "Sync error".
- Theme-Aware State Feedback: Passphrase match/mismatch glow and the E2EE status dot now derive from theme tokens (gold success / red danger) instead of off-theme fixed colors.
- Lock Screen Copy: "Initialize LucID Vault" → "Initialize LucID"; "Unlock Vault" → "Unlock".

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
