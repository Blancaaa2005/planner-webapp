/* ============================================================================
   interactive.jsx — appended AFTER the bundle's jsx in the build entry.
   Runs in the same scope (window.* globals already set by brand/masters).
   Responsibilities:
     · inject the "__live__" sentinel theme (token strings -> CSS vars later)
     · override the shared primitives (Page/TopNav/SideTabs/CB) to emit real
       anchors + real checkboxes (edit categories a, b, c)
     · define PAGES (navigation order) and renderBody()
   The page-content edits (blank fields, ledger, etc.) live in src/*.jsx.
   ========================================================================== */
const h = React.createElement;
const LP = window.LP;
const T = '__live__';                       // sentinel theme id for every page
const DEFAULT_NAME = globalThis.__DEFAULT_NAME__ || 'Greige';

/* ---- sentinel theme: tones become tokens that post-processing -> CSS vars - */
LP.THEMES.__live__ = {
  key:'__live__', tint:'Z9TINT', mid:'Z9MID', deep:'Z9DEEP', ink:'Z9TINK',
  name:'Z9TNAME', pantone:'Z9PANT',
};

const C = LP.C, FONT = LP.FONT;

/* ---- nav destinations ------------------------------------------------------ */
const TOPNAV_HREF = {
  'Índice':'#hub', 'Año':'#yearly', 'Mes':'#month-01',
  'Semana':'#week-01', 'Día':'#day', 'Notas':'#notes',
};
const SIDETAB_HREF = {
  'Estilo':'#hub', 'Bienestar':'#habits', 'Autocuidado':'#wellness',
  'Finanzas':'#finance', 'Productividad':'#productivity',
};

/* ---- Page override: adds id anchor; reuses overridden TopNav/SideTabs ------ */
LP.Page = function(props){
  const { theme:th, tab, currentNav, padding=34, children, contentStyle } = props;
  return h('div', { id: globalThis.__PAGE_ID__, className:'lp-page lp-grain', style:{
      position:'relative', width:1080, height:810, background:C.cream,
      fontFamily:FONT.sans, color:C.ink, overflow:'hidden',
    } },
    h(LP.TopNav, { theme:th, current:currentNav }),
    h(LP.SideTabs, { theme:th, active:tab }),
    h('div', { style:{
        position:'absolute', top:56, left:0, right:38, bottom:0, padding,
        zIndex:1, ...(contentStyle||{})
      } }, children));
};

/* ---- TopNav override: brand + nav entries are real <a href> --------------- */
LP.TopNav = function(props){
  const { current } = props;
  return h('div', { style:{
      position:'absolute', top:0, left:0, right:0, height:56, zIndex:3,
      display:'flex', alignItems:'center', gap:18, padding:'0 30px',
      borderBottom:`1px solid ${C.line}`, background:C.paper,
    } },
    h('a', { href:'#hub', className:'lp-link', style:{ display:'flex', alignItems:'baseline', gap:7, textDecoration:'none' } },
      h('span', { style:{ width:7, height:7, borderRadius:'50%', background:'Z9DEEP', alignSelf:'center' } }),
      h('span', { style:{ fontFamily:FONT.serif, fontStyle:'italic', fontWeight:500, fontSize:21, color:C.ink, letterSpacing:.2 } }, 'Linen Paper Co.')),
    h('div', { style:{ display:'flex', alignItems:'center', gap:5, marginLeft:6 } },
      LP.NAV.map(n=>{
        const on = current===n;
        return h('a', { key:n, href:TOPNAV_HREF[n]||'#hub', className:'lp-link', style:{
          textDecoration:'none', fontFamily:FONT.sans, fontSize:11.5, fontWeight: on?600:500,
          color: on? 'Z9TINK' : C.ink3, padding:'5px 11px', borderRadius:999,
          background: on? 'Z9TINT' : 'transparent', border:`1px solid ${on?'Z9MID':'transparent'}`,
        } }, n);
      })),
    h('div', { style:{ marginLeft:'auto', display:'flex', alignItems:'center', gap:9, fontFamily:FONT.mono, fontSize:9.5, letterSpacing:1, color:C.ink3 } },
      h('span', null, 'Sin fechar'),
      h('span', { style:{ color:C.line } }, '·'),
      h('span', { className:'js-theme-name', style:{ color:'Z9DEEP', fontWeight:500, textTransform:'uppercase' } }, DEFAULT_NAME),
      h('span', { style:{ width:11, height:11, borderRadius:'50%', background:'Z9MID', border:`1px solid Z9DEEP` } })));
};

/* ---- SideTabs override: each section tab is a real <a href> ---------------- */
LP.SideTabs = function(props){
  const { active, side='right' } = props;
  return h('div', { style:{
      position:'absolute', top:0, bottom:0, [side]:0, width:38,
      display:'flex', flexDirection:'column', borderLeft:`1px solid ${C.line}`,
      background:C.paper, zIndex:3,
    } },
    LP.SECTIONS.map((s,i)=>{
      const on = active===s;
      return h('a', { key:s, href:SIDETAB_HREF[s]||'#hub', className:'lp-link', style:{
          textDecoration:'none', flex:1, minHeight:0, display:'flex', alignItems:'center', justifyContent:'center',
          borderBottom: i<LP.SECTIONS.length-1 ? `1px solid ${C.lineSoft}` : 'none',
          background: on? 'Z9DEEP' : 'transparent',
        } },
        h('span', { style:{
          writingMode:'vertical-rl', transform:'rotate(180deg)',
          fontFamily:FONT.mono, fontSize:8.5, letterSpacing:1.2, textTransform:'uppercase',
          fontWeight: on?600:500, color: on? C.paper : C.ink3, whiteSpace:'nowrap',
        } }, s));
    }));
};

/* ---- CB override: real checkbox + CSS-driven visual + auto name ------------ */
LP.CB = function(props){
  const { size=14, name } = props;          // `on` ignored: planner ships blank
  const n = name || ('cb-' + (globalThis.__CB_I__++));
  return h('label', { className:'lp-cbwrap', style:{ display:'inline-flex', flex:'none', cursor:'pointer' } },
    h('input', { type:'checkbox', className:'lp-toggle', name:n,
      style:{ position:'absolute', opacity:0, width:0, height:0, pointerEvents:'none' } }),
    h('span', { className:'lp-tg', style:{ width:size, height:size } },
      h('svg', { width:size-4, height:size-4, viewBox:'0 0 10 10', fill:'none',
        strokeWidth:1.6, strokeLinecap:'round', strokeLinejoin:'round', className:'lp-tg-chk' },
        h('path', { d:'M1.5 5.2 L4 7.6 L8.6 2.4' }))));
};

/* ---- blank interactive helpers used by the masters ------------------------ */
window.LPI = {
  // plain text field   (key:name -> unique, silences list-key warnings)
  field(name, extra){ return h('input', { key:name, type:'text', className:'lp-field', name, style:extra||null }); },
  // text field rendered as a writable underline
  line(name, extra){ return h('input', { key:name, type:'text', className:'lp-field lp-line', name, style:extra||null }); },
  // multiline area (fills its container)
  area(name, extra){ return h('textarea', { key:name, className:'lp-area', name, style:extra||null }); },
  // number field (drives a derived value)
  number(name, extra){ return h('input', { key:name, type:'text', inputMode:'numeric', className:'lp-field lp-num', name, style:extra||null }); },
  // water-drop toggle (custom checkbox)
  drop(name, size){
    return h('label', { key:name, className:'lp-drop', style:{ display:'inline-flex', cursor:'pointer', flex:'none' } },
      h('input', { type:'checkbox', className:'lp-toggle', name, style:{ position:'absolute', opacity:0, width:0, height:0 } }),
      h('svg', { className:'lp-drop-svg', width:size||21, height:size||21, viewBox:'0 0 16 16', strokeWidth:1.3, strokeLinecap:'round', strokeLinejoin:'round' },
        h('path', { d:'M8 2 C8 2 12.6 7.4 12.6 10.4 A4.6 4.6 0 1 1 3.4 10.4 C3.4 7.4 8 2 8 2 Z' })));
  },
  // square grid toggle (habit tracker cells)
  sq(name, size){
    return h('label', { key:name, className:'lp-sqwrap', style:{ display:'inline-flex', cursor:'pointer', flex:'none' } },
      h('input', { type:'checkbox', className:'lp-toggle', name, style:{ position:'absolute', opacity:0, width:0, height:0 } }),
      h('span', { className:'lp-sq', style:{ width:size||11, height:size||11 } }));
  },
};

/* ========================================================================== */
/*  PAGES — navigation order. Expanded in build-planner via globalThis.__PAGES */
/* ========================================================================== */
function buildPages(){
  const pages = [];
  pages.push({ id:'cover',  el:()=>h(window.Cover,    { theme:T }) });
  pages.push({ id:'hub',    el:()=>h(window.IndexHub, { theme:T }) });
  pages.push({ id:'yearly', el:()=>h(window.Yearly,   { theme:T }) });
  // 12 months by name
  LP.MONTHS.forEach((m,i)=>{
    const id = 'month-' + String(i+1).padStart(2,'0');
    pages.push({ id, el:()=>h(window.MonthlySpread, { theme:T, monthName:m, monthIndex:i }) });
  });
  // 52 weeks (monday start)
  for (let w=1; w<=52; w++){
    const id = 'week-' + String(w).padStart(2,'0');
    pages.push({ id, el:()=>h(window.WeeklySpread, { theme:T, weekStart:1, weekNo:w }) });
  }
  pages.push({ id:'day',          el:()=>h(window.Daily,        { theme:T }) });
  pages.push({ id:'habits',       el:()=>h(window.HabitTracker, { theme:T }) });
  pages.push({ id:'finance',      el:()=>h(window.Finance,      { theme:T }) });
  pages.push({ id:'wellness',     el:()=>h(window.Wellness,     { theme:T }) });
  pages.push({ id:'productivity', el:()=>h(window.Productivity, { theme:T }) });
  pages.push({ id:'notes',        el:()=>h(window.Notes,        { theme:T }) });
  return pages;
}

function renderBody(){
  const pages = (globalThis.__PROTOTYPE__ ? buildPages().filter(p=>['cover','hub','month-01'].includes(p.id)) : buildPages());
  const out = [];
  for (const p of pages){
    globalThis.__PAGE_ID__ = p.id;
    globalThis.__CB_I__ = 0;
    out.push(renderToStaticMarkup(p.el()));
  }
  return { html: out.join('\n'), pageIds: pages.map(p=>p.id) };
}
