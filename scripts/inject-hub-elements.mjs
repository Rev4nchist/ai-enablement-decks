#!/usr/bin/env node
/**
 * Inject Open Graph meta + "← All Decks" breadcrumb into every deck HTML.
 *
 * Source of truth is decks.json. Idempotent — running twice is a no-op.
 *
 *   node scripts/inject-hub-elements.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'decks.json'), 'utf8'));

const HUB_BASE = manifest.site.url.replace(/\/+$/, '/');
const SITE_NAME = manifest.site.siteName;

// Marker the injector uses to detect prior runs.
const MARKER_OG = '<!-- ae-hub:og -->';
const MARKER_NAV = '<!-- ae-hub:nav -->';

const BREADCRUMB = (depth) => {
  const up = '../'.repeat(depth);
  return [
    MARKER_NAV,
    '<style id="ae-hub-style">#ae-back-to-hub{position:fixed;bottom:16px;right:16px;z-index:9999;padding:.55rem 1rem;background:rgba(7,9,30,.85);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);color:#EEF2FF;font:500 12px/1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.05em;border:1px solid rgba(255,255,255,.15);border-radius:999px;text-decoration:none;opacity:.75;transition:opacity .2s,transform .2s}#ae-back-to-hub:hover{opacity:1;transform:translateY(-1px)}</style>',
    `<a href="${up}" id="ae-back-to-hub">← All Decks</a>`
  ].join('\n');
};

const ogBlock = (deck, hrefRel) => {
  const url = HUB_BASE + hrefRel.replace(/^\.\//, '');
  return [
    MARKER_OG,
    '<meta property="og:type" content="website">',
    `<meta property="og:site_name" content="${escapeAttr(SITE_NAME)}">`,
    `<meta property="og:title" content="${escapeAttr(deck.title)}">`,
    `<meta property="og:description" content="${escapeAttr(deck.description)}">`,
    `<meta property="og:url" content="${escapeAttr(url)}">`,
    '<meta name="twitter:card" content="summary">',
    `<meta name="twitter:title" content="${escapeAttr(deck.title)}">`,
    `<meta name="twitter:description" content="${escapeAttr(deck.description)}">`
  ].join('\n');
};

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function resolveTargetFile(href) {
  // Strip leading ./ and trailing slash.
  let p = href.replace(/^\.\//, '');
  if (p.endsWith('/')) p = p + 'index.html';
  return p;
}

function depthOf(href) {
  // Depth = number of directory segments before the file.
  const clean = href.replace(/^\.\//, '');
  const segs = clean.split('/').filter(Boolean);
  // file is the last segment if it has a dot; else last segment is a dir
  const fileSegs = clean.endsWith('/') ? segs.length : segs.length - 1;
  return Math.max(fileSegs, 1);
}

let touched = 0, skippedOg = 0, skippedNav = 0;

for (const deck of manifest.decks) {
  const rel = resolveTargetFile(deck.href);
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) {
    console.warn(`  ⚠ missing: ${rel}`);
    continue;
  }
  let html = fs.readFileSync(abs, 'utf8');
  let changed = false;

  if (!html.includes(MARKER_OG)) {
    const block = '  ' + ogBlock(deck, deck.href).split('\n').join('\n  ') + '\n';
    if (/<\/head>/i.test(html)) {
      html = html.replace(/<\/head>/i, block + '</head>');
      changed = true;
    } else {
      console.warn(`  ⚠ no </head> in ${rel}, skipping OG`);
    }
  } else { skippedOg++; }

  if (!html.includes(MARKER_NAV)) {
    const depth = depthOf(deck.href);
    const block = BREADCRUMB(depth) + '\n';
    if (/<body\b[^>]*>/i.test(html)) {
      html = html.replace(/(<body\b[^>]*>)/i, '$1\n' + block);
      changed = true;
    } else {
      console.warn(`  ⚠ no <body> in ${rel}, skipping breadcrumb`);
    }
  } else { skippedNav++; }

  if (changed) {
    fs.writeFileSync(abs, html);
    touched++;
    console.log(`  ✓ ${rel}`);
  }
}

console.log(`\nDone. ${touched} file(s) updated, ${skippedOg} already had OG, ${skippedNav} already had breadcrumb.`);
