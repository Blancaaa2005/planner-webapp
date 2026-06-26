/* Downloads the bundle's Google Fonts (latin + latin-ext) and inlines every
   woff2 as a data: URI into assets/fonts/fonts-inline.css so the final build
   makes zero network calls. Cached: skips network if the file already exists. */
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'assets', 'fonts', 'fonts-inline.css');

// Exact families/weights the bundle requests (brand.jsx lp-fonts link).
const CSS_URL = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export async function buildFontsCss({ force = false } = {}) {
  if (!force && existsSync(OUT)) {
    return { cached: true, path: OUT };
  }
  mkdirSync(dirname(OUT), { recursive: true });
  const res = await fetch(CSS_URL, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error('Google Fonts CSS fetch failed: ' + res.status);
  let css = await res.text();

  // Keep only latin + latin-ext blocks (drop cyrillic/greek/vietnamese to save size).
  const blocks = css.split('@font-face').filter(Boolean);
  const kept = [];
  for (const raw of blocks) {
    const block = '@font-face' + raw.split('}')[0] + '}';
    const m = /\/\*\s*([a-z-]+)\s*\*\//i.exec(raw);
    const subset = m ? m[1] : 'latin';
    if (subset !== 'latin' && subset !== 'latin-ext') continue;
    kept.push(block);
  }

  // Download each woff2 url and inline as base64.
  const urls = [...css.matchAll(/url\((https:\/\/[^)]+\.woff2)\)/g)].map(x => x[1]);
  const uniq = [...new Set(urls)];
  const map = new Map();
  for (const u of uniq) {
    const r = await fetch(u, { headers: { 'User-Agent': UA } });
    if (!r.ok) throw new Error('woff2 fetch failed: ' + u);
    const buf = Buffer.from(await r.arrayBuffer());
    map.set(u, `data:font/woff2;base64,${buf.toString('base64')}`);
  }

  let out = kept.join('\n');
  for (const [u, data] of map) out = out.split(u).join(data);
  writeFileSync(OUT, out, 'utf8');
  return { cached: false, path: OUT, fonts: uniq.length, bytes: out.length };
}

// Run directly: node build/fetch-fonts.mjs [--force]
if (import.meta.url === `file://${process.argv[1]}`) {
  buildFontsCss({ force: process.argv.includes('--force') })
    .then(r => console.log('fonts-inline.css:', r))
    .catch(e => { console.error(e); process.exit(1); });
}
