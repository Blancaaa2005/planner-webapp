/* ============================================================================
   build-planner.mjs — concatenates the bundle's jsx (host order) + the
   interactive appendix, renders every page to static HTML, rewrites the
   sentinel theme tokens to CSS vars, and emits a single self-contained
   out/<DOC_ID>.html (THEME_MODE = live).
   ========================================================================== */
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import * as esbuild from 'esbuild';
import { buildFontsCss } from './fetch-fonts.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'src');
const OUTDIR = join(ROOT, 'out');
const PROTO = process.argv.includes('--prototype');

const DOC_ID = 'Planner-Digital-Todo-en-Uno';
const DEFAULT_THEME = 'greige';
const PAGE_W = 1080, PAGE_H = 810;

/* ---- 1. fonts ------------------------------------------------------------ */
const fontsRes = await buildFontsCss();
const fontsCss = readFileSync(join(ROOT,'assets','fonts','fonts-inline.css'),'utf8');
console.log('· fonts:', fontsRes.cached ? 'cached' : 'downloaded');

/* ---- 2. assemble temp entry --------------------------------------------- */
const order = ['brand.jsx','covers.jsx','masters-core.jsx','masters-week.jsx','masters-extras.jsx'];
const prepend = `
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
globalThis.React = React;
globalThis.window = globalThis;
globalThis.document = undefined;
globalThis.__DEFAULT_NAME__ = 'Greige';
globalThis.__PROTOTYPE__ = ${PROTO ? 'true':'false'};
`;
let body = order.map(f => readFileSync(join(SRC,f),'utf8')).join('\n\n');
const appendix = readFileSync(join(__dirname,'interactive.jsx'),'utf8');
const entry = prepend + '\n' + body + '\n' + appendix + '\nexport { renderBody };\n';
const TMP_ENTRY = join(__dirname,'.tmp-entry.jsx');
const TMP_OUT = join(__dirname,'.tmp-bundle.mjs');
writeFileSync(TMP_ENTRY, entry, 'utf8');

/* ---- 3. esbuild ---------------------------------------------------------- */
await esbuild.build({
  entryPoints:[TMP_ENTRY], outfile:TMP_OUT, bundle:true, format:'esm',
  platform:'node', loader:{'.jsx':'jsx'}, logLevel:'warning',
  banner:{ js:"import { createRequire as __cr } from 'module';\nconst require = __cr(import.meta.url);" },
});

/* ---- 4. render ----------------------------------------------------------- */
const mod = await import(pathToFileURL(TMP_OUT).href + '?t=' + Date.now());
const { html: rawBody, pageIds } = mod.renderBody();
console.log('· rendered pages:', pageIds.length);

/* ---- 5. read THEMES from the bundle for css + runtime config ------------- */
// re-import LP themes by evaluating: they live on globalThis after import
const THEMES = globalThis.LP.THEMES;
const THEME_ORDER = globalThis.LP.THEME_ORDER;

/* ---- 6. token -> css var post-processing -------------------------------- */
const BASE = { DEEP:'deep', MID:'mid', TINT:'tint', TINK:'ink' };
let processed = rawBody.replace(/Z9(DEEP|MID|TINT|TINK)([0-9a-f]{2})?/g, (m, b, a) =>
  'var(--c-' + BASE[b] + (a ? '-' + a : '') + ')');
processed = processed.replace(/Z9TNAME/g, `<span class="js-theme-name">${THEMES[DEFAULT_THEME].name}</span>`);
processed = processed.replace(/Z9PANT/g, `<span class="js-theme-pantone">${THEMES[DEFAULT_THEME].pantone}</span>`);

/* collect alpha combos referenced (var(--c-deep-22) etc.) */
const alphaSet = new Set(['deep-22','deep-33','deep-44','mid-22','mid-66','mid-88']);
for(const m of processed.matchAll(/var\(--c-(deep|mid|tint|ink)-([0-9a-f]{2})\)/g)) alphaSet.add(m[1]+'-'+m[2]);

/* ---- 7. theme css blocks ------------------------------------------------- */
function hexA(hex, aa){ return hex + aa; } // #RRGGBB + AA -> #RRGGBBAA
function themeBlock(id){
  const t = THEMES[id];
  let v = `--c-tint:${t.tint};--c-mid:${t.mid};--c-deep:${t.deep};--c-ink:${t.ink};`;
  const tones = { deep:t.deep, mid:t.mid, tint:t.tint, ink:t.ink };
  for(const combo of alphaSet){ const [base,aa]=combo.split('-'); v += `--c-${base}-${aa}:${hexA(tones[base],aa)};`; }
  return `html[data-theme="${id}"]{${v}}`;
}
const themeCss = THEME_ORDER.map(themeBlock).join('\n');

/* ---- 8. runtime config --------------------------------------------------- */
const LABELS = {};
for(const id of pageIds){
  if(id==='cover') LABELS[id]='Portada';
  else if(id==='hub') LABELS[id]='Índice';
  else if(id==='yearly') LABELS[id]='Vista anual';
  else if(id==='day') LABELS[id]='Día';
  else if(id==='habits') LABELS[id]='Hábitos';
  else if(id==='finance') LABELS[id]='Finanzas';
  else if(id==='wellness') LABELS[id]='Bienestar';
  else if(id==='productivity') LABELS[id]='Productividad';
  else if(id==='notes') LABELS[id]='Notas';
  else if(/^month-(\d+)$/.test(id)) LABELS[id]=globalThis.LP.MONTHS[+RegExp.$1-1];
  else if(/^week-(\d+)$/.test(id)) LABELS[id]='Semana '+(+RegExp.$1)+' / 52';
  else LABELS[id]=id;
}
const themesCfg = {};
for(const id of THEME_ORDER) themesCfg[id] = { name:THEMES[id].name, pantone:THEMES[id].pantone, swatch:THEMES[id].mid };
const cfg = { pageW:PAGE_W, pageH:PAGE_H, docId:DOC_ID, pageIds, themes:themesCfg, themeOrder:THEME_ORDER, defaultTheme:DEFAULT_THEME, labels:LABELS };

/* ---- 9. assemble final html --------------------------------------------- */
const runtimeCss = readFileSync(join(__dirname,'runtime.css'),'utf8');
const runtimeJs = readFileSync(join(__dirname,'runtime.js'),'utf8');
const finalHtml = `<!DOCTYPE html>
<html lang="es" data-theme="${DEFAULT_THEME}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes">
<title>Planner Digital · Todo en Uno</title>
<style>
${fontsCss}
</style>
<style>
${themeCss}
</style>
<style>
${runtimeCss}
</style>
</head>
<body>
<div id="lp-toolbar"></div>
<div id="lp-fit"><div id="lp-stage-wrap"><div id="lp-stage">
${processed}
</div></div></div>
<script>window.__LP_CFG__ = ${JSON.stringify(cfg)};</script>
<script>
${runtimeJs}
</script>
</body>
</html>`;

mkdirSync(OUTDIR, { recursive:true });
const outName = (PROTO ? DOC_ID + '-proto' : DOC_ID) + '.html';
const outPath = join(OUTDIR, outName);
writeFileSync(outPath, finalHtml, 'utf8');

/* cleanup temp */
try{ rmSync(TMP_ENTRY); rmSync(TMP_OUT); }catch(e){}

const mb = (Buffer.byteLength(finalHtml)/1048576).toFixed(2);
console.log('· wrote', outPath, '(' + mb + ' MB)');
if(mb > 25) console.warn('!! exceeds 25 MB budget');
