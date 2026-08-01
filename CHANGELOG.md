# LucID Change Log

All notable changes to the LucID application will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

---

## [2.1.0-dev] - unreleased

### Documentation
- **Footprint figures re-measured on 2.0.0 code**: the README's numbers dated from 1.4.1. Re-sampled on the live host at 5-second intervals for 20 minutes, 240 samples. The application backend now registers 0.00% CPU across every sample, its cgroup memory falls from 22.27 to 14.10 MiB, and the whole stack drops from 38.67 to 31.26 MiB cgroup and 141.63 to 128.81 MB host RSS. The section now states outright that these are at-rest figures and explains why that is the number that matters, since encryption happens in the browser rather than on the server. Peak columns and compressed image sizes were added, and the stale claim that the application container carries no healthcheck was removed.

### Fixed
- **Application healthcheck no longer spawns a Node runtime every minute**: the probe ran `node -e "require('http').request(...)"`, starting a complete Node process inside the container's cgroup once per interval. A sampled footprint audit measured the application's peak CPU at 14.28% against 0.04% for the same code before a healthcheck existed — the container was spending that CPU on monitoring itself. Replaced with a busybox `wget` probe against `/health`, which the `node:22-alpine` base already provides. The probe honours `PORT`.

---

## [2.0.0] - 2026-08-01
### Breaking
- **Vault format v2 (`schemaVersion: 2`)**: The store now carries a `schemaVersion` and a `kdf` block (`algo`, `iterations`, `salt`). Vaults written by 1.x cannot be read by 2.x. LucID has had no public installs, so no migration path is provided — 2.0.0 establishes the format.
- **Full-vault encryption**: Folder names and tags are now encrypted alongside note titles and bodies. Previously only titles and content were encrypted, leaving taxonomy and topic metadata readable on the server. Only non-descriptive record IDs, timestamps and the KDF parameters (which must be readable to derive the key) remain in clear.
- **Key derivation changed**: random per-vault salt and 600,000 PBKDF2 iterations (was a hardcoded shared salt at 100,000). Keys derived by 1.x will not open a 2.x vault.

### Security
- **Per-Vault Random Salt (was hardcoded)**: PBKDF2 used the constant salt `vaultnotes-e2ee-salt-v2` on every installation, so the same passphrase produced the same key on every LucID instance worldwide and one precomputed table could attack every vault. Each vault now generates a random 16-byte salt at initialization, stored in the vault (a salt is not secret; it exists to make derivation unique).
- **PBKDF2 Iterations 100,000 -> 600,000**: Raised to current OWASP guidance for PBKDF2-HMAC-SHA256, with the parameters now recorded in the vault so they can be raised again later without breaking existing vaults.
- **All User Content Encrypted**: Folder names and tags are encrypted at rest. Because AES-GCM ciphertext is non-deterministic, the vault is decrypted once into memory on unlock and re-encrypted at the save boundary — tags still group and filter correctly while never being stored in clear.
- **Encryption Fails Closed**: `encryptText()` now throws when no key is present instead of silently returning plaintext, so a missed guard can no longer write unencrypted notes while the UI claims E2EE.
- **Sanitized Markdown Rendering (XSS)**: Rendered note content is now passed through DOMPurify before insertion, with `<script>`, `<iframe>`, `<object>`, `<form>`, `<style>`, all `on*` event handlers, `style` attributes and `javascript:`/`data:` URLs stripped. Previously `marked.parse()` output was injected directly into the DOM, so note content could execute arbitrary JavaScript. Verified against 13 XSS payloads — none produced an executable node or attribute. The sanitizer fails closed: if the library is unavailable the content is escaped rather than rendered.
- **Content-Security-Policy**: Added a strict CSP (`script-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'none'`, `form-action 'none'`) as a second layer, so injected markup cannot execute even if sanitization were bypassed. `connect-src` is `'self' https://api.github.com`; the single allowed external origin exists for the update check and receives no vault data.
- **Master Passphrase No Longer Stored**: The raw passphrase was previously held in `sessionStorage` in plaintext and was readable by any script. It is now never persisted; the derived **non-extractable** `AES-GCM` CryptoKey is kept in IndexedDB (its key material cannot be read back by JavaScript), gated by a per-tab session token. Unlock-until-tab-closes behaviour is unchanged.
- **Cross-Origin Vault Access Closed**: Removed the wildcard `cors()` middleware, which sent `Access-Control-Allow-Origin: *` and allowed any website a user visited to read or overwrite their vault from the browser. Cross-origin access is now opt-in via the `CORS_ORIGIN` environment variable, and a same-origin guard rejects cross-site writes to `POST /api/store` with HTTP 403.
- **Third-Party CDNs Removed**: `marked`, `highlight.js`, and its themes were loaded from external CDNs — `marked` **unversioned** (always latest) and none with Subresource Integrity — allowing a compromised CDN to inject code into the app origin and defeat E2EE. All three are now vendored locally and version-pinned (DOMPurify 3.4.12, marked 12.0.2, highlight.js 11.11.1) under `public/vendor/`. The app no longer fetches executable code from third parties, which also enables offline/air-gapped use.
- **Service Ports Bound to Loopback**: `docker-compose.yml` published the app on `0.0.0.0:58243` (reachable over plain HTTP, bypassing Caddy TLS) and the DDNS updater UI — which handles the provider token — on `0.0.0.0:8000`. Both are now bound to `127.0.0.1`, making Caddy the sole ingress.

### Added
- Links surviving sanitization are automatically given `target="_blank"` and `rel="noopener noreferrer"`.
- `CORS_ORIGIN` environment variable for deployments that intentionally serve the UI from a different origin.

### Fixed
- **Decryption Failure No Longer Destroys Notes**: A failed decrypt returned the placeholder `[Locked Note]`, which was loaded into the editor and then re-encrypted over the note's real ciphertext by autosave — permanent, silent data loss. Decryption now throws, and any note that cannot be decrypted is shown read-only so its stored content is never overwritten.
- **Atomic Vault Writes**: The store was written in place with `writeFileSync`, so a crash, container stop, or full disk mid-write could truncate the entire vault. Writes now go to a temp file, are fsynced, then atomically renamed.
- **Save Failures No Longer Reported as Success**: Write errors were swallowed while the API still returned `ok`, so the UI showed "Synced" when nothing had been saved. Failed writes now return HTTP 500 and surface as a sync error.
- **Corrupt Store No Longer Replaced by Defaults**: An unparseable `store.json` caused the server to serve the default seed vault, which the client would then save back — destroying a recoverable file. The server now preserves a timestamped copy, returns `STORE_CORRUPT` (HTTP 500 on read, 409 on write) and refuses to overwrite.
- **Graceful Shutdown**: `SIGTERM`/`SIGINT` now close the server cleanly so an in-flight write is not truncated on container stop.

- **Edits no longer lost on note switch or tab close**: autosave was debounced 500 ms with no flush, and the timer resolved the target note *when it fired* rather than when it was scheduled — so switching notes inside that window silently discarded the previous note's text. The save is now bound to a specific note id, and is flushed before switching notes, when the tab is hidden, and on `pagehide`. If a save is still pending at `beforeunload` the browser asks for confirmation, since encryption and upload cannot complete synchronously there.
- **Unhandled errors are now visible**: added `error` and `unhandledrejection` handlers that surface failures in the save indicator. Async faults previously appeared only in the console, leaving a frozen or half-rendered UI with no signal to the user.
- **Decrypted titles evicted on delete**: `decryptedTitleCache` retained plaintext titles for notes that no longer exist.
- **Single source of truth for the default view mode**: `state.viewMode` and the startup fallback declared the default independently and could drift; both now derive from `DEFAULT_VIEW_MODE`.
- **Inline pixel styles removed from JS**: the empty-state and locked-note markup carried hardcoded `padding:40px`/`20px` inline styles that bypassed the spacing scale; they now use tokenised classes.
- **Accessible names on every control**: 23 buttons carried only a `title`, which screen readers announce inconsistently and touch users never see. All icon-only controls now have an `aria-label`; buttons with visible text were already correctly named.
- **Modals are real dialogs**: the prompt, confirm and lock screens now use `role="dialog"` + `aria-modal`, are labelled by their headings, trap Tab within the dialog, and restore focus to the control that opened them. The destructive confirm dialog can now be dismissed with Escape (previously only the prompt could).
- **Status changes are announced**: the save indicator, lock error and Caps Lock hint are live regions, so a failed save or a rejected passphrase is no longer silent to assistive technology. The passphrase field is linked to its error via `aria-describedby`.
- **Visible keyboard focus**: a `:focus-visible` outline in the accent colour now applies to all interactive controls, not just tree items. Mouse users see no change.
- **Malformed writes rejected**: `POST /api/store` replaces the entire vault, but validated only that the top-level fields were arrays — a half-built payload from a client bug could overwrite everything. Records must now be objects with a string `id`; a legitimately empty vault is still accepted.
- **Update indicator worked in no configuration, and claimed the build was current regardless**: found by auditing the running deployment. The tooltip was set to "Up to date" *before* the remote request was attempted and every failure path was swallowed by an empty `catch`, so the app asserted currency it had never checked. The request itself was blocked by this release's own `connect-src 'self'` policy. And the endpoint queried returned 404, because no GitHub Release has ever been published for this repository, so the check could not have succeeded even with the policy corrected. All three are fixed: `api.github.com` is allowed in `connect-src`, the tooltip stays neutral until a response arrives, and every outcome is now reported for what it is — an available update, parity, no releases published yet, or `update check unavailable` when the request fails. The indicator never claims currency without a successful response.
- **Update indicator reports commit distance, and does so without build metadata**: the tooltip now also states how far the tracked branch has moved past the latest release, for example `main +3 commits since v2.1.0`, or on a pre-release build `dev +7 commits since v1.4.1`. This uses GitHub's compare endpoint, which accepts tag and branch names as refs, so the version string the build already reports about itself is the only identifier required and no commit SHA or build timestamp is stamped into the image. Two requests are made once per page load and held in memory; nothing polls and nothing refetches on render, because unauthenticated GitHub API access is limited to 60 requests per hour per address. A failed first request costs one request, not two. The repository icon is never coloured as an error: a rate-limited or unreachable GitHub is not an application fault, and the danger colour stays reserved for the sync and runtime indicators.
- **Version comparison mishandled pre-release builds**: `compareVersions` mapped each dot-separated part through `Number`, so `2.0.0-dev` parsed its last segment as `NaN`. Comparing `2.0.0` against `2.0.0-dev` matched neither the greater-than nor the less-than branch and fell through to "equal", meaning a released version would never have been offered as an update to the corresponding pre-release build. The comparison now parses the numeric core separately from the pre-release suffix and ranks a suffixed build below the plain release, per semver.
- **Build channel was inferred from the browser's URL**: the footer reported `(production)` for any build not reached at `localhost` or port `58243`, so every dev image served through a reverse proxy described itself as production. The channel now derives from the version string, which is the build's own statement about itself: a pre-release suffix yields `dev build`, `release candidate`, `beta`, `alpha` or a generic `pre-release`, and its absence yields `release`.
- **Seeded record identifiers described their own contents**: the default vault shipped with the ids `f-welcome`, `n-welcome` and `f-personal`, so the string "welcome" was legible in the stored file even though every encrypted field around it was ciphertext. Identifiers are unavoidably plaintext, since the client must address a record without decrypting it, which is exactly why they must not be descriptive. Seeded ids are now randomly generated per vault. User-created ids were already timestamp-derived and are unchanged. `SECURITY.md` previously described all identifiers as carrying no content; it now states what they actually are.
- **Emoji removed from the seeded welcome note**: the first thing a new vault presented was a feature list decorated with emoji. Rewritten as plain prose.
- **No healthcheck on the caddy service (reverted)**: a healthcheck added earlier in this cycle probed `http://127.0.0.1:80`, but with automatic HTTPS enabled Caddy 308-redirects port 80 to HTTPS, so the probe followed the redirect and failed the TLS handshake against `127.0.0.1`. Caddy was serving correctly while Docker reported `unhealthy`. Probing the admin endpoint is not possible either, as the Caddyfile sets `admin off`. Removed; the upstream caddy image ships no healthcheck for the same reason. The application container's own healthcheck is unaffected.
- **Footer sync indicator is now icon-only**: the badge showed a tick beside the word "Synced". The label is gone; three states are carried by the glyph itself, drawn from one icon family so they read as a single indicator: connected cloud at rest, the same cloud pulsing while a save is in flight, and a crossed cloud in the danger colour on failure. Because the glyph changes shape on failure rather than only colour, the state does not depend on colour perception. The status text remains in the DOM, visually hidden, since the element is an `aria-live` region and an icon swap announces nothing on its own.
- **Footer sync tooltip now states what actually happened**: the tooltip was a hardcoded generic string that contradicted the badge on the load-failure path, where the badge read "Error loading" while the tooltip claimed changes had not been saved. Tooltip, accessible name and hidden status text are now all the caller's own message.
- **Server runtime indicator in the footer**: a new icon reports the application container's health and how long it has been running, polled from `/health` every 60 seconds, with the detail on hover. It speaks only for the application container. Reporting the health of the reverse proxy or the DDNS updater would require mounting the Docker socket into the internet-facing process, which is not a trade this project makes.
- **Motion respects `prefers-reduced-motion`**: the update-available pulse and the new sync pulse stop animating when the operating system asks for reduced motion. The colour and glyph changes remain, so no state information is lost.

### Branding
- **New logo and favicon.** The pristine 1024x1024 master artwork ships as `logo-source.png` (bit-identical to the supplied original), with `logo.png` (512x512) and `favicon.png` (48x48) derived from it by Lanczos resampling into lossless PNG. Alpha transparency is preserved throughout.
- **Favicon size reduced by 99.7%, from 857 KB to 2.5 KB.** `logo.png` and `favicon.png` were previously the *same* 1024x1024 file duplicated under two names, so every page load fetched 857 KB purely for the browser tab icon. `logo.png` also drops from 857 KB to 123 KB; nothing in the UI renders it above 144 px.

### Build & Packaging
- **Single source of truth for the seed vault**: `data/store.json` was committed to git *and* listed in `.gitignore` — an inert rule, since ignore patterns do not apply to already-tracked files. The repo therefore shipped a stale v1 seed while `server.js` generated a v2 one, so which seed a build used depended on whether a volume mount shadowed it. The tracked file is removed (kept on disk, now genuinely ignored) and `initialData` in `server.js` is the only seed: identical on every branch, every build, and every fresh install. Existing vaults are untouched — the server writes a seed only when no store file exists.
- **Added `.dockerignore`**: `data/`, `.git/`, and `node_modules/` no longer enter the build context, so a vault can never be baked into a published image.
- **Reproducible builds**: base image pinned to `node:22-alpine` (was the floating `node:alpine`, which could jump Node majors between identical builds); `package-lock.json` is now committed and the image builds with `npm ci --omit=dev` (was `npm install`, which silently resolved new versions).
- **Container no longer runs as root**: added an unprivileged `USER node` with ownership of `/app`.
- **Image healthcheck**: added a `HEALTHCHECK` against `/health` so orchestrators can detect a hung-but-running process.
- **`DATA_DIR` environment variable**: the vault location is now configurable, letting a dev server keep its data outside the git clone and deployments point at any mount. Defaults to `./data` as before.

- **`.gitignore` hardened**: also ignores `data/*.corrupt-*` and `data/*.tmp-*` (server-side recovery copies and atomic-write temp files) while explicitly keeping `data/.gitkeep`.
- **Express 4 → 5, marked 12 → 18**: the app was on the legacy Express 4 line (a caret range can never cross a major, so `^4.x` would never have reached Express 5), and the vendored markdown parser was six majors behind. Both upgraded to current and verified against the real server and render path.
- **Dependency policy: prefer latest**: an out-of-date dependency is treated as a standing vulnerability. Added `.github/dependabot.yml` raising **daily** npm, Docker base-image and GitHub-Actions updates with **majors not held back** — breakage is caught by CI, which is the accepted trade against shipping known-vulnerable code.
- **Vendored libraries are now tracked**: DOMPurify, marked and highlight.js are declared as devDependencies (so `npm audit` and Dependabot see them) and synced into `public/vendor/` by `npm run vendor`. Vendoring removed the CDN supply-chain risk but had also made those libraries invisible to update tooling — this closes that gap while keeping them served from our own origin.
- **CI security gates**: the build now runs `npm audit --audit-level=high` and fails if `public/vendor/` has drifted from the declared dependency versions, so a stale vendored library cannot be released.
- **Installer can deploy any branch, not only `main`**: `install.sh` hardcoded `main` in five places (the `git clone` had no `--branch`, all three curl fallbacks, and the image pull), so a self-hoster had no way to install anything else. Consequently the loopback port bindings added in this release could not reach a user at all, since the installer always fetched `main`'s compose file. It now accepts `--dev`, `--main`, and `--branch NAME`, pins the compose `image:` line to the matching tag (`main` to `:latest`, any other branch to its own name), and `--purge` removes the tag that was actually installed rather than only `:latest`. Argument parsing was rewritten so flags can appear in any order, with `--help`.
- **Installation section documents the channels**: the README now carries a channel table (`main` to `:latest`, `--dev` to `:dev`, `--branch NAME` to its own tag), the one-line command for installing dev, an explanation that the compose file and Caddyfile are fetched from the same branch as the image (so mixing a dev image with main's compose runs new code against old deployment settings), and a warning that the dev channel is untested pre-release code with no guaranteed vault migration.
### Documentation
- **Added `SECURITY.md`**: private vulnerability reporting via GitHub advisories, supported-version policy, full cryptographic parameters, and an explicit threat model stating what LucID does *and does not* protect against — including that the implementation has not been independently audited and that a lost passphrase is unrecoverable.
- **Documented why the Caddy admin API stays disabled**: `SECURITY.md` now explains that the admin endpoint is a control plane rather than a status page, that its default `localhost:2019` binding is reachable by anything sharing the container network namespace, and that the deliberate cost of disabling it is the loss of a clean Docker liveness probe for the reverse proxy.
- **README rewritten for 2.0.0**: corrected every stale fact (PBKDF2 iteration count, what is actually encrypted, loopback port bindings, `npm ci`), removed marketing for mobile use that the UI does not support, added a **Dependencies** section stating the always-prefer-latest policy and how it is enforced, added a **Configuration** table for `PORT` / `DATA_DIR` / `CORS_ORIGIN` / `VERSION` which were previously undocumented, restructured the roadmap around the completed 2.0.0 security work, and credited DOMPurify, marked, highlight.js and Blade Iconsax properly. Decorative emoji removed throughout.
- **Security & Architecture section rewritten**: the architecture diagram previously omitted the browser entirely — the client-side encryption boundary, the most important fact about an E2EE product, was not shown. It now depicts the full flow (passphrase → PBKDF2 → AES-GCM → ciphertext over TLS → loopback-only backend → atomic write). Added an explicit *what is encrypted* table (titles, contents, tags, folder names encrypted; IDs/timestamps and KDF salt plaintext by design, with the reason stated), plus key-derivation, session-handling and hardening subsections. Also documents that a lost passphrase means unrecoverable notes, and that the cryptography has not been independently audited.

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
