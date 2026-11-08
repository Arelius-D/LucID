#!/usr/bin/env node
/**
 * Copies the browser libraries AND font files from node_modules into public/vendor/.
 *
 * Why: these assets are vendored (served from our own origin) so no third-party
 * CDN can inject code into the app or observe its users. But vendored files are
 * invisible to npm audit and Dependabot, which is how they silently go stale.
 * Keeping them as devDependencies and syncing with this script gives us both:
 * local serving AND automated update/vulnerability tracking.
 *
 * Fonts: four sets (Geist default, IBM Plex, Source, Inter + JetBrains), latin
 * subset, only the weights the UI uses (sans 400/500/600/700, mono 400/500).
 * Each family ships with its upstream LICENSE (OFL 1.1) as required.
 *
 * Run: npm run vendor
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'public', 'vendor');
const STYLES = path.join(OUT, 'hljs-styles');
const FONTS_OUT = path.join(OUT, 'fonts');

const COPY = [
  ['dompurify/dist/purify.min.js',                        'purify.min.js'],
  ['marked/lib/marked.umd.js',                            'marked.umd.js'],
  ['@highlightjs/cdn-assets/highlight.min.js',            'highlight.min.js'],
  ['@highlightjs/cdn-assets/styles/github-dark.min.css',  'hljs-styles/github-dark.min.css'],
  ['@highlightjs/cdn-assets/styles/github.min.css',       'hljs-styles/github.min.css'],
  ['turndown/dist/turndown.js',                           'turndown.js'],
  // Document converter (doc, docx, pptx, pdf, csv). An ES module that loads
  // the .wasm next to it, so both keep their package names in one folder.
  ['@firecrawl/anydoc-wasm/anydoc_wasm.js',               'anydoc/anydoc_wasm.js'],
  ['@firecrawl/anydoc-wasm/anydoc_wasm_bg.wasm',          'anydoc/anydoc_wasm_bg.wasm'],
  ['@firecrawl/anydoc-wasm/LICENSE',                      'anydoc/LICENSE'],
];

// Packages that publish only a CommonJS build, which a browser cannot load.
// The file is copied unchanged inside a wrapper that hands it an `exports`
// object and publishes that object as the named global. Regenerated from
// node_modules on every run, so package updates flow through like any other.
const WRAP = [
  ['@joplin/turndown-plugin-gfm/lib/turndown-plugin-gfm.cjs.js', 'turndown-plugin-gfm.js', 'turndownPluginGfm'],
];

// [package, weights] — file naming inside every @fontsource package is
// files/<slug>-latin-<weight>-normal.woff2 where <slug> is the unscoped name.
const FONTS = [
  ['@fontsource/geist',           [400, 500, 600, 700]],
  ['@fontsource/geist-mono',      [400, 500]],
  ['@fontsource/ibm-plex-sans',   [400, 500, 600, 700]],
  ['@fontsource/ibm-plex-mono',   [400, 500]],
  ['@fontsource/source-sans-3',   [400, 500, 600, 700]],
  ['@fontsource/source-code-pro', [400, 500]],
  ['@fontsource/inter',           [400, 500, 600, 700]],
  ['@fontsource/jetbrains-mono',  [400, 500]],
  ['@fontsource/inconsolata',     [400, 500, 600, 700]],
  ['@fontsource/cascadia-code',   [400, 500, 600, 700]],
  ['@fontsource/nunito',          [400, 500, 600, 700]],
  ['@fontsource/roboto-slab',     [400, 500, 600, 700]],
];

fs.mkdirSync(STYLES, { recursive: true });
let failed = false;

function pkgVersion(pkgDir) {
  try { return require(path.join(pkgDir, 'package.json')).version; }
  catch { return '?'; }
}

for (const [src, dest] of COPY) {
  const from = path.join(__dirname, '..', 'node_modules', src);
  const to = path.join(OUT, dest);
  if (!fs.existsSync(from)) {
    console.error(`MISSING ${src} — run "npm install" first.`);
    failed = true;
    continue;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  const owner = path.join(__dirname, '..', 'node_modules', src.split('/').slice(0, src.startsWith('@') ? 2 : 1).join('/'));
  console.log(`vendored ${dest.padEnd(34)} v${pkgVersion(owner)}`);
}

for (const [src, dest, globalName] of WRAP) {
  const from = path.join(__dirname, '..', 'node_modules', src);
  if (!fs.existsSync(from)) {
    console.error(`MISSING ${src} — run "npm install" first.`);
    failed = true;
    continue;
  }
  const owner = path.join(__dirname, '..', 'node_modules', src.split('/').slice(0, 2).join('/'));
  const header = `/* ${src} v${pkgVersion(owner)}, unchanged, wrapped by scripts/vendor.js: its exports become window.${globalName}. */\n`;
  fs.writeFileSync(
    path.join(OUT, dest),
    `${header}(function (exports) {\n${fs.readFileSync(from, 'utf8')}\n})(window.${globalName} = {});\n`,
  );
  const lic = path.join(owner, 'LICENSE');
  if (fs.existsSync(lic)) fs.copyFileSync(lic, path.join(OUT, dest.replace(/\.js$/, '.LICENSE')));
  console.log(`vendored ${dest.padEnd(34)} v${pkgVersion(owner)} (CommonJS, wrapped)`);
}

for (const [pkg, weights] of FONTS) {
  const slug = pkg.split('/')[1];
  const pkgDir = path.join(__dirname, '..', 'node_modules', pkg);
  const destDir = path.join(FONTS_OUT, slug);
  if (!fs.existsSync(pkgDir)) {
    console.error(`MISSING ${pkg} — run "npm install" first.`);
    failed = true;
    continue;
  }
  fs.mkdirSync(destDir, { recursive: true });
  for (const w of weights) {
    const file = `${slug}-latin-${w}-normal.woff2`;
    const from = path.join(pkgDir, 'files', file);
    if (!fs.existsSync(from)) {
      console.error(`MISSING ${pkg}/files/${file}`);
      failed = true;
      continue;
    }
    fs.copyFileSync(from, path.join(destDir, file));
  }
  const lic = path.join(pkgDir, 'LICENSE');
  if (fs.existsSync(lic)) fs.copyFileSync(lic, path.join(destDir, 'LICENSE'));
  console.log(`vendored fonts/${slug.padEnd(20)} v${pkgVersion(pkgDir)} (${weights.join('/')})`);
}

process.exit(failed ? 1 : 0);
