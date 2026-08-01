#!/usr/bin/env node
/**
 * Copies the browser libraries from node_modules into public/vendor/.
 *
 * Why: these libraries are vendored (served from our own origin) so no third-party
 * CDN can inject code into the app. But vendored files are invisible to npm audit
 * and Dependabot, which is how they silently go stale. Keeping them as
 * devDependencies and syncing with this script gives us both: local serving AND
 * automated update/vulnerability tracking.
 *
 * Run: npm run vendor
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'public', 'vendor');
const STYLES = path.join(OUT, 'hljs-styles');
const COPY = [
  ['dompurify/dist/purify.min.js',                        'purify.min.js'],
  ['marked/lib/marked.umd.js',                            'marked.umd.js'],
  ['@highlightjs/cdn-assets/highlight.min.js',            'highlight.min.js'],
  ['@highlightjs/cdn-assets/styles/github-dark.min.css',  'hljs-styles/github-dark.min.css'],
  ['@highlightjs/cdn-assets/styles/github.min.css',       'hljs-styles/github.min.css'],
];

fs.mkdirSync(STYLES, { recursive: true });
let failed = false;
for (const [src, dest] of COPY) {
  const from = path.join(__dirname, '..', 'node_modules', src);
  const to = path.join(OUT, dest);
  if (!fs.existsSync(from)) {
    console.error(`MISSING ${src} — run "npm install" first.`);
    failed = true;
    continue;
  }
  fs.copyFileSync(from, to);
  const v = (() => {
    try { return require(path.join(__dirname, '..', 'node_modules', src.split('/').slice(0, src.startsWith('@') ? 2 : 1).join('/'), 'package.json')).version; }
    catch { return '?'; }
  })();
  console.log(`vendored ${dest.padEnd(34)} v${v}`);
}
process.exit(failed ? 1 : 0);
