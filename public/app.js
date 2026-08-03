/* ═══════════════════════════════════════════════════
   LucID — Client Application
   Auto-save, E2EE, Inline Iconsax SVGs, In-App Modals,
   Cryptographic Passphrase Validation, Seamless Theme Toggle,
   Expandable Tag Tree, Dual-Orientation Split View with Iconsax SVGs,
   and Context Menu Actions
   ═══════════════════════════════════════════════════ */

// ─── INLINE ICONSAX SVG MAP ─────────────────────────
const ICONS = {
  chevron: `<svg class="icon-svg tree-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path d="M8.91 19.92l6.52-6.52c.77-.77.77-2.03 0-2.8L8.91 4.08"/></svg>`,
  chevronOpen: `<svg class="icon-svg tree-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path d="M19.92 8.95l-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"/></svg>`,
  folderClosed: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11v6c0 4-1 5-5 5H7c-4 0-5-1-5-5V7c0-4 1-5 5-5h1.5c1.5 0 1.83.44 2.4 1.2l1.5 2c.38.5.6.8 1.6.8h3c4 0 5 1 5 5z"/><path d="M8 2h9c2 0 3 1 3 3v1.38"/></svg>`,
  folderOpen: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.67 14.3l-.4 5c-.15 1.53-.27 2.7-2.98 2.7H5.71C3 22 2.88 20.83 2.73 19.3l-.4-5c-.08-.83.18-1.6.65-2.19l.02-.02C3.55 11.42 4.38 11 5.31 11h13.38c.93 0 1.75.42 2.29 1.07.01.01.02.02.02.03.49.59.76 1.36.67 2.2z"/><path d="M3.5 11.43V6.28c0-3.4.85-4.25 4.25-4.25h1.27c1.27 0 1.56.38 2.04 1.02l1.27 1.7c.32.42.51.68 1.36.68h2.55c3.4 0 4.25.85 4.25 4.25v1.79M9.43 17h5.14"/></svg>`,
  folderCross: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13.81 15.73l-3.54-3.54M13.77 12.23l-3.54 3.54"/><path d="M22 11v6c0 4-1 5-5 5H7c-4 0-5-1-5-5V7c0-4 1-5 5-5h1.5c1.5 0 1.83.44 2.4 1.2l1.5 2c.38.5.6.8 1.6.8h3c4 0 5 1 5 5z"/></svg>`,
  note: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"><path d="M11 22h5c3.5 0 5-2 5-5V7c0-3-1.5-5-5-5H8C4.5 2 3 4 3 7v7"/><path d="M14.5 4.5v2c0 1.1.9 2 2 2h2M4 17l-2 2 2 2M7 17l2 2-2 2"/></svg>`,
  noteAdd: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path stroke-miterlimit="10" d="M14.5 10.65h-5M12 8.21v5"/><path d="M16.82 2H7.18C5.05 2 3.32 3.74 3.32 5.86v14.09c0 1.8 1.29 2.56 2.87 1.69l4.88-2.71c.52-.29 1.36-.29 1.87 0l4.88 2.71c1.58.88 2.87.12 2.87-1.69V5.86C20.68 3.74 18.95 2 16.82 2z"/></svg>`,
  noteRemove: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path stroke-miterlimit="10" d="M14.5 10.65h-5"/><path d="M16.82 2H7.18C5.05 2 3.32 3.74 3.32 5.86v14.09c0 1.8 1.29 2.56 2.87 1.69l4.88-2.71c.52-.29 1.36-.29 1.87 0l4.88 2.71c1.58.88 2.87.12 2.87-1.69V5.86C20.68 3.74 18.95 2 16.82 2z"/></svg>`,
  tagCross: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g transform="rotate(45 12 12)"><path d="M10.28 20.25H17c2.76 0 5-2.24 5-5v-6.5c0-2.76-2.24-5-5-5h-6.72c-1.41 0-2.75.59-3.7 1.64L3.05 9.27a4.053 4.053 0 000 5.46l3.53 3.88a4.978 4.978 0 003.7 1.64z"/></g><path d="M16 14.47l-4.94-4.94M11.06 14.47L16 9.53"/></svg>`,
  sun: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path stroke-width="1.5" d="M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z"/><path stroke-width="2" d="M19.14 19.14l-.13-.13m0-14.02l.13-.13-.13.13zM4.86 19.14l.13-.13-.13.13zM12 2.08V2v.08zM12 22v-.08.08zM2.08 12H2h.08zM22 12h-.08.08zM4.99 4.99l-.13-.13.13.13z"/></svg>`,
  moon: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.03 12.42c.36 5.15 4.73 9.34 9.96 9.57 3.69.16 6.99-1.56 8.97-4.27.82-1.11.38-1.85-.99-1.6-.67.12-1.36.17-2.08.14C13 16.06 9 11.97 8.98 7.14c-.01-1.3.26-2.53.75-3.65.54-1.24-.11-1.83-1.36-1.3C4.41 3.86 1.7 7.85 2.03 12.42z"/></svg>`,
  // Toggle pair for multi-select menus (tags): one authentic Iconsax family, same
  // track, knob right = on / knob left = off. Single-choice menus (theme, font,
  // auto-lock) mark their current entry by colour instead, keeping each entry's
  // own glyph visible.
  toggleOn: `<svg class="icon-svg menu-toggle on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4h4c4.42 0 8 3.58 8 8s-3.58 8-8 8h-4c-4.42 0-8-3.58-8-8s3.58-8 8-8z"/><path d="M14 16a4 4 0 100-8 4 4 0 000 8z"/></svg>`,
  toggleOff: `<svg class="icon-svg menu-toggle off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4h4c4.42 0 8 3.58 8 8s-3.58 8-8 8h-4c-4.42 0-8-3.58-8-8s3.58-8 8-8z"/><path d="M10 16a4 4 0 100-8 4 4 0 000 8z"/></svg>`,
  // Lock-card status glyphs: one per state, so the line reads before the text does.
  // Vault posture: one silhouette, three marks, all from Iconsax's own shield
  // family — which turns out to share an outline with the deleted shield-tick, not
  // with lin-security-safe. Every inline copy matches its file in public/icons/.
  shieldSecurity: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.49 2.23L5.5 4.11c-1.15.43-2.09 1.79-2.09 3.01v7.43c0 1.18.78 2.73 1.73 3.44l4.3 3.21c1.41 1.06 3.73 1.06 5.14 0l4.3-3.21c.95-.71 1.73-2.26 1.73-3.44V7.12c0-1.23-.94-2.59-2.09-3.02l-4.99-1.87c-.85-.31-2.21-.31-3.04 0z"/><path d="M12 12.5a2 2 0 100-4 2 2 0 000 4zM12 12.5v3"/></svg>`,
  shield: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.49 2.23L5.5 4.11c-1.15.43-2.09 1.79-2.09 3.01v7.43c0 1.18.78 2.73 1.73 3.44l4.3 3.21c1.41 1.06 3.73 1.06 5.14 0l4.3-3.21c.95-.71 1.73-2.26 1.73-3.44V7.12c0-1.23-.94-2.59-2.09-3.02l-4.99-1.87c-.85-.31-2.21-.31-3.04 0z"/></svg>`,
  shieldCross: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.49 2.23L5.5 4.11c-1.15.43-2.09 1.79-2.09 3.01v7.43c0 1.18.78 2.73 1.73 3.44l4.3 3.21c1.41 1.06 3.73 1.06 5.14 0l4.3-3.21c.95-.71 1.73-2.26 1.73-3.44V7.12c0-1.23-.94-2.59-2.09-3.02l-4.99-1.87c-.85-.31-2.21-.31-3.04 0z"/><path d="M14.15 13.44L9.9 9.19M14.1 9.24l-4.25 4.25"/></svg>`,
  lock: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 10V8c0-3.31 1-6 6-6s6 2.69 6 6v2M17 22H7c-4 0-5-1-5-5v-2c0-4 1-5 5-5h10c4 0 5 1 5 5v2c0 4-1 5-5 5z"/><path stroke-width="2" d="M15.996 16h.01M11.995 16h.01M7.995 16h.008"/></svg>`,
  passwordCheck: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path stroke-width="1.5" d="M11.02 19.5H7.5c-.62 0-1.17-.02-1.66-.09-2.63-.29-3.34-1.53-3.34-4.91v-5c0-3.38.71-4.62 3.34-4.91.49-.07 1.04-.09 1.66-.09h3.46M15.02 4.5h1.48c.62 0 1.17.02 1.66.09 2.63.29 3.34 1.53 3.34 4.91v5c0 3.38-.71 4.62-3.34 4.91-.49.07-1.04.09-1.66.09h-1.48M15 2v20"/><path stroke-width="2" d="M11.095 12h.008M7.094 12h.01"/></svg>`,
  heartSlash: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6.11 17.5C3.9 15.43 2 12.48 2 8.68c0-3.09 2.49-5.59 5.56-5.59 1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 014.44-2.24c1.15 0 2.22.35 3.11.96M21.74 7c.17.53.26 1.1.26 1.69 0 7-6.48 11.13-9.38 12.13-.34.12-.9.12-1.24 0-.65-.22-1.47-.6-2.36-1.13M22 2L2 22"/></svg>`,
  tickSquare: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7z"/><path d="M7.75 12l2.83 2.83 5.67-5.66"/></svg>`,
  copy: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 12.9v4.2c0 3.5-1.4 4.9-4.9 4.9H6.9C3.4 22 2 20.6 2 17.1v-4.2C2 9.4 3.4 8 6.9 8h4.2c3.5 0 4.9 1.4 4.9 4.9z"/><path d="M22 6.9v4.2c0 3.5-1.4 4.9-4.9 4.9H16v-3.1C16 9.4 14.6 8 11.1 8H8V6.9C8 3.4 9.4 2 12.9 2h4.2C20.6 2 22 3.4 22 6.9z"/></svg>`,
  sunFog: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path stroke-width="1.5" d="M18.5 12a6.5 6.5 0 10-13 0"/><path stroke-width="2" d="M4.99 4.99l-.13-.13m14.15.13l.13-.13-.13.13zM12 2.08V2v.08zM2.08 12H2h.08zM22 12h-.08.08z"/><path stroke-width="1.5" stroke-miterlimit="10" d="M4 15h16M6 18h12M9 21h6"/></svg>`,
  // Sync state uses one icon family so the three states read as one indicator.
  // The glyph itself changes on failure, so colour is reinforcement rather than
  // the only signal (WCAG 1.4.1).
  pin: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5"><path d="M22 6v2.42C22 10 21 11 19.42 11H16V4.01C16 2.9 16.91 2 18.02 2c1.09.01 2.09.45 2.81 1.17C21.55 3.9 22 4.9 22 6z"/><path d="M2 7v14c0 .83.94 1.3 1.6.8l1.71-1.28c.4-.3.96-.26 1.32.1l1.66 1.67c.39.39 1.03.39 1.42 0l1.68-1.68c.35-.35.91-.39 1.3-.09l1.71 1.28c.66.49 1.6.02 1.6-.8V4c0-1.1.9-2 2-2H6C3 2 2 3.79 2 6v1z"/><path d="M6 9h6M6.75 13h4.5"/></svg>`,
  pinAdd: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5"><path d="M22 6v2.42C22 10 21 11 19.42 11H16V4.01C16 2.9 16.91 2 18.02 2c1.09.01 2.09.45 2.81 1.17C21.55 3.9 22 4.9 22 6z"/><path d="M2 7v14c0 .83.94 1.3 1.6.8l1.71-1.28c.4-.3.96-.26 1.32.1l1.66 1.67c.39.39 1.03.39 1.42 0l1.68-1.68c.35-.35.91-.39 1.3-.09l1.71 1.28c.66.49 1.6.02 1.6-.8V4c0-1.1.9-2 2-2H6C3 2 2 3.79 2 6v1z"/><path d="M6.25 10h5.5M9 12.75v-5.5"/></svg>`,
  pinRemove: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5"><path d="M22 6v2.42C22 10 21 11 19.42 11H16V4.01C16 2.9 16.91 2 18.02 2c1.09.01 2.09.45 2.81 1.17C21.55 3.9 22 4.9 22 6z"/><path d="M2 7v14c0 .83.94 1.3 1.6.8l1.71-1.28c.4-.3.96-.26 1.32.1l1.66 1.67c.39.39 1.03.39 1.42 0l1.68-1.68c.35-.35.91-.39 1.3-.09l1.71 1.28c.66.49 1.6.02 1.6-.8V4c0-1.1.9-2 2-2H6C3 2 2 3.79 2 6v1z"/><path d="M6.25 10h5.5"/></svg>`,
  cloudConnection: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5"><path d="M6.37 9.51c-4.08.29-4.07 6.2 0 6.49h9.66c1.17.01 2.3-.43 3.17-1.22 2.86-2.5 1.33-7.5-2.44-7.98C15.41-1.34 3.62 1.75 6.41 9.51M12 16v3M12 23a2 2 0 100-4 2 2 0 000 4zM18 21h-4M10 21H6"/></svg>`,
  cloudCross: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5"><path d="M16.61 20c1.34.01 2.63-.49 3.62-1.39 3.27-2.86 1.52-8.6-2.79-9.14C15.9.13 2.43 3.67 5.62 12.56"/><path d="M7.28 12.97c-.53-.27-1.12-.41-1.71-.4-4.66.33-4.65 7.11 0 7.44M15.82 9.89c.52-.26 1.08-.4 1.66-.41M12.39 18.59l-2.83 2.82M12.39 21.41l-2.83-2.82"/></svg>`,
  edit: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11.02 19.5H7.5c-.62 0-1.17-.02-1.66-.09-2.63-.29-3.34-1.53-3.34-4.91v-5c0-3.38.71-4.62 3.34-4.91.49-.07 1.04-.09 1.66-.09h3.46M15.02 4.5h1.48c.62 0 1.17.02 1.66.09 2.63.29 3.34 1.53 3.34 4.91v5c0 3.38-.71 4.62-3.34 4.91-.49.07-1.04.09-1.66.09h-1.48M15 2v20M8 8.5v7"/></svg>`,
  watchStatus: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 19h7c2.33 0 3.5-1.17 3.5-3.5v-7C19 6.17 17.83 5 15.5 5h-7C6.17 5 5 6.17 5 8.5v7C5 17.83 6.17 19 8.5 19zM16 2H8M16 22H8"/><path d="M12 14v-4M15 14v-2M9 14v-1"/></svg>`,
  text: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.67 7.17V5.35c0-1.15.93-2.07 2.07-2.07h14.52c1.15 0 2.07.93 2.07 2.07v1.82M12 20.72V4.11M8.06 20.72h7.88"/></svg>`,
  gridPane: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7zM9 2v20"/></svg>`,
  gridSplit: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7zM12 2v20"/></svg>`,
  gridMixed: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7zM12 2v20M2 9.5h10M12 14.5h10"/></svg>`,
  tag: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.17 15.3l4.53 4.53a4.78 4.78 0 006.75 0l4.39-4.39a4.78 4.78 0 000-6.75L15.3 4.17a4.75 4.75 0 00-3.6-1.39l-5 .24c-2 .09-3.59 1.68-3.69 3.67l-.24 5c-.06 1.35.45 2.66 1.4 3.61z"/><path d="M9.5 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/></svg>`,
  trash: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5h3.33M9.5 12.5h5"/></svg>`,
  // Open state derived from lin-trash: lid+handle rotated -12deg about the lid's
  // left hinge, path data unmodified (Iconsax draws no open-trash glyph).
  trashOpen: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g transform="rotate(-12 3 5.98)"><path d="M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3"/></g><path d="M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5h3.33M9.5 12.5h5"/></svg>`,
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
  tagLibrary: [],          // declared tags; survive having no carrier
  treeFocusId: null,
  dragNoteId: null,
  trashPreviewId: null,    // trashed note shown READ-ONLY in the center pane; never the editor
  viewMode: DEFAULT_VIEW_MODE, // see DEFAULT_VIEW_MODE — single source of truth (J-07)
  explorerMode: 'folders', // a key of EXPLORER_MODES: 'folders' | 'tags' | 'pinned'
  decryptedTitleCache: new Map(),
  storeLoaded: false,      // false until GET /api/store succeeds — gates the lock screen mode (J-10)
};

// --- API PATH ---
function apiPath(endpoint) {
  // Strip an explicit document segment first: a user landing on /index.html would
  // otherwise get API paths like /index.html/api/store, which 404 and shove the
  // lock screen into its failure mode for no real reason.
  const base = window.location.pathname.replace(/\/index\.html?$/i, '').replace(/\/+$/, '');
  return base + '/' + endpoint;
}

// --- RECORD IDS ---
// Random, not `Date.now()`. Record ids are the one thing in the vault that is NOT
// encrypted — the server has to be able to address a note without reading it — so
// anything encoded in an id is handed over in clear. A timestamp id publishes the
// exact creation time of every note and folder, which is precisely the metadata the
// rest of the vault boundary exists to withhold. It also collides for two records
// created in the same millisecond. Mirrors server.js newId(), byte width included.
function newId(prefix) {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return prefix + '-' + [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
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
    function onKeyDown(e) { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onCancel(); } }

    cancelBtn.addEventListener('click', onCancel);
    dangerBtn.addEventListener('click', onDanger);
    modal.addEventListener('keydown', onKeyDown);
  });
}

// The prompt dialog serves folders, notes AND tags — icon and placeholder must
// match the subject or the dialog lies about what it edits.
const PROMPT_FOLDER_ICON = `<svg class="modal-prompt-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12.06 16.5v-5M14.5 14h-5"/><path d="M22 11v6c0 4-1 5-5 5H7c-4 0-5-1-5-5V7c0-4 1-5 5-5h1.5c1.5 0 1.83.44 2.4 1.2l1.5 2c.38.5.6.8 1.6.8h3c4 0 5 1 5 5z"/></svg>`;

function showPromptModal(title, message, defaultValue = '', opts = {}) {
  return new Promise(resolve => {
    const modal = document.getElementById('modal-prompt');
    const titleEl = document.getElementById('modal-prompt-title');
    const msgEl = document.getElementById('modal-prompt-msg');
    const inputEl = document.getElementById('modal-prompt-input');
    const iconEl = document.getElementById('modal-prompt-icon');
    const cancelBtn = document.getElementById('modal-prompt-btn-cancel');
    const submitBtn = document.getElementById('modal-prompt-btn-submit');

    titleEl.textContent = title;
    msgEl.textContent = message;
    inputEl.placeholder = opts.placeholder || 'Name';
    inputEl.setAttribute('aria-label', opts.placeholder || 'Name');
    if (iconEl) iconEl.innerHTML = (opts.icon && ICONS[opts.icon])
      ? ICONS[opts.icon].replace('icon-svg', 'modal-prompt-svg')
      : PROMPT_FOLDER_ICON;
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
    function onKeyDown(e) {
      // preventDefault matters here: cleanup() restores focus to the control that
      // opened this dialog, and without it the same Enter — or its key-repeat —
      // reaches that control and reopens the dialog, which looks exactly like the
      // dialog refusing to close.
      if (e.key === 'Enter')  { e.preventDefault(); e.stopPropagation(); onSubmit(); }
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onCancel(); }
    }

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

// The glyph that marks a pinned note: on its row, in its context menu, and on the
// toolbar button. One constant so the three can never disagree.
const PIN_GLYPH = 'pin';

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
        state.tagLibrary = plain.tags;
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
    folders.push({
      ...f,
      name: await decryptText(f.name, key),
      // Absent on vaults written before the trash existed; treat as live.
      trashed: f.trashed === undefined ? false : (await decryptText(f.trashed, key)) === 'y'
    });
  }
  const notes = [];
  for (const n of (raw.notes || [])) {
    const tags = [];
    for (const t of (n.tags || [])) tags.push(await decryptText(t, key));
    notes.push({
      ...n,
      title: await decryptText(n.title, key),
      content: await decryptText(n.content, key),
      tags,
      // Absent on vaults written before pinning existed; treat as unpinned.
      pinned: n.pinned === undefined ? false : (await decryptText(n.pinned, key)) === 'y',
      // Same rule as pinned, same reason: trash membership is metadata about what
      // you keep and discard, so it rides encrypted, never as a bare boolean.
      trashed: n.trashed === undefined ? false : (await decryptText(n.trashed, key)) === 'y'
    });
  }
  // The tag library rides encrypted like every other user string. A tag exists
  // independently of the notes carrying it, so removing it from its last note
  // does not destroy it — it stays available to re-apply.
  const tags = [];
  for (const t of (raw.tags || [])) tags.push(await decryptText(t, key));
  return { folders, notes, tags };
}

async function encryptVaultFromState(key) {
  const folders = [];
  for (const f of state.folders) {
    folders.push({
      ...f,
      name: await encryptText(f.name || '', key),
      trashed: await encryptText(f.trashed ? 'y' : 'n', key)
    });
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
      // Encrypted, not a bare boolean: the object spread above would otherwise
      // carry `pinned: true` to the server in clear, handing it the list of
      // notes you care most about — metadata the vault is supposed to hide.
      // Single characters keep both states the same size by construction.
      // ('true'/'false' happen to encrypt to equal lengths too, because 4 and 5
      // bytes fall in the same base64 quantum, but that is luck rather than a
      // property to rely on — 'y'/'n' is equal-length for any encoding.)
      pinned: await encryptText(n.pinned ? 'y' : 'n', key),
      trashed: await encryptText(n.trashed ? 'y' : 'n', key),
      isEncrypted: true
    });
  }
  // Library = every declared tag plus every tag actually in use, so a vault
  // written by an older version gains its library on first save here.
  const library = new Set(state.tagLibrary || []);
  state.notes.forEach(n => (n.tags || []).forEach(t => library.add(t)));
  const tags = [];
  for (const t of [...library].sort((a, b) => a.localeCompare(b))) {
    tags.push(await encryptText(t, key));
  }
  return { folders, notes, tags };
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
    state.storeLoaded = true;

    // Restore saved tree open/collapse state. Ids from OTHER vaults are pruned: this
    // browser may have opened several vaults, and a saved list full of dead ids used
    // to leave a brand-new vault entirely collapsed, because the default-open rule
    // only fired when no saved state existed at all. If nothing in the saved list
    // belongs to this vault, treat it as a first run and open everything.
    const openAll = () => state.folders.forEach(f => state.openFolderIds.add(f.id));
    const savedOpenFolders = localStorage.getItem('lucid-open-folders');
    if (savedOpenFolders !== null) {
      try {
        const mine = new Set(state.folders.map(f => f.id));
        const kept = JSON.parse(savedOpenFolders).filter(id => mine.has(id));
        if (kept.length) state.openFolderIds = new Set(kept);
        else openAll();
      } catch (e) { openAll(); }
    } else {
      openAll();
    }
    localStorage.removeItem('lucid-open-tags');   // S-13: purge the legacy plaintext copy from disk
    const savedOpenTags = sessionStorage.getItem('lucid-open-tags');
    if (savedOpenTags !== null) {
      try { state.openTagNames = new Set(JSON.parse(savedOpenTags)); } catch (e) {}
    }

    // No selection here: at this point the notes are still ciphertext, so the
    // trashed flag cannot be read (it is an encrypted 'y'/'n'). The first LIVE
    // note is chosen by selectFirstLiveNote() once the vault is decrypted.
    await preloadDecryptedTitles();
    renderAll();
    updateLockScreenUI();
  } catch (err) {
    // J-10: an unreachable store must NEVER present as first-run. Before this
    // flag existed, a transient GET failure left authVerifier null and the lock
    // screen offered "Initialize LucID" over an EXISTING vault — and a new
    // passphrase typed there would have re-keyed and emptied it on the next
    // successful save. Fail closed into an explicit unreachable mode instead.
    state.storeLoaded = false;
    console.warn('fetchStore failed:', err);
    showSave('Vault could not be loaded from the server', 'error');
    updateLockScreenUI();
  }
}

// Top-level so both fetchStore() and the DOMContentLoaded init can call it.
// The single gate for the lock card: it decides what the button says and whether
// it can be pressed, in every state. Enter routes through the same gate, so the
// old guard messages (empty field, missing confirm, mismatch) are unreachable by
// construction and no longer exist.
let refusalTimer = null;
// The shake's duration lives in --motion-slow. Read it rather than restating it,
// so the hold and the animation stay one decision.
function refusalHoldMs() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--motion-slow').trim();
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return 350;
  return raw.endsWith('ms') ? n : n * 1000;
}

function refreshLockGate() {
  const lockInput = document.getElementById('lock-passphrase');
  const lockConfirmInput = document.getElementById('lock-passphrase-confirm');
  const lockBtn = document.getElementById('lock-unlock-btn');
  const lockError = document.getElementById('lock-error');
  if (!lockBtn) return;
  const v1 = lockInput ? lockInput.value : '';
  const v2 = lockConfirmInput ? lockConfirmInput.value : '';
  if (lockError) lockError.classList.add('hidden');

  // Server unreachable: Retry is always pressable, nothing to validate.
  if (!state.storeLoaded) {
    if (lockBtn) lockBtn.disabled = false;
    return;
  }

  // Existing vault: one field, and correctness cannot be known until it is
  // tried. The only honest gate is "something was typed".
  if (state.authVerifier) {
    if (lockInput) lockInput.classList.remove('is-matched', 'is-mismatch', 'is-refused', 'shake');
    if (lockBtn) {
      lockBtn.textContent = 'Unlock';
      lockBtn.disabled = !v1;
      lockBtn.classList.toggle('is-ready', !!v1);
    }
    return;
  }

  // First run: the two fields carry the state by glow, the button carries
  // readiness. Enter goes through this same gate, so no message is needed to
  // say what the colours already say.
  const setGlow = (cls, onlyConfirm) => {
    [lockInput, lockConfirmInput].forEach(el => {
      if (!el) return;
      el.classList.remove('is-matched', 'is-mismatch', 'is-refused', 'shake');
      if (!cls) return;
      // A match belongs to the PAIR, so both fields carry it. A mismatch belongs to
      // the confirm field alone: the first field is the reference and is never the
      // thing that is wrong, so painting it red was one problem shown twice.
      if (!onlyConfirm || el === lockConfirmInput) el.classList.add(cls);
    });
  };
  const setBtn = (label, ready) => {
    if (!lockBtn) return;
    lockBtn.textContent = label;
    lockBtn.disabled = !ready;
    lockBtn.classList.toggle('is-ready', ready);
  };

  if (!v1 || !v2) { setGlow(null); setBtn('Next', false); return; }
  if (v1 === v2)  { setGlow('is-matched'); setBtn('Continue', true); return; }
  if (v1.startsWith(v2)) { setGlow(null); setBtn('Next', false); return; }
  setGlow('is-mismatch', true); setBtn('Next', false);
}

function updateLockScreenUI() {
  const lockInputs = document.getElementById('lock-inputs');
  const lockConfirmInput = document.getElementById('lock-passphrase-confirm');
  const lockBtn = document.getElementById('lock-unlock-btn');
  const lockFooter = document.getElementById('lock-footer');
  const statusIcon = document.getElementById('lock-status-icon');
  const statusText = document.getElementById('lock-status-text');
  const lockStatus = document.getElementById('lock-status');

  const setStatus = (icon, text, bad) => {
    if (statusIcon) statusIcon.innerHTML = ICONS[icon] || '';
    if (statusText) statusText.textContent = text;
    if (lockStatus) lockStatus.classList.toggle('bad', !!bad);
  };

  // J-10: server unreachable. Neither Unlock nor Initialize is offerable because
  // we do not know which is true, so the passphrase field is hidden entirely:
  // Retry re-fetches the vault, it does not test a passphrase, and showing an
  // input here implied otherwise.
  if (!state.storeLoaded) {
    setStatus('heartSlash', 'Server unreachable', true);
    if (lockInputs) lockInputs.classList.add('hidden');
    if (lockFooter) lockFooter.classList.add('hidden');
    if (lockBtn) {
      lockBtn.textContent = 'Retry';
      lockBtn.disabled = false;
    }
    return;
  }

  if (lockInputs) lockInputs.classList.remove('hidden');

  if (!state.authVerifier) {
    // First run: the footer's warning belongs here, where the irreversible
    // choice is actually made.
    setStatus('passwordCheck', 'Set a passphrase to initialize your LucID', false);
    if (lockConfirmInput) lockConfirmInput.classList.remove('hidden');
    if (lockFooter) lockFooter.classList.remove('hidden');
  } else {
    setStatus('lock', 'Vault locked', false);
    if (lockConfirmInput) lockConfirmInput.classList.add('hidden');
    if (lockFooter) lockFooter.classList.add('hidden');
  }
  refreshLockGate();
}

// Persist tree open/collapse state. Folder ids are opaque and may live in
// localStorage; tag names are USER CONTENT in plaintext (S-13) — the vault
// encrypts tags at rest precisely because taxonomy is content, so the open-tags
// set is session-scoped: it dies with the tab like the unlock token, and never
// touches disk unencrypted.
function saveTreeState() {
  try {
    localStorage.setItem('lucid-open-folders', JSON.stringify([...state.openFolderIds]));
    sessionStorage.setItem('lucid-open-tags', JSON.stringify([...state.openTagNames]));
  } catch (e) {}
}

async function saveStore() {
  // Fail closed: never write the in-memory PLAINTEXT vault to the server.
  if (!state.encryptionKey || !state.kdf) {
    console.warn('saveStore aborted: vault is locked.');
    showSave('Locked before changes could sync', 'error');   // never silent (J-02)
    return;
  }
  try {
    showSave('Syncing changes to vault', 'saving');
    const { folders, notes, tags } = await encryptVaultFromState(state.encryptionKey);
    const res = await fetch(apiPath('api/store'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        schemaVersion: SCHEMA_VERSION,
        kdf: state.kdf,
        folders,
        notes,
        tags,
        authVerifier: state.authVerifier
      })
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    showSave('Synced to vault', '');
  } catch (err) {
    console.error('saveStore failed:', err);
    showSave('Sync error: changes were not saved to the vault', 'error');
  }
}

// Selection lives here, AFTER decryption, because "is this note trashed" is an
// encrypted flag: a deleted note must never become the editable active note
// (that rendered a trashed note in an editable pane with an empty tree, and
// autosave would have written to it).
// Runs on both entry paths, after decryption: complete the library, repair
// strandings, then select.
async function settleVaultOnEntry() {
  absorbInUseTags();
  if (adoptOrphanNotes()) await saveStore();
  selectFirstLiveNote();
}

// Every tag found on a note joins the in-memory library. Without this, a tag
// that arrived with the vault (rather than being created this session) would
// vanish the moment its last carrier let it go — the payload union alone was
// not enough, because it never wrote back into state.
function absorbInUseTags() {
  const all = new Set(state.tagLibrary || []);
  state.notes.forEach(n => (n.tags || []).forEach(t => all.add(t)));
  state.tagLibrary = [...all].sort((a, b) => a.localeCompare(b));
}

function selectFirstLiveNote() {
  const live = state.notes.filter(n => !n.trashed);
  const current = live.find(n => n.id === state.activeNoteId);
  const pick = current || live[0] || null;
  state.activeNoteId = pick ? pick.id : null;
  state.activeFolderId = pick ? pick.folderId : null;
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
  showSave('Syncing changes to vault', 'saving');
  state.saveTimeout = setTimeout(async () => {
    state.saveTimeout = null;
    commitEditorToNote(targetId);
    state.pendingNoteId = null;
    await saveStore();
    renderExplorer();
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

// The visible label is gone: three distinct glyphs carry the state, and the
// tooltip carries the detail. The text is kept in the DOM but visually hidden,
// because this element is an aria-live region and an icon swap alone announces
// nothing to a screen reader.
const SYNC_ICONS = { error: 'cloudCross', saving: 'cloudConnection', ok: 'cloudConnection' };

function showSave(message, cls) {
  const el = document.getElementById('save-indicator');
  if (!el) return;
  const icon = SYNC_ICONS[cls] || SYNC_ICONS.ok;
  const text = message || 'Synced to vault';
  el.className = 'sync-status-badge' + (cls ? ' ' + cls : '');
  el.title = text;
  el.setAttribute('aria-label', text);
  el.innerHTML = `${ICONS[icon]} <span class="visually-hidden">${escapeHtml(text)}</span>`;
}

// Container runtime. /health is the only runtime fact the browser can obtain,
// and it can only speak for the application container: reading the health of
// caddy or the DDNS updater would require mounting the Docker socket into the
// internet-facing process, which is not a trade this project will make.
function formatUptime(seconds) {
  const s = Math.max(0, Math.floor(Number(seconds) || 0));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d) return `${d}d ${h}h`;
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m`;
  return `${s}s`;
}

async function updateRuntimeIndicator() {
  const el = document.getElementById('runtime-indicator');
  if (!el) return;
  const set = (cls, msg) => {
    el.className = 'runtime-badge' + (cls ? ' ' + cls : '');
    el.title = msg;
    el.setAttribute('aria-label', msg);
  };
  try {
    const res = await fetch(apiPath('health'));
    if (!res.ok) throw new Error(`health ${res.status}`);
    const data = await res.json();
    const healthy = data && data.status === 'healthy';
    set(healthy ? '' : 'error',
        `Server ${healthy ? 'healthy' : 'reporting ' + String(data && data.status)} \u2014 running ${formatUptime(data && data.uptime)}`);
  } catch (err) {
    set('error', 'Server unreachable');
  }
}

// ─── RENDERERS ─────────────────────────────────────
// The three views over the same notes, as data rather than as branches. Module
// scope on purpose: the mode toggle, the keyboard handler and every renderer
// need the same list, and when this was three separate `if (mode === 'folders')`
// chains the third view was missed by four of them — edits and searches went on
// rendering the tag tree into a hidden container while the pinned list sat
// stale. A fourth view is now a row here, not another branch in five places.
const EXPLORER_MODES = {
  folders: { btn: 'btn-mode-folders', tree: 'folder-tree', render: renderTree },
  tags:    { btn: 'btn-mode-tags',    tree: 'tag-tree',    render: renderTagTree },
  pinned:  { btn: 'btn-mode-pinned',  tree: 'pinned-tree', render: renderPinnedTree }
};

// Show the container belonging to the active mode, hide the other two, and
// render it. The single entry point for "the note list changed".
// Search is its own view, not a filter applied to three others. While a query is
// live the explorer shows ONE flat list of matches: no folder headers, no tag
// groups, no pinned scaffolding to read around. Clearing the search puts the
// previous view back untouched, because the mode was never changed.
function noteMatchesQuery(n, q) {
  if (n.trashed) return false;
  const title = state.decryptedTitleCache.get(n.id) || n.title || '';
  return (title && title.toLowerCase().includes(q)) ||
         (n.tags && n.tags.some(t => t.toLowerCase().includes(q))) ||
         (typeof n.content === 'string' && !n.content.startsWith('ENC:') && n.content.toLowerCase().includes(q));
}

function renderSearchResults() {
  const mode = EXPLORER_MODES[state.explorerMode];
  const container = document.getElementById(mode.tree);
  if (!container) return;
  const q = state.searchQuery.trim().toLowerCase();
  container.innerHTML = '';
  container.setAttribute('role', 'tree');
  container.setAttribute('aria-label', 'Search results');

  const hits = state.notes.filter(n => noteMatchesQuery(n, q));
  if (!hits.length) {
    container.innerHTML = '<div class="empty-state empty-state-pane">No notes match</div>';
    return;
  }

  hits.forEach(note => {
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
    noteEl.innerHTML = `${ICONS.note} <span>${escapeHtml(displayTitle)}</span>` +
      (note.pinned ? `<span class="pin-marker" aria-hidden="true">${ICONS[PIN_GLYPH]}</span>` : '');

    noteEl.addEventListener('click', async e => {
      e.stopPropagation();
      await flushPendingSave();
      state.trashPreviewId = null;
      state.activeNoteId = note.id;
      state.activeFolderId = note.folderId;
      renderAll();
    });
    noteEl.addEventListener('contextmenu', e => {
      e.preventDefault();
      showTreeContextMenu(e.clientX, e.clientY, noteContextItems(note));
    });
    container.appendChild(noteEl);
  });

  updateTreeRoving(container);
}

function renderExplorer() {
  if (!EXPLORER_MODES[state.explorerMode]) state.explorerMode = 'folders';
  const active = state.explorerMode;
  Object.entries(EXPLORER_MODES).forEach(([name, m]) => {
    const btn = document.getElementById(m.btn);
    const tree = document.getElementById(m.tree);
    if (btn) {
      btn.classList.toggle('active', name === active);
      btn.setAttribute('aria-pressed', String(name === active));
    }
    if (tree) tree.classList.toggle('hidden', name !== active);
  });
  if (state.searchQuery.trim()) renderSearchResults();
  else EXPLORER_MODES[active].render();
}

function renderAll() {
  renderExplorer();
  renderActiveNote();
  renderTOC();
  renderMetrics();
  renderTags();
  renderTrashPanel();
  updateVaultShield();
}

// Move focus onto a row that has just been rendered, so the keyboard lands where
// the user's attention already is and focus is not left sitting on the button that
// created the thing.
function focusTreeItem(treeId) {
  const el = document.querySelector(`[data-tree-id="${treeId}"]`);
  if (!el) return;
  const container = el.closest('[role="tree"]');
  if (container) updateTreeRoving(container);
  el.tabIndex = 0;
  el.focus();
}

// Cleanup for a finished drag. It is called by the DROP handler, and not left to
// `dragend`, because dragend is unreachable after a successful drop: the drop calls
// renderAll(), which rebuilds the tree and destroys the very element the drag
// started on, so the browser has nothing left to fire dragend at. Measured on a
// live session: 20 dragstarts, 18 drops, 2 dragends — the two being the drags that
// were abandoned without dropping. Cleanup therefore has to belong to the path that
// actually runs, not to the one that only runs when the user changes their mind.
function clearDragState() {
  state.dragNoteId = null;
  document.querySelectorAll('.tree-note.dragging').forEach(el => el.classList.remove('dragging'));
  document.querySelectorAll('.tree-folder-header.drop-target').forEach(el => el.classList.remove('drop-target'));
}

// J-09: group heights are MEASURED, not hand-computed. The old (n*36+12)px
// formula assumed 36px per row while the CSS row actually costs ~37.5px, so
// folders clipped their tail from the 10th note. scrollHeight is the truth;
// converted to rem so the stored value stays relational.
function sizeTreeGroups(container) {
  container.querySelectorAll('.tree-notes:not(.collapsed)').forEach(el => {
    el.style.maxHeight = (el.scrollHeight / 16) + 'rem';
  });
}

function renderTree() {
  const container = document.getElementById('folder-tree');
  if (!container) return;
  container.innerHTML = '';
  container.setAttribute('role', 'tree');
  container.setAttribute('aria-label', 'Folders');
  state.folders.filter(f => !f.trashed).forEach(folder => {
    const folderNotes = state.notes.filter(n => !n.trashed && n.folderId === folder.id);

    const isOpen = state.openFolderIds.has(folder.id);
    const isActive = state.activeFolderId === folder.id;

    const wrapper = document.createElement('div');
    wrapper.className = 'tree-folder';

    const header = document.createElement('div');
    header.className = 'tree-folder-header' + (isActive ? ' active' : '') + (isOpen ? ' open' : '');
    header.setAttribute('role', 'treeitem');
    // An empty folder has nothing to expand and nothing to count: no caret, no
    // badge, and the closed glyph regardless of stored open state. The state is
    // still remembered — it simply has nothing to paint until a note arrives.
    const isEmpty = folderNotes.length === 0;
    if (isEmpty) header.removeAttribute('aria-expanded');
    else header.setAttribute('aria-expanded', String(isOpen));
    header.tabIndex = -1;
    header.dataset.treeId = 'folder:' + folder.id;

    const caretHtml = isEmpty
      ? '<span class="tree-caret-blank" aria-hidden="true"></span>'
      : (isOpen ? ICONS.chevronOpen : ICONS.chevron);
    const folderIconHtml = (isOpen && !isEmpty) ? ICONS.folderOpen : ICONS.folderClosed;
    const countHtml = isEmpty ? '' : `<span class="count-badge">${folderNotes.length}</span>`;
    header.innerHTML = `${caretHtml}${folderIconHtml} <span>${escapeHtml(folder.name)}</span>${countHtml}`;

    header.addEventListener('click', () => {
      state.activeFolderId = folder.id;
      if (state.openFolderIds.has(folder.id)) state.openFolderIds.delete(folder.id);
      else state.openFolderIds.add(folder.id);
      saveTreeState();
      renderTree();
    });

    // Drop target: a note dragged onto this folder header moves into it.
    header.addEventListener('dragover', e => {
      if (!state.dragNoteId) return;
      const dragged = state.notes.find(n => n.id === state.dragNoteId);
      if (!dragged || (!dragged.trashed && dragged.folderId === folder.id)) return;
      e.preventDefault();                       // without this the drop never fires
      e.dataTransfer.dropEffect = 'move';
      header.classList.add('drop-target');
    });

    header.addEventListener('dragleave', () => header.classList.remove('drop-target'));

    header.addEventListener('drop', async e => {
      e.preventDefault();
      const noteId = state.dragNoteId;
      clearDragState();
      if (!noteId) return;
      const note = state.notes.find(n => n.id === noteId);
      if (!note || (!note.trashed && note.folderId === folder.id)) return;
      await flushPendingSave();                 // never lose the in-flight edit
      note.folderId = folder.id;
      note.trashed = false;                     // dragging out of the trash restores
      note.updatedAt = new Date().toISOString();
      state.openFolderIds.add(folder.id);       // reveal where it landed
      saveTreeState();
      renderAll();
      await saveStore();
    });

    // Right-click context menu for Folder
    header.addEventListener('contextmenu', e => {
      e.preventDefault();
      showTreeContextMenu(e.clientX, e.clientY, [
        { label: 'New Note in Folder', icon: ICONS.noteAdd, action: () => createNoteInFolder(folder.id) },
        { label: 'Rename Folder', icon: ICONS.edit, action: () => renameFolder(folder) },
        { divider: true },
        { label: 'Delete Folder', icon: ICONS.folderCross, danger: true, action: () => trashFolder(folder) }
      ]);
    });

    wrapper.appendChild(header);

    const notesContainer = document.createElement('div');
    notesContainer.className = 'tree-notes' + (isOpen ? '' : ' collapsed');
    notesContainer.setAttribute('role', 'group');
    if (!isOpen) notesContainer.style.maxHeight = '0';   // open groups sized by sizeTreeGroups()

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

      noteEl.innerHTML = `${ICONS.note} <span>${escapeHtml(displayTitle)}</span>` +
        (note.pinned ? `<span class="pin-marker" aria-hidden="true">${ICONS[PIN_GLYPH]}</span>` : '');

      noteEl.draggable = true;

      noteEl.addEventListener('dragstart', e => {
        state.dragNoteId = note.id;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', note.id);
        noteEl.classList.add('dragging');
      });

      // Only reached when a drag is abandoned without dropping on a folder.
      noteEl.addEventListener('dragend', clearDragState);

      noteEl.addEventListener('click', async e => {
        e.stopPropagation();
        await flushPendingSave();   // J-02: never drop the previous note's edits
        state.trashPreviewId = null;   // any live selection leaves the trash preview
        state.activeNoteId = note.id;
        state.activeFolderId = note.folderId;
        renderAll();
      });

      // Right-click context menu for Note
      noteEl.addEventListener('contextmenu', e => {
        e.preventDefault();
        showTreeContextMenu(e.clientX, e.clientY, noteContextItems(note));
      });

      notesContainer.appendChild(noteEl);
    });

    wrapper.appendChild(notesContainer);
    container.appendChild(wrapper);
  });
  sizeTreeGroups(container);
  updateTreeRoving(container);
}

// ─── EXPANDABLE NESTED TAG TREE IN TAG VIEW ──────
// Pinned view: a flat list of pinned notes. No folder headers and no grouping —
// only notes can be pinned, so there is no hierarchy to show and nothing to expand.
function renderPinnedTree() {
  const container = document.getElementById('pinned-tree');
  if (!container) return;
  container.innerHTML = '';
  container.setAttribute('role', 'tree');
  container.setAttribute('aria-label', 'Pinned notes');
  const matching = state.notes.filter(n => n.pinned && !n.trashed);
  if (!matching.length) {
    container.innerHTML = '<div class="empty-state empty-state-pane">Nothing pinned yet. Right-click a note to pin it.</div>';
    return;
  }

  matching.forEach(note => {
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
    noteEl.innerHTML = `${ICONS.note} <span>${escapeHtml(displayTitle)}</span>` +
      `<span class="pin-marker" aria-hidden="true">${ICONS[PIN_GLYPH]}</span>`;

    noteEl.addEventListener('click', async e => {
      e.stopPropagation();
      await flushPendingSave();
      state.trashPreviewId = null;   // any live selection leaves the trash preview
      state.activeNoteId = note.id;
      state.activeFolderId = note.folderId;
      renderAll();
    });

    noteEl.addEventListener('contextmenu', e => {
      e.preventDefault();
      showTreeContextMenu(e.clientX, e.clientY, noteContextItems(note));
    });

    container.appendChild(noteEl);
  });

  updateTreeRoving(container);
}

function renderTagTree() {
  const container = document.getElementById('tag-tree');
  if (!container) return;
  container.innerHTML = '';
  container.setAttribute('role', 'tree');
  container.setAttribute('aria-label', 'Tags');

  const tagMap = new Map();
  state.notes.filter(n => !n.trashed).forEach(n => {
    (n.tags || []).forEach(t => {
      const list = tagMap.get(t) || [];
      list.push(n);
      tagMap.set(t, list);
    });
  });

  if (!tagMap.size) {
    container.innerHTML = '<div class="empty-state empty-state-pane">No tags yet. Right-click a note to add one.</div>';
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
    header.innerHTML = `${isOpen ? ICONS.chevronOpen : ICONS.chevron}${ICONS.tag} <span>#${escapeHtml(tag)}</span><span class="count-badge">${tagNotes.length}</span>`;

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
    if (!isOpen) notesContainer.style.maxHeight = '0';   // open groups sized by sizeTreeGroups()

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
        state.trashPreviewId = null;   // any live selection leaves the trash preview
        state.activeNoteId = note.id;
        state.activeFolderId = note.folderId;
        renderAll();
      });

      noteEl.addEventListener('contextmenu', e => {
        e.preventDefault();
        showTreeContextMenu(e.clientX, e.clientY, noteContextItems(note));
      });

      notesContainer.appendChild(noteEl);
    });

    wrapper.appendChild(notesContainer);
    container.appendChild(wrapper);
  });
  sizeTreeGroups(container);
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
  // Driven off EXPLORER_MODES so a view cannot be given rows, roving tabindex and
  // role="tree" and then be left without arrow keys, which is what happened to the
  // pinned view while this was a hand-written list of two ids. The trash list is
  // not an explorer mode (it lives in its own panel above the footer) but its
  // rows join the same wiring.
  [...Object.values(EXPLORER_MODES).map(m => m.tree), 'trash-list'].forEach(id => {
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
// Where the last menu opened — submenus (the tag picker) reuse it so they land
// on the same anchor instead of guessing.
let lastMenuX = 0;
let lastMenuY = 0;

function showTreeContextMenu(x, y, items) {
  lastMenuX = x;
  lastMenuY = y;
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
    btn.className = 'context-menu-item' + (item.danger ? ' danger' : '') + (item.active ? ' active' : '');
    btn.innerHTML = (item.icon || '') + `<span>${escapeHtml(item.label)}</span>`;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      // keepOpen: multi-select menus (tag picker) refresh themselves instead of
      // closing, so several toggles cost one open.
      if (!item.keepOpen) closeContextMenu();
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
// A note is only reachable through a LIVE folder, so every creation path must
// resolve to one. Without this a note could be filed into a trashed folder (or
// none at all) and existed in the vault while being invisible in every view.
function liveFolderId() {
  const live = state.folders.filter(f => !f.trashed);
  const active = live.find(f => f.id === state.activeFolderId);
  return (active || live[0] || null)?.id || null;
}

// No live folder anywhere: recreate General, the same convention the trash
// restore path uses when a note's folder is gone for good.
function ensureLiveFolderId() {
  const existing = liveFolderId();
  if (existing) return existing;
  const folder = { id: newId('f'), name: 'General', parentId: null, trashed: false };
  state.folders.push(folder);
  state.activeFolderId = folder.id;
  state.openFolderIds.add(folder.id);
  return folder.id;
}

// Repair for vaults that already contain stranded notes (a note filed into a
// folder that was trashed or permanently deleted): give them a live home so
// they stop being invisible. Trashed notes are left alone — their folderId is
// the restore memory.
function adoptOrphanNotes() {
  const liveIds = new Set(state.folders.filter(f => !f.trashed).map(f => f.id));
  const orphans = state.notes.filter(n => !n.trashed && !liveIds.has(n.folderId));
  if (!orphans.length) return false;
  const home = ensureLiveFolderId();
  orphans.forEach(n => { n.folderId = home; });
  return true;
}

async function createNoteInFolder(folderId) {
  const liveIds = new Set(state.folders.filter(f => !f.trashed).map(f => f.id));
  if (!liveIds.has(folderId)) folderId = ensureLiveFolderId();
  const newNote = {
    id: newId('n'),
    folderId,
    title: 'New Note',
    content: '# New Note\n\nStart writing here...',
    isEncrypted: !!state.encryptionKey,
    tags: [],
    pinned: false,
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
  const name = await showPromptModal('Rename Folder', 'Enter new folder name:', folder.name, { placeholder: 'Folder name' });
  if (!name || name === folder.name) return;
  folder.name = name;
  await saveStore();
  renderAll();
}

// ─── TRASH ─────────────────────────────────────────
// Soft delete (decided 2026-08-02): Delete moves things here with NO confirm —
// the trash IS the undo. The only hard deletes are the per-item "Delete
// permanently" and "Empty Trash", both behind the confirm modal, and emptying is
// manual only. A note's folderId doubles as its restore memory; restoring a note
// whose folder is also in the trash brings the folder back but leaves the
// folder's OTHER trashed notes where they are — they still point at it, so
// restoring them later drops them straight back in. Trash state rides in the
// vault encrypted (like pinned), so it follows the user across devices and the
// server never learns what is kept versus discarded.

function firstLiveFolder() { return state.folders.find(f => !f.trashed) || null; }

function retargetActiveAfterTrash() {
  const live = state.notes.filter(n => !n.trashed);
  if (!live.find(n => n.id === state.activeNoteId)) {
    state.activeNoteId = live.length ? live[0].id : null;
    const flf = firstLiveFolder();
    state.activeFolderId = live.length ? live[0].folderId : (flf ? flf.id : null);
  }
}

async function trashFolder(folder) {
  await flushPendingSave();
  folder.trashed = true;
  state.notes.forEach(n => {
    if (n.folderId === folder.id && !n.trashed) {
      n.trashed = true;
      n.updatedAt = new Date().toISOString();
    }
  });
  retargetActiveAfterTrash();
  await saveStore();
  renderAll();
}

async function restoreFolder(folder) {
  folder.trashed = false;   // back to the root tree; its notes stay in the trash until restored themselves
  await saveStore();
  renderAll();
}

async function permaDeleteFolder(folder) {
  const ok = await showConfirmModal('Delete Permanently', `Permanently delete folder "${folder.name}"? This cannot be undone.`);
  if (!ok) return;
  state.folders = state.folders.filter(f => f.id !== folder.id);
  await saveStore();
  renderAll();
}

async function renameNote(note) {
  const currentTitle = state.decryptedTitleCache.get(note.id) || 'Untitled Note';
  const newTitle = await showPromptModal('Rename Note', 'Enter new title:', currentTitle, { placeholder: 'Note title', icon: 'note' });
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

// The right-click menu for a note, identical in every view. Items reflect state
// rather than listing both halves of a toggle: a pinned note offers only Remove
// Pin, a note with no tags offers no Remove Tag. Offering an action that cannot
// apply is the same defect as hiding one that can.
function noteContextItems(note) {
  const items = [
    { label: note.pinned ? 'Remove Pin' : 'Pin Note', icon: note.pinned ? ICONS.pinRemove : ICONS.pinAdd, action: () => togglePin(note) },
    { label: 'Tags…', icon: ICONS.tag, keepOpen: true, action: () => openTagMenu(note, lastMenuX, lastMenuY) }
  ];
  items.push({ label: 'Rename Note', icon: ICONS.edit, action: () => renameNote(note) });
  items.push({ divider: true });
  items.push({ label: 'Delete Note', icon: ICONS.noteRemove, danger: true, action: () => trashNote(note) });
  return items;
}

// ─── TAGS ──────────────────────────────────────────
// One normalizer, one mutation path, one picker. A tag is an attribute a note
// carries, so the UI shows the vault's vocabulary and lets you toggle
// membership; typing is reserved for genuinely NEW tags, which is the only way
// a typo can no longer silently mint a near-duplicate.

const TAG_MAX_LENGTH = 32;

function normalizeTag(raw) {
  return String(raw || '')
    .replace(/^#/, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .slice(0, TAG_MAX_LENGTH);
}

// The vault's tag vocabulary: the declared library UNION every tag in use.
// A tag survives losing its last carrier — that is what makes it re-appliable
// instead of forcing the user to retype a tag they already created.
function tagVocabulary() {
  const all = new Set(state.tagLibrary || []);
  state.notes.forEach(n => {
    if (n.trashed) return;
    (n.tags || []).forEach(t => all.add(t));
  });
  return [...all].sort((a, b) => a.localeCompare(b));
}

// The single tag mutation for a note: on -> off, off -> on.
async function toggleTagOnNote(note, tag) {
  const clean = normalizeTag(tag);
  if (!clean) return;
  note.tags = note.tags || [];
  // Applying a tag also declares it: the library is how it stays re-appliable
  // after it loses its last carrier.
  if (!(state.tagLibrary || []).includes(clean)) state.tagLibrary.push(clean);
  note.tags = note.tags.includes(clean)
    ? note.tags.filter(t => t !== clean)
    : [...note.tags, clean];
  note.updatedAt = new Date().toISOString();
  await saveStore();
  renderTags();
  renderExplorer();
}

// The picker: vocabulary with ticks on the note's own tags, click to toggle,
// menu stays open for multi-tagging, plus one entry to create a new tag.
function openTagMenu(note, x, y) {
  const items = tagVocabulary().map(tag => ({
    label: '#' + tag,
    // Two visible states, because this is a membership list and not a
    // one-of-many choice: on = applied to this note, off = in your library and
    // available to apply. Clicking flips it.
    icon: (note.tags || []).includes(tag) ? ICONS.toggleOn : ICONS.toggleOff,
    keepOpen: true,
    action: async () => {
      await toggleTagOnNote(note, tag);
      openTagMenu(note, x, y);   // refresh the ticks in place
    }
  }));
  if (items.length) items.push({ divider: true });
  items.push({
    label: 'New tag…',
    icon: ICONS.tag,
    action: async () => {
      const input = await showPromptModal('New Tag', 'Name the new tag (without #):', '', { placeholder: 'Tag name', icon: 'tag' });
      if (input === null) return;
      const clean = normalizeTag(input);
      if (!clean) return;
      // Declare it even if the note already carries it: creating a tag adds it
      // to the vault's library, which is what keeps it re-appliable later.
      if (!(state.tagLibrary || []).includes(clean)) state.tagLibrary.push(clean);
      if ((note.tags || []).includes(clean)) { await saveStore(); return; }
      await toggleTagOnNote(note, clean);
    }
  });
  showTreeContextMenu(x, y, items);
}

async function togglePin(note) {
  note.pinned = !note.pinned;
  note.updatedAt = new Date().toISOString();
  renderAll();
  await saveStore();
}

async function trashNote(note) {
  await flushPendingSave();
  note.trashed = true;
  note.updatedAt = new Date().toISOString();
  retargetActiveAfterTrash();
  await saveStore();
  renderAll();
}

async function restoreNote(note) {
  const home = state.folders.find(f => f.id === note.folderId);
  if (home && home.trashed) {
    home.trashed = false;             // the folder returns; its other trashed notes stay put
  } else if (!home) {
    let target = firstLiveFolder();   // original folder was permanently deleted
    if (!target) {
      target = { id: newId('f'), name: 'General', parentId: null, trashed: false };
      state.folders.push(target);
    }
    note.folderId = target.id;
  }
  note.trashed = false;
  note.updatedAt = new Date().toISOString();
  // Restoring the previewed note opens it LIVE, in the user's own view mode.
  if (state.trashPreviewId === note.id) state.trashPreviewId = null;
  state.activeNoteId = note.id;
  state.activeFolderId = note.folderId;
  state.openFolderIds.add(note.folderId);
  saveTreeState();
  await saveStore();
  renderAll();
}

async function permaDeleteNote(note) {
  const ok = await showConfirmModal('Delete Permanently', 'Permanently delete this note? This cannot be undone.');
  if (!ok) return;
  state.notes = state.notes.filter(n => n.id !== note.id);
  state.decryptedTitleCache.delete(note.id);   // J-08: don't retain a decrypted title after delete
  await saveStore();
  renderAll();
}

async function emptyTrash() {
  const nf = state.folders.filter(f => f.trashed).length;
  const nn = state.notes.filter(n => n.trashed).length;
  if (!nf && !nn) return;
  const ok = await showConfirmModal('Empty Trash', `Permanently delete ${nn} note(s) and ${nf} folder(s)? This cannot be undone.`);
  if (!ok) return;
  state.notes.filter(n => n.trashed).forEach(n => state.decryptedTitleCache.delete(n.id));
  state.notes = state.notes.filter(n => !n.trashed);
  state.folders = state.folders.filter(f => !f.trashed);
  await saveStore();
  renderAll();
}

// The panel above the trash row: trashed folders first, then notes. Rows join the
// shared tree keyboard wiring; notes are draggable — dropping one on a live
// folder header restores it into that folder.
function renderTrashPanel() {
  const list = document.getElementById('trash-list');
  if (!list) return;
  const tf = state.folders.filter(f => f.trashed);
  const tn = state.notes.filter(n => n.trashed);
  list.innerHTML = '';
  if (!tf.length && !tn.length) {
    list.innerHTML = '<div class="empty-state">Trash is empty</div>';
    return;
  }
  tf.forEach(folder => {
    const el = document.createElement('div');
    el.className = 'tree-note';
    el.setAttribute('role', 'treeitem');
    el.tabIndex = -1;
    el.dataset.treeId = 'trash-folder:' + folder.id;
    el.innerHTML = `${ICONS.folderCross} <span>${escapeHtml(folder.name)}</span>`;
    el.addEventListener('contextmenu', e => {
      e.preventDefault();
      showTreeContextMenu(e.clientX, e.clientY, [
        { label: 'Restore Folder', icon: ICONS.folderOpen, action: () => restoreFolder(folder) },
        { divider: true },
        { label: 'Delete Permanently', icon: ICONS.trash, danger: true, action: () => permaDeleteFolder(folder) }
      ]);
    });
    list.appendChild(el);
  });
  tn.forEach(note => {
    const el = document.createElement('div');
    el.className = 'tree-note';
    el.setAttribute('role', 'treeitem');
    el.tabIndex = -1;
    el.dataset.treeId = 'trash-note:' + note.id;
    if (note.id === state.trashPreviewId) el.classList.add('active');
    let title = state.decryptedTitleCache.get(note.id);
    if (!title || title.startsWith('ENC:')) {
      title = note.title && !note.title.startsWith('ENC:') ? note.title : 'Untitled Note';
    }
    el.innerHTML = `${ICONS.noteRemove} <span>${escapeHtml(title)}</span>`;
    el.draggable = true;
    el.addEventListener('dragstart', e => {
      state.dragNoteId = note.id;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', note.id);
      el.classList.add('dragging');
    });
    el.addEventListener('dragend', clearDragState);
    // Selecting a trashed note previews it read-only in the center pane, so it
    // can be identified before restoring. No edit path opens.
    el.addEventListener('click', e => {
      e.stopPropagation();
      state.trashPreviewId = note.id;
      renderAll();
    });
    el.addEventListener('contextmenu', e => {
      e.preventDefault();
      showTreeContextMenu(e.clientX, e.clientY, [
        { label: 'Restore Note', icon: ICONS.note, action: () => restoreNote(note) },
        { divider: true },
        { label: 'Delete Permanently', icon: ICONS.trash, danger: true, action: () => permaDeleteNote(note) }
      ]);
    });
    list.appendChild(el);
  });
  updateTreeRoving(list);
}


async function renameTagGlobal(oldTag) {
  const input = await showPromptModal('Rename Tag', `Rename tag #${oldTag} to:`, oldTag, { placeholder: 'Tag name', icon: 'tag' });
  if (input === null) return;
  // J-11: normalize BEFORE validating — an input of "#" must not collapse into
  // an empty tag written onto every carrier. One normalizer for every path.
  const clean = normalizeTag(input);
  if (!clean || clean === oldTag) return;
  state.notes.forEach(n => {
    if (!n.tags || !n.tags.includes(oldTag)) return;   // library renamed below
    // Set-dedupe: renaming #a to #b on a note that already has #b must not
    // leave ['b','b'] behind.
    n.tags = [...new Set(n.tags.map(t => (t === oldTag ? clean : t)))];
    n.updatedAt = new Date().toISOString();
  });
  // The library follows the rename, or the old name would linger as a ghost.
  state.tagLibrary = [...new Set((state.tagLibrary || []).map(t => (t === oldTag ? clean : t)))];
  await saveStore();   // immediate, like every other tag mutation (one idiom)
  renderAll();
}

async function removeTagGlobal(tag) {
  const ok = await showConfirmModal('Delete Tag', `Delete tag #${tag} from the vault? It is removed from every note and from your tag list.`);
  if (!ok) return;
  state.notes.forEach(n => {
    if (n.tags) n.tags = n.tags.filter(t => t !== tag);
  });
  // This is the one action that destroys a tag: it leaves the library too.
  state.tagLibrary = (state.tagLibrary || []).filter(t => t !== tag);
  await saveStore();
  renderAll();
}

// Not async: the vault is decrypted into memory on unlock, so this reads plaintext
// straight out of state. It awaited a per-note decrypt before that boundary moved,
// and the leftover keyword advertised an ordering guarantee its one caller does not
// take and does not need.
function renderActiveNote() {
  const textarea = document.getElementById('markdown-textarea');
  const preview = document.getElementById('markdown-preview');
  const splitContainer = document.getElementById('editor-split');

  // Trash preview: a selected trashed note renders READ-ONLY in the preview pane
  // so it can be identified before restoring - the editor never loads it, so no
  // edit path exists. The user's own view mode (including split orientation) is
  // NEVER overwritten by this: it stays in state.viewMode and localStorage, and
  // leaving the preview simply re-applies it.
  const tp = state.trashPreviewId
    ? state.notes.find(n => n.id === state.trashPreviewId && n.trashed)
    : null;
  if (state.trashPreviewId && !tp) state.trashPreviewId = null;   // restored or purged meanwhile
  if (tp) {
    splitContainer.className = 'editor-split mode-preview trash-preview';
    document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
    const tabPreview = document.getElementById('tab-mode-preview');
    if (tabPreview) tabPreview.classList.add('active');
    renderPreview(tp.content || '');
    return;
  }
  if (splitContainer.classList.contains('trash-preview')) {
    // Leaving the trash preview: re-apply the persisted mode - it never changed.
    setViewMode(state.viewMode);
  }

  // A trashed note is never the editable active note, whatever route set the id:
  // the trash preview above is the only way a deleted note reaches the screen.
  const active = state.notes.find(n => n.id === state.activeNoteId);
  const note = active && !active.trashed ? active : null;

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
  addCodeCopyButtons(preview);
}

// A copy control per fenced block. Built with createElement and our own icon
// constants AFTER sanitising, so nothing here can carry note content into markup.
function addCodeCopyButtons(scope) {
  scope.querySelectorAll('pre').forEach(pre => {
    if (pre.querySelector('.code-copy')) return;
    const code = pre.querySelector('code');
    if (!code) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy';
    btn.title = 'Copy code';
    btn.setAttribute('aria-label', 'Copy code');
    btn.innerHTML = ICONS.copy;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        btn.innerHTML = ICONS.tickSquare;
        btn.classList.add('done');
        btn.title = 'Copied';
        setTimeout(() => {
          btn.innerHTML = ICONS.copy;
          btn.classList.remove('done');
          btn.title = 'Copy code';
        }, 1400);
      } catch (err) {
        console.warn('Clipboard write refused:', err);
        showSave('Clipboard unavailable in this browser', 'error');
      }
    });
    pre.appendChild(btn);
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

// The inspector follows whatever the center pane shows: the trash preview when
// one is open (read-only, identification only), otherwise the active note.
function displayedNote() {
  if (state.trashPreviewId) {
    const tp = state.notes.find(n => n.id === state.trashPreviewId && n.trashed);
    if (tp) return tp;
  }
  return state.notes.find(n => n.id === state.activeNoteId);
}

function renderTags() {
  const container = document.getElementById('tags-container');
  const note = displayedNote();
  if (!note || !note.tags || !note.tags.length) {
    container.innerHTML = '<div class="empty-state">No tags</div>';
    return;
  }
  container.innerHTML = '';
  const readOnly = !!note.trashed;   // trashed notes are not editable, tags included
  note.tags.forEach((tag, idx) => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.innerHTML = `#${escapeHtml(tag)}` + (readOnly ? '' : ` <span class="tag-del-btn" title="Remove Tag">×</span>`);

    const del = chip.querySelector('.tag-del-btn');
    if (del) del.addEventListener('click', e => {
      e.stopPropagation();
      toggleTagOnNote(note, tag);   // one mutation path for every tag change
    });

    container.appendChild(chip);
  });
}

function renderMetrics() {
  const shown = displayedNote();
  const text = (shown && shown.trashed ? shown.content : document.getElementById('markdown-textarea').value) || '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  document.getElementById('val-words').textContent = words.toLocaleString();
  document.getElementById('val-chars').textContent = text.length.toLocaleString();
  document.getElementById('val-lines').textContent = text ? text.split('\n').length.toLocaleString() : '0';
}

// An indicator must be able to say something other than "fine". The one condition
// this badge can truthfully detect is Web Crypto being unavailable (plain HTTP to
// an IP) — the same condition the unlock path reports as SECURE_CONTEXT_REQUIRED.
// ── VAULT POSTURE ─────────────────────────────────
// The deleted E2EE badge reported whether crypto.subtle exists. That can only be
// true where the badge lived: reaching the app requires deriveKey(), which throws
// SECURE_CONTEXT_REQUIRED without it, so the badge's false state was unreachable
// and its role="status" announced a value with one possible value. The honest
// report of that failure already lives on the lock screen, where it blocks entry.
//
// What DOES vary while you are inside is how long the key will sit in memory, and
// nothing reported it. The lock button carries that in its own glyph now.
const AUTOLOCK_HARD_CEILING_MIN = 60;
const VAULT_SHIELD_WARN_MS = 60000;    // one 15s sweep, with room to spare
let idleLastActivity = Date.now();

function autolockSoftMin() {
  const raw = parseFloat(localStorage.getItem('lucid-autolock-min'));
  return Number.isFinite(raw) ? raw : 5;                       // default 5 min
}
function getAutolockMs() {
  const soft = autolockSoftMin();
  const eff = soft > 0 ? Math.min(soft, AUTOLOCK_HARD_CEILING_MIN) : AUTOLOCK_HARD_CEILING_MIN;
  return eff * 60 * 1000;
}

function updateVaultShield() {
  const btn = document.getElementById('btn-lock-vault');
  if (!btn) return;
  const glyph = btn.querySelector('.lock-glyph');
  const soft = autolockSoftMin();
  const left = getAutolockMs() - (Date.now() - idleLastActivity);

  let mark, icon, msg;
  if (state.encryptionKey && left <= VAULT_SHIELD_WARN_MS) {
    mark = 'warn';
    icon = ICONS.shieldCross;
    msg = 'Locking in under a minute \u00b7 move or type to stay \u00b7 click to lock now';
  } else if (soft > 0) {
    mark = 'armed';
    icon = ICONS.shieldSecurity;
    msg = `Lock vault \u00b7 AES-256-GCM \u00b7 auto-locks after ${soft} min idle`;
  } else {
    mark = 'open';
    icon = ICONS.shield;
    msg = `Lock vault \u00b7 AES-256-GCM \u00b7 auto-lock off, hard ceiling ${AUTOLOCK_HARD_CEILING_MIN} min`;
  }

  btn.classList.toggle('is-warning', mark === 'warn');
  btn.title = msg;
  btn.setAttribute('aria-label', msg);
  // Repaint only on a real change: this runs every 15 seconds.
  if (glyph && glyph.dataset.mark !== mark) {
    glyph.dataset.mark = mark;
    glyph.innerHTML = icon;
  }
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
      const newWidth = Math.max(240, Math.min(480, e.clientX));   // floor matches the CSS min-width (15rem)
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
      const newWidth = Math.max(192, Math.min(400, window.innerWidth - e.clientX));   // floor matches the CSS min-width (12rem)
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
// Module scope, not inside the init closure: renderActiveNote re-applies the
// persisted mode when leaving the trash preview. Choosing a view tab is itself
// an explicit exit from the trash preview - the pane then belongs to the LIVE
// active note again, in the mode the user just chose.
function setViewMode(mode) {
  const tabEditor = document.getElementById('tab-mode-editor');
  const tabSplit = document.getElementById('tab-mode-split');
  const tabPreview = document.getElementById('tab-mode-preview');
  const splitContainer = document.getElementById('editor-split');
  const wasTrashPreview = state.trashPreviewId !== null;
  state.trashPreviewId = null;

  state.viewMode = mode;
  [tabEditor, tabSplit, tabPreview].forEach(t => t && t.classList.remove('active'));
  splitContainer.className = 'editor-split mode-' + mode;

  const iconSpan = tabSplit ? tabSplit.querySelector('.split-tab-icon') : null;

  if (mode === 'editor') {
    tabEditor && tabEditor.classList.add('active');
    if (iconSpan) iconSpan.innerHTML = ICONS.gridMixed;
  } else if (mode.startsWith('split')) {
    tabSplit && tabSplit.classList.add('active');
    if (iconSpan) {
      // One glyph, turned: lin-grid-9's centre line is vertical for two columns and
      // horizontal (rotated) for two rows, so the icon IS the layout it produces.
      iconSpan.innerHTML = mode === 'split-horizontal'
        ? ICONS.gridSplit
        : ICONS.gridSplit.replace('class="icon-svg"', 'class="icon-svg turn-90"');
    }
    tabSplit.title = mode === 'split-horizontal' ? 'Split View (Side-by-Side Left/Right — Click to switch to Top/Bottom)' : 'Split View (Top/Bottom — Click to switch to Left/Right)';
  } else if (mode === 'preview') {
    tabPreview && tabPreview.classList.add('active');
    if (iconSpan) iconSpan.innerHTML = ICONS.gridMixed;
  }

  localStorage.setItem('lucid-view-mode', mode);
  if (wasTrashPreview) { renderActiveNote(); renderTOC(); renderTags(); renderMetrics(); }
}

function initViewModeTabs() {
  const tabEditor = document.getElementById('tab-mode-editor');
  const tabSplit = document.getElementById('tab-mode-split');
  const tabPreview = document.getElementById('tab-mode-preview');

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
    const t = THEMES.find(x => x.id === themeId);
    hljsTheme.href = `vendor/hljs-styles/${(t && t.hljs) || 'github-dark'}.min.css`;
  }

}

// Three themes, one mechanism — mirrors the font-set picker exactly: a table,
// a footer button, a menu, localStorage, unknown values fall back to default.
// Listed light to dark, which is how the eye reads a brightness scale.
const THEMES = [
  { id: 'warm-linen', label: 'Warm Linen', icon: 'sun',    hljs: 'github' },
  { id: 'amber-hour', label: 'Amber Hour', icon: 'sunFog', hljs: 'github-dark' },
  { id: 'dusk-ember', label: 'Dusk Ember', icon: 'moon',   hljs: 'github-dark' }
];
const DEFAULT_THEME = 'dusk-ember';

function initThemePicker() {
  const btn = document.getElementById('btn-theme');
  if (!btn) return;
  const saved = localStorage.getItem('lucid-theme');
  applyTheme(THEMES.some(t => t.id === saved) ? saved : DEFAULT_THEME);
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const current = localStorage.getItem('lucid-theme') || DEFAULT_THEME;
    const rect = btn.getBoundingClientRect();
    const items = THEMES.map(t => ({
      label: t.label,
      active: t.id === current,
      icon: ICONS[t.icon],
      action: () => applyTheme(t.id)
    }));
    showTreeContextMenu(rect.left, rect.top, items);
  });
}

// ─── FONT SET PICKER ───────────────────────────────
// Four locally-vendored sets; the choice is a UI preference exactly like the
// theme: stored in localStorage, applied by swapping the two font tokens via
// data-fontset. Browsers download only the active set's files, so the three
// unchosen sets cost nothing at runtime.
const FONT_SETS = [
  { id: 'geist',  label: 'Geist + Geist Mono' },
  { id: 'plex',   label: 'IBM Plex Sans + IBM Plex Mono' },
  { id: 'source', label: 'Source Sans 3 + Source Code Pro' },
  { id: 'inter',  label: 'Inter + JetBrains Mono' },
];
const DEFAULT_FONT_SET = 'geist';

function applyFontSet(id) {
  if (!FONT_SETS.some(s => s.id === id)) id = DEFAULT_FONT_SET;
  document.documentElement.setAttribute('data-fontset', id);
  document.body.setAttribute('data-fontset', id);
  localStorage.setItem('lucid-fontset', id);
}

function initFontPicker() {
  applyFontSet(localStorage.getItem('lucid-fontset') || DEFAULT_FONT_SET);
  const btn = document.getElementById('btn-fontset');
  if (!btn) return;
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const current = localStorage.getItem('lucid-fontset') || DEFAULT_FONT_SET;
    const rect = btn.getBoundingClientRect();
    const items = FONT_SETS.map(s => ({
      label: s.label,
      active: s.id === current,
      icon: s.id === current ? ICONS.text : '<span class="menu-icon-blank"></span>',
      action: () => applyFontSet(s.id)
    }));
    showTreeContextMenu(rect.left, rect.top, items);
  });
}

// ─── EXPLORER MODE PILL TOGGLE (Folders / Tags / Pinned) ─
function initExplorerModeToggle() {
  const pinBtn = document.getElementById('btn-mode-pinned');
  if (pinBtn) pinBtn.innerHTML = ICONS[PIN_GLYPH];

  Object.entries(EXPLORER_MODES).forEach(([name, m]) => {
    const btn = document.getElementById(m.btn);
    if (btn) btn.addEventListener('click', () => { state.explorerMode = name; renderExplorer(); });
  });

  renderExplorer();
}
// ─── REPOSITORY / UPDATE INDICATOR ─────────────────
// Two requests, once per page load, held in memory. Nothing polls and nothing
// refetches on render: unauthenticated api.github.com allows 60 requests per
// hour per IP, and a tooltip is not worth spending that on repeatedly.
//
// The release channel is authoritative for "is there something newer": a
// GitHub Release exists only after a version was actually cut and published,
// whereas a git tag exists the moment it is pushed, before the image that
// carries it has finished building. Commit distance comes from /compare, which
// accepts tag and branch names directly, so the version string the build
// already reports about itself is the only identifier needed.
const GH_REPO = 'Arelius-D/LucID';
const GH_API = `https://api.github.com/repos/${GH_REPO}`;

async function ghJson(url) {
  const res = await fetch(url);
  if (!res.ok) { const e = new Error(`GitHub API ${res.status}`); e.status = res.status; throw e; }
  return res.json();
}

async function checkVersionAndUpdateIndicator() {
  const githubLink = document.querySelector('.footer-github-link');
  if (!githubLink) return;

  let currentVersion = '2.6.0-dev';
  try {
    const res = await fetch(apiPath('api/version'));
    if (res.ok) {
      const data = await res.json();
      if (data.version) currentVersion = data.version;
    }
  } catch (e) {
    console.warn('Could not fetch local version:', e);
  }

  // The channel comes from the version string, which is the build's own claim
  // about itself. It was previously guessed from hostname and port, so any dev
  // image reached through a reverse proxy reported itself as "production".
  const channel = describeChannel(currentVersion);
  const isPreRelease = channel !== 'release';
  const branch = isPreRelease ? 'dev' : 'main';
  const base = `LucID v${currentVersion} (${channel})`;

  const setLabel = (msg) => {
    githubLink.setAttribute('title', msg);
    githubLink.setAttribute('aria-label', msg);
  };
  // Neutral until the remote answers. Claiming currency before asking is an
  // assertion the app has no basis for, and it used to survive every failure.
  setLabel(`${base} \u2014 checking for updates`);

  // Request 1: the latest published release.
  let release = null;
  try {
    release = await ghJson(`${GH_API}/releases/latest`);
  } catch (err) {
    // 404 means no Release has been published, which is a fact worth stating.
    // Anything else is a failed check and must not be reported as either.
    console.warn('Release lookup failed:', err);
    setLabel(err.status === 404
      ? `${base} \u2014 no releases published yet`
      : `${base} \u2014 update check unavailable`);
    return;
  }

  const latest = String(release.tag_name || '').replace(/^v/, '');
  if (!latest) { setLabel(`${base} \u2014 update check unavailable`); return; }

  const published = release.published_at
    ? new Date(release.published_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  // Request 2: how far the tracked branch has moved past that release. /compare
  // takes refs by name, so no build metadata has to be injected to ask this.
  let ahead = null;
  try {
    const cmp = await ghJson(`${GH_API}/compare/v${latest}...${branch}`);
    if (typeof cmp.ahead_by === 'number') ahead = cmp.ahead_by;
  } catch (err) {
    console.warn('Compare lookup failed:', err);   // optional detail, not fatal
  }
  const trail = ahead ? ` \u00b7 ${branch} +${ahead} commit${ahead === 1 ? '' : 's'} since v${latest}` : '';

  if (compareVersions(latest, currentVersion) > 0) {
    githubLink.classList.add('update-available');
    githubLink.href = release.html_url || `https://github.com/${GH_REPO}/releases/tag/v${latest}`;
    setLabel(`${base} \u2014 update available: v${latest}${published ? ' (' + published + ')' : ''}`);
    return;
  }

  githubLink.classList.remove('update-available');
  githubLink.href = `https://github.com/${GH_REPO}`;
  setLabel(isPreRelease
    ? `${base} \u2014 latest release v${latest}${published ? ' (' + published + ')' : ''}${trail}`
    : `${base} \u2014 up to date${trail}`);
}

const CHANNEL_LABELS = { dev: 'dev build', rc: 'release candidate', beta: 'beta', alpha: 'alpha' };

function describeChannel(version) {
  const suffix = (String(version).split('-')[1] || '').toLowerCase().replace(/[^a-z]/g, '');
  if (!suffix) return 'release';
  return CHANNEL_LABELS[suffix] || 'pre-release';
}

// Numeric core first. When cores are equal, a build carrying a pre-release
// suffix (2.0.0-dev) ranks BELOW the plain release (2.0.0), per semver. The
// previous implementation mapped "0-dev" to NaN and silently returned "equal".
function compareVersions(v1, v2) {
  const parse = (v) => {
    const [core, pre = ''] = String(v).split('-', 2);
    const nums = core.split('.').map(n => parseInt(n, 10) || 0);
    return { nums, pre };
  };
  const a = parse(v1);
  const b = parse(v2);
  for (let i = 0; i < Math.max(a.nums.length, b.nums.length); i++) {
    const n1 = a.nums[i] || 0;
    const n2 = b.nums[i] || 0;
    if (n1 > n2) return 1;
    if (n1 < n2) return -1;
  }
  if (!a.pre && b.pre) return 1;
  if (a.pre && !b.pre) return -1;
  return 0;
}

// ─── FAILURE VISIBILITY & EXIT SAFETY (J-01 / J-06) ─
// Async failures previously surfaced only in the console: the user saw a frozen
// or half-rendered UI with no signal. Now anything unhandled is shown.
function reportFatal(what, err) {
  console.error(what, err);
  showSave(what + ': ' + ((err && err.message) || err || 'unknown error'), 'error');
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
  });
  // Task lists: marked emits <input type="checkbox">, which the sanitizer forbids
  // (S-04), so the boxes were silently stripped and task lists rendered as plain
  // bullets. Rendering them as a themed span keeps the feature without letting
  // form controls into rendered markdown — no sanitizer relaxation.
  marked.use({
    renderer: {
      checkbox({ checked }) {
        return `<span class="task-check${checked ? ' on' : ''}" role="img" aria-label="${checked ? 'done' : 'to do'}"></span>`;
      }
    }
  });

  document.getElementById('app').classList.add('hidden');

  await fetchStore();
  initSidebarResizers();
  initSplitHandle();
  initViewModeTabs();
  initTreeKeyboard();
  initThemePicker();
  initFontPicker();
  initExplorerModeToggle();
  checkVersionAndUpdateIndicator();
  updateRuntimeIndicator();
  setInterval(updateRuntimeIndicator, 60000);

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

  // ── Trash row: click toggles the panel above it; right-click offers Empty ──
  const trashBtn = document.getElementById('btn-mode-trash');
  const trashPanel = document.getElementById('trash-panel');
  if (trashBtn && trashPanel) {
    // The lid opens whenever the can is "in use": panel open, or a live note
    // hovering over the row mid-drag. Same closed/open glyph convention as
    // folders; the open glyph is lin-trash-open, derived from lin-trash.
    const trashIcon = document.getElementById('trash-row-icon');
    const syncTrashIcon = () => {
      const open = !trashPanel.hasAttribute('hidden') || trashBtn.classList.contains('drop-target');
      if (trashIcon) trashIcon.innerHTML = open ? ICONS.trashOpen : ICONS.trash;
    };
    trashBtn.addEventListener('click', () => {
      const opening = trashPanel.hasAttribute('hidden');
      if (opening) trashPanel.removeAttribute('hidden');
      else trashPanel.setAttribute('hidden', '');
      trashBtn.classList.toggle('open', opening);
      trashBtn.setAttribute('aria-expanded', String(opening));
      if (opening) renderTrashPanel();
      // Closing the panel while previewing a trashed note ends the preview; the
      // user's persisted view mode re-applies via renderActiveNote.
      if (!opening && state.trashPreviewId) { state.trashPreviewId = null; renderAll(); }
      syncTrashIcon();
    });
    trashBtn.addEventListener('contextmenu', e => {
      e.preventDefault();
      const n = state.folders.filter(f => f.trashed).length + state.notes.filter(x => x.trashed).length;
      if (!n) return;
      showTreeContextMenu(e.clientX, e.clientY, [
        { label: 'Empty Trash', icon: ICONS.trash, danger: true, action: () => emptyTrash() }
      ]);
    });
    // Drag a LIVE note onto the row to delete it — the counterpart of dragging
    // a trashed note onto a folder to restore it. Row fills with --bg-drop and
    // the lid opens while the note hovers, mirroring the folder drop convention.
    trashBtn.addEventListener('dragover', e => {
      if (!state.dragNoteId) return;
      const dragged = state.notes.find(n => n.id === state.dragNoteId);
      if (!dragged || dragged.trashed) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      trashBtn.classList.add('drop-target');
      syncTrashIcon();
    });
    trashBtn.addEventListener('dragleave', () => {
      trashBtn.classList.remove('drop-target');
      syncTrashIcon();
    });
    trashBtn.addEventListener('drop', async e => {
      e.preventDefault();
      const noteId = state.dragNoteId;
      clearDragState();
      trashBtn.classList.remove('drop-target');
      syncTrashIcon();
      const note = state.notes.find(n => n.id === noteId);
      if (!note || note.trashed) return;
      await trashNote(note);
      syncTrashIcon();
    });
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

    // Clicking outside the search box closes it. Previously only the X, the toggle
    // button and Escape did, so clicking away left the toolbar hidden behind a
    // search field the user had already finished with.
    document.addEventListener('click', e => {
      if (!headerRow.classList.contains('searching')) return;
      if (headerRow.contains(e.target)) return;
      closeSearch();
    });

    searchInput.addEventListener('blur', () => {
      if (!searchInput.value.trim()) headerRow.classList.remove('searching');
    });

    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeSearch();
    });

    searchInput.addEventListener('input', e => {
      state.searchQuery = e.target.value;
      renderExplorer();
    });
  }

  // Interactive Tag Add Button
  // Print: always the rendered note, never the editor. The @media print block does
  // the work, so this is one call and no state — and the browser's own dialog
  // supplies Save-as-PDF for free.
  const btnPrint = document.getElementById('btn-print');
  if (btnPrint) btnPrint.addEventListener('click', () => window.print());

  // Focus mode: real fullscreen via the Fullscreen API, with both side panes out
  // of the way. The class and the button state follow the fullscreenchange EVENT,
  // not the click, because Escape and the browser's own exit are outside our
  // control and would otherwise leave the UI lying about where it is.
  const btnFocus = document.getElementById('btn-focus');
  if (btnFocus) {
    btnFocus.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await document.documentElement.requestFullscreen();
      } catch (err) {
        console.warn('Fullscreen refused:', err);
        showSave('Focus mode unavailable in this browser', 'error');
      }
    });
    document.addEventListener('fullscreenchange', () => {
      const on = !!document.fullscreenElement;
      document.body.classList.toggle('focus-mode', on);
      btnFocus.classList.toggle('active', on);
      btnFocus.setAttribute('aria-pressed', String(on));
      btnFocus.title = on ? 'Leave focus mode' : 'Focus mode (fullscreen)';
      btnFocus.setAttribute('aria-label', btnFocus.title);
    });
  }

  const btnAddTag = document.getElementById('btn-add-tag');
  if (btnAddTag) {
    btnAddTag.addEventListener('click', e => {
      // stopPropagation matters: without it this click reaches the document
      // handler that closes menus, and the picker would open and vanish in the
      // same tick (same reason the theme/font/auto-lock buttons stop it).
      e.stopPropagation();
      if (state.trashPreviewId) return;   // trash preview is read-only, tags included
      const note = state.notes.find(n => n.id === state.activeNoteId);
      if (!note) return;
      const rect = btnAddTag.getBoundingClientRect();
      openTagMenu(note, rect.left, rect.bottom);
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
  document.getElementById('btn-new-note').addEventListener('click', () => {
    // Always creates: with no live folder, one is made. The old version picked
    // state.activeFolderId unchecked, so a note could land in a trashed folder
    // and never appear in the tree, and with no folders it silently did nothing.
    createNoteInFolder(ensureLiveFolderId());
  });

  // New folder button
  document.getElementById('btn-new-folder').addEventListener('click', async () => {
    const name = await showPromptModal('New Folder', 'Enter a name for the new folder:', '', { placeholder: 'Folder name' });
    if (!name || !name.trim()) return;
    const folder = { id: newId('f'), name: name.trim(), parentId: null };
    state.folders.push(folder);
    state.activeFolderId = folder.id;
    state.openFolderIds.add(folder.id);
    saveTreeState();
    await saveStore();
    renderAll();
    focusTreeItem('folder:' + folder.id);
  });

  // MANDATORY E2EE LOCK SCREEN & CRYPTOGRAPHIC PASSPHRASE VALIDATION
  const lockScreen = document.getElementById('lock-screen');
  const lockInput = document.getElementById('lock-passphrase');
  const lockConfirmInput = document.getElementById('lock-passphrase-confirm');
  const lockBtn = document.getElementById('lock-unlock-btn');
  const lockError = document.getElementById('lock-error');

  updateLockScreenUI();


  async function unlockVault() {
    // J-10: in unreachable mode the button reads Retry — attempt the fetch again.
    if (!state.storeLoaded) {
      lockBtn.textContent = 'Retrying…';
      lockBtn.disabled = true;
      await fetchStore();
      updateLockScreenUI();
      return;
    }
    const pass = lockInput ? lockInput.value : '';

    lockBtn.textContent = !state.authVerifier ? 'Creating Vault…' : 'Verifying Passphrase…';
    lockBtn.disabled = true;
    lockError.classList.add('hidden');

    try {
      // First-time setup mints fresh per-vault KDF params (random salt).
      const isSetup = !state.authVerifier;
      if (isSetup && !state.kdf) state.kdf = newKdfParams();
      const derived = await deriveKey(pass, state.kdf);

      if (state.authVerifier) {
        // STRICT PASSPHRASE VERIFICATION: must decrypt the sentinel exactly.
        const check = await tryDecryptText(state.authVerifier, derived);
        if (check !== AUTH_MAGIC_SENTINEL) {
          // Shake the field and keep the words for assistive tech only: the
          // visible line would cost a row of height on every failure.
          lockError.textContent = 'Wrong passphrase';
          lockError.classList.remove('hidden');
          lockError.classList.add('visually-hidden');
          if (lockInput) {
            // Clear the field, then say refused twice over in one gesture: the
            // edge turns danger and the box shakes, together, for one beat.
            lockInput.value = '';
            lockInput.classList.remove('shake', 'is-mismatch', 'is-matched', 'is-refused');
            // Gate FIRST: it repaints the button for the now-empty field and it
            // also strips these classes, so adding them after it is the only
            // order that survives.
            refreshLockGate();
            void lockInput.offsetWidth;          // restart the animation
            lockInput.classList.add('shake', 'is-refused');
            // A timer, not animationend: with reduced motion there is no
            // animation to end, and a throttled background tab never fires it
            // either. Duration comes from the same token that drives the shake,
            // so the two can never drift apart.
            clearTimeout(refusalTimer);
            refusalTimer = setTimeout(() => {
              lockInput.classList.remove('shake', 'is-refused');
            }, refusalHoldMs());
            lockInput.focus();
          }
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
        state.tagLibrary = plain.tags;
        // J-12: refresh the title cache from the now-PLAINTEXT notes. fetchStore
        // primed it before unlock, when every title was still ciphertext, and
        // nothing re-primed it here — so the cache held ENC: strings for the whole
        // session and each renderer quietly fell back to note.title to cover it.
        // The session-restore path already did this; the passphrase path did not.
        await preloadDecryptedTitles();
      }
      await settleVaultOnEntry();

      await persistSessionKey(derived);   // stores the non-extractable key, not the passphrase
      lockScreen.classList.add('hidden');
      document.getElementById('app').classList.remove('hidden');
      updateVaultShield();
      renderAll();
    } catch (err) {
      if (err && err.message === 'SECURE_CONTEXT_REQUIRED') {
        lockError.textContent = 'Web Crypto E2EE requires HTTPS or localhost. Plain HTTP to an IP address blocks browser encryption.';
      } else {
        lockError.textContent = 'Authentication error. Access denied.';
      }
      lockError.classList.remove('hidden');
      lockBtn.textContent = !state.authVerifier ? 'Next' : 'Unlock';
      lockBtn.disabled = !state.authVerifier;
    }
  }

  if (lockInput) {
    lockInput.addEventListener('input', refreshLockGate);
    lockInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !lockBtn.disabled) unlockVault(); });
  }

  if (lockConfirmInput) {
    lockConfirmInput.addEventListener('input', refreshLockGate);
    lockConfirmInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !lockBtn.disabled) unlockVault(); });
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

  // Caps Lock heads-up. Listened for on the DOCUMENT, not just the field: the
  // key is usually pressed before anyone clicks into the box, and a field-only
  // listener showed nothing until the first character was typed. Mouse events
  // carry the modifier state too, so clicking in with Caps already on reports it
  // immediately. Only KeyboardEvent and MouseEvent expose getModifierState, which
  // is why focus events cannot be used for this.
  const lockCaps = document.getElementById('lock-capslock');
  function capsCheck(e) {
    if (!lockCaps || !e.getModifierState) return;
    if (lockScreen && lockScreen.classList.contains('hidden')) return;
    lockCaps.classList.toggle('hidden', !e.getModifierState('CapsLock'));
  }
  document.addEventListener('keydown', capsCheck);
  document.addEventListener('keyup', capsCheck);
  document.addEventListener('mousedown', capsCheck);
  [lockInput, lockConfirmInput].forEach(el => {
    if (!el) return;
    el.addEventListener('keydown', capsCheck);
    el.addEventListener('keyup', capsCheck);
  });

  // ── Vault lock: shared routine for the manual button AND idle auto-lock ──
  async function lockVault() {
    await flushPendingSave();   // J-02's last gap: a lock inside the debounce window must not drop the edit
    clearSessionKey();          // wipes the stored CryptoKey + session token
    state.encryptionKey = null;
    document.getElementById('app').classList.add('hidden');
    lockScreen.classList.remove('hidden');
    lockInput.value = '';
    if (lockError) { lockError.classList.add('hidden'); lockError.classList.remove('visually-hidden'); }
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
  const markActivity = () => { idleLastActivity = Date.now(); };
  ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'].forEach(evt =>
    document.addEventListener(evt, markActivity, { passive: true }));
  setInterval(() => {
    if (!state.encryptionKey) return;                          // only while unlocked
    if (Date.now() - idleLastActivity >= getAutolockMs()) { lockVault(); return; }
    updateVaultShield();     // the warning mark has to be able to appear on its own
  }, 15000);

  // ── Auto-lock timeout picker (footer) ──
  const AUTOLOCK_OPTIONS = [
    { min: 0,  label: 'Off (60 minutes)' },
    { min: 5,  label: '5 minutes' },
    { min: 15, label: '15 minutes' },
    { min: 30, label: '30 minutes' },
  ];
  const btnAutolock = document.getElementById('btn-autolock');
  function autolockLabel() {
    const soft = autolockSoftMin();
    if (soft <= 0) return `Auto-lock: Off (${AUTOLOCK_HARD_CEILING_MIN} minutes)`;
    return soft < 1 ? `Auto-lock: ${Math.round(soft * 60)} seconds` : `Auto-lock: ${soft} min`;
  }
  if (btnAutolock) {
    const syncAutolockLabel = () => {
      btnAutolock.title = autolockLabel();
      btnAutolock.setAttribute('aria-label', autolockLabel());
    };
    syncAutolockLabel();
    btnAutolock.addEventListener('click', e => {
      e.stopPropagation();
      const current = autolockSoftMin();
      const rect = btnAutolock.getBoundingClientRect();
      const items = AUTOLOCK_OPTIONS.map(o => ({
        label: o.label,
        // Same marking rule as the theme and font menus: colour says which one is
        // current. These entries are durations and have no glyph of their own.
        active: o.min === current,
        icon: o.min === current ? ICONS.watchStatus : '<span class="menu-icon-blank"></span>',
        action: () => {
          localStorage.setItem('lucid-autolock-min', String(o.min));
          idleLastActivity = Date.now();
          syncAutolockLabel();
          updateVaultShield();
        }
      }));
      showTreeContextMenu(rect.left, rect.top, items);
    });
  }

  // INC-43b: the status badges earn their hover — sync now / recheck health.
  const syncBadge = document.getElementById('save-indicator');
  if (syncBadge) {
    const syncNow = () => { flushPendingSave(); saveStore(); };
    syncBadge.addEventListener('click', syncNow);
    syncBadge.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); syncNow(); }
    });
  }
  const runtimeBadge = document.getElementById('runtime-indicator');
  if (runtimeBadge) {
    runtimeBadge.addEventListener('click', updateRuntimeIndicator);
    runtimeBadge.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateRuntimeIndicator(); }
    });
  }

  const restored = await restoreKeyFromSession();
  if (restored) {
    await preloadDecryptedTitles();
    await settleVaultOnEntry();
    lockScreen.classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    updateVaultShield();
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
