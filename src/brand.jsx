/* ============================================================================
   Linen Paper Co. — Sistema de marca (tokens + primitives)
   Todo se exporta a window.LP y a window.* al final.
   Los componentes leen sus colaboradores desde window.LP DENTRO de su cuerpo
   (lazy), por lo que el orden de carga de los .jsx es irrelevante.
   ========================================================================== */

(function(){
/* ---- Colores base (únicos en TODAS las páginas) ------------------------- */
const C = {
  cream:     '#F5EFE6',
  creamDeep: '#EDE4D2',
  paper:     '#FAF6EE',
  ink:       '#2B2622',
  ink2:      '#5A4F45',
  ink3:      '#8C8275',
  ink4:      '#B8AE9D',
  line:      '#D8CFC0',
  lineSoft:  '#E8DFD0',
};

/* ---- 6 paletas Pantone suaves ------------------------------------------ */
const THEMES = {
  greige:   { key:'greige',   tint:'#EFE6D2', mid:'#C9BBA0', deep:'#8A7B62', ink:'#5C4F3B', name:'Greige',   pantone:'15-1116 TPG' },
  sage:     { key:'sage',     tint:'#DCE4D2', mid:'#A8B895', deep:'#6E8059', ink:'#4D5C3D', name:'Salvia',   pantone:'15-6310 TPG' },
  lavender: { key:'lavender', tint:'#E1DAE6', mid:'#B6A8C4', deep:'#8473A0', ink:'#5C4E73', name:'Lavanda',  pantone:'16-3812 TPG' },
  sky:      { key:'sky',      tint:'#D8E1E7', mid:'#A7BACA', deep:'#6F8DA4', ink:'#4D6577', name:'Cielo',    pantone:'14-4214 TPG' },
  blush:    { key:'blush',    tint:'#ECD9D2', mid:'#D2A99A', deep:'#A87567', ink:'#76493D', name:'Rubor',    pantone:'14-1316 TPG' },
  clay:     { key:'clay',     tint:'#E5C9B3', mid:'#C99577', deep:'#9A6243', ink:'#6B4029', name:'Arcilla',  pantone:'16-1330 TPG' },
};
const THEME_ORDER = ['greige','sage','lavender','sky','blush','clay'];
function theme(t){ return (t && THEMES[t]) ? THEMES[t] : THEMES.greige; }

const FONT = {
  serif: "'Cormorant Garamond', Georgia, serif",
  sans:  "'Manrope', -apple-system, sans-serif",
  mono:  "'JetBrains Mono', ui-monospace, monospace",
};

/* ---- Inyección única de fuentes + CSS global --------------------------- */
(function injectOnce(){
  if (typeof document === 'undefined') return;
  if (document.getElementById('lp-fonts')) return;
  const l1 = document.createElement('link'); l1.rel='preconnect'; l1.href='https://fonts.googleapis.com';
  const l2 = document.createElement('link'); l2.rel='preconnect'; l2.href='https://fonts.gstatic.com'; l2.crossOrigin='anonymous';
  const l3 = document.createElement('link'); l3.id='lp-fonts'; l3.rel='stylesheet';
  l3.href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(l1); document.head.appendChild(l2); document.head.appendChild(l3);
  const s = document.createElement('style'); s.id='lp-global';
  s.textContent = `
    .lp-page *{ box-sizing:border-box; }
    .lp-grain::before{
      content:''; position:absolute; inset:0; pointer-events:none; opacity:.35; z-index:0;
      background:
        radial-gradient(circle at 18% 22%, rgba(120,105,80,.05), transparent 45%),
        radial-gradient(circle at 82% 78%, rgba(120,105,80,.05), transparent 45%),
        repeating-radial-gradient(circle at 50% 50%, rgba(0,0,0,.012) 0 1px, transparent 1px 2px);
      background-size:100% 100%,100% 100%,5px 5px;
    }
    .lp-link{ cursor:pointer; transition:opacity .15s, background .15s, color .15s; }
    .lp-link:hover{ opacity:.62; }
    .lp-cb{ display:inline-flex; align-items:center; justify-content:center; flex:none; }
  `;
  document.head.appendChild(s);
})();

/* ---- Icon set (16x16, stroke fino) ------------------------------------- */
const ICON_PATHS = {
  home:   'M2 7.5 L8 2.5 L14 7.5 M3.6 6.4 V13.5 H12.4 V6.4',
  grid:   'M2.5 2.5 H6.5 V6.5 H2.5 Z M9.5 2.5 H13.5 V6.5 H9.5 Z M2.5 9.5 H6.5 V13.5 H2.5 Z M9.5 9.5 H13.5 V13.5 H9.5 Z',
  cal:    'M2.5 3.5 H13.5 V13 H2.5 Z M2.5 6.2 H13.5 M5 2.2 V4.4 M11 2.2 V4.4',
  week:   'M2.5 3.5 H13.5 V12.5 H2.5 Z M6 3.5 V12.5 M10 3.5 V12.5',
  sun:    'M8 5.4 A2.6 2.6 0 1 0 8 10.6 A2.6 2.6 0 1 0 8 5.4 M8 1.6 V3 M8 13 V14.4 M1.6 8 H3 M13 8 H14.4 M3.6 3.6 L4.6 4.6 M11.4 11.4 L12.4 12.4 M12.4 3.6 L11.4 4.6 M4.6 11.4 L3.6 12.4',
  moon:   'M11.2 2.6 A6 6 0 1 0 11.2 13.4 A4.6 4.6 0 1 1 11.2 2.6 Z',
  drop:   'M8 2 C8 2 12.6 7.4 12.6 10.4 A4.6 4.6 0 1 1 3.4 10.4 C3.4 7.4 8 2 8 2 Z',
  heart:  'M8 13.4 C2.4 9 2.2 4.4 5.1 4.1 C6.8 3.9 7.8 5.6 8 6.1 C8.2 5.6 9.2 3.9 10.9 4.1 C13.8 4.4 13.6 9 8 13.4 Z',
  leaf:   'M3 13 C3 6 8 3 13 3 C13 10 8 13 3 13 Z M3 13 L13 3',
  coin:   'M8 2 A6 6 0 1 0 8 14 A6 6 0 1 0 8 2 M8 4.5 V11.5 M6.2 6 H9 A1.4 1.4 0 0 1 9 8.8 H6.2 H9.4',
  star:   'M8 2 L9.7 6 L14 6.4 L10.8 9.2 L11.8 13.5 L8 11.2 L4.2 13.5 L5.2 9.2 L2 6.4 L6.3 6 Z',
  target: 'M8 2 A6 6 0 1 0 8 14 A6 6 0 1 0 8 2 M8 5 A3 3 0 1 0 8 11 A3 3 0 1 0 8 5 M8 7.6 A.4 .4 0 1 0 8 8.4 A.4 .4 0 1 0 8 7.6',
  book:   'M8 4 C6.4 2.7 3.6 2.7 2.5 3.3 V12.6 C3.6 12 6.4 12 8 13.3 C9.6 12 12.4 12 13.5 12.6 V3.3 C12.4 2.7 9.6 2.7 8 4 Z M8 4 V13.3',
  edit:   'M3 13 L3 10.8 L10.6 3.2 L12.8 5.4 L5.2 13 Z M9.4 4.4 L11.6 6.6',
  pencil: 'M3 13 L3 10.8 L10.6 3.2 L12.8 5.4 L5.2 13 Z M9.4 4.4 L11.6 6.6',
  arrowR: 'M3 8 H13 M9 4 L13 8 L9 12',
  arrowL: 'M13 8 H3 M7 4 L3 8 L7 12',
  plus:   'M8 3 V13 M3 8 H13',
  sticker:'M3 3 H10 L13 6 V13 H3 Z M10 3 V6 H13',
  flag:   'M4 2 V14 M4 2.8 H12 L10 5.6 L12 8.4 H4',
  cloud:  'M4.6 11.4 A2.8 2.8 0 0 1 5 5.9 A4 4 0 0 1 12 6.6 A2.4 2.4 0 0 1 11.8 11.4 Z',
  note:   'M3 2.6 H10 L13 5.6 V13.4 H3 Z M10 2.6 V5.6 H13 M5 8.4 H11 M5 10.6 H9',
  folder: 'M2.5 4.4 H6 L7.6 6 H13.5 V12.6 H2.5 Z',
  chart:  'M2.5 13 H13.5 M4.5 13 V9.5 M8 13 V5.5 M11.5 13 V7.5',
  flower: 'M8 6 A2 2 0 1 0 8 10 A2 2 0 1 0 8 6 M8 6 V2.5 M8 10 V13.5 M6 8 H2.5 M10 8 H13.5',
  bowl:   'M2.5 7.4 H13.5 A5.5 5.5 0 0 1 2.5 7.4 Z M7 2.4 C6 3.4 8 4.2 7 5.4 M10 2.6 C9.2 3.4 10.8 4 10 5',
  target2:'M8 2 A6 6 0 1 0 8 14 A6 6 0 1 0 8 2',
};
function Icon(props){
  const { name='star', size=16, stroke=1.2, color='currentColor', style } = props;
  const d = ICON_PATHS[name] || ICON_PATHS.star;
  return React.createElement('svg', {
    width:size, height:size, viewBox:'0 0 16 16', fill:'none',
    stroke:color, strokeWidth:stroke, strokeLinecap:'round', strokeLinejoin:'round',
    style:{ display:'block', flex:'none', ...(style||{}) }
  }, React.createElement('path', { d }));
}

/* ---- Checkbox funcional ------------------------------------------------ */
function CB(props){
  const { on=false, size=14, theme:th, color } = props;
  const t = theme(th);
  const c = color || t.deep;
  return React.createElement('span', {
    className:'lp-cb', style:{
      width:size, height:size, border:`1.3px solid ${on?c:C.line}`, borderRadius:3,
      background: on? t.tint : 'transparent',
    }
  }, on ? React.createElement('svg', { width:size-4, height:size-4, viewBox:'0 0 10 10', fill:'none',
        stroke:c, strokeWidth:1.6, strokeLinecap:'round', strokeLinejoin:'round' },
        React.createElement('path', { d:'M1.5 5.2 L4 7.6 L8.6 2.4' })) : null);
}

/* ---- LinkChip ---------------------------------------------------------- */
function LinkChip(props){
  const { children, theme:th, active=false, icon, mono=false } = props;
  const t = theme(th);
  return React.createElement('span', {
    className:'lp-link', style:{
      display:'inline-flex', alignItems:'center', gap:6, padding:'5px 12px',
      borderRadius:999, border:`1px solid ${active?t.deep:C.line}`,
      background: active? t.tint : 'transparent',
      color: active? t.ink : C.ink2,
      fontFamily: mono? FONT.mono : FONT.sans, fontSize: mono?9.5:11.5,
      fontWeight: active?600:500, letterSpacing: mono?.4:.1, whiteSpace:'nowrap',
    }
  }, icon ? React.createElement(Icon,{name:icon,size:12,color:active?t.deep:C.ink3}) : null,
     React.createElement('span', null, children));
}

/* ---- Eyebrow (con regla hairline) -------------------------------------- */
function Eyebrow(props){
  const { children, color, line=true, style } = props;
  return React.createElement('div', { style:{ display:'flex', alignItems:'center', gap:12, ...(style||{}) } },
    React.createElement('span', { style:{
      fontFamily:FONT.mono, fontSize:9.5, letterSpacing:2.4, textTransform:'uppercase',
      color: color||C.ink3, whiteSpace:'nowrap',
    } }, children),
    line ? React.createElement('span', { style:{ flex:1, height:1, background:C.line } }) : null);
}

/* ---- SideTabs (5 secciones, derecha) ----------------------------------- */
const SECTIONS = ['Estilo','Bienestar','Autocuidado','Finanzas','Productividad'];
function SideTabs(props){
  const { theme:th, active, side='right' } = props;
  const t = theme(th);
  return React.createElement('div', { style:{
      position:'absolute', top:0, bottom:0, [side]:0, width:38,
      display:'flex', flexDirection:'column', borderLeft:`1px solid ${C.line}`,
      background:C.paper, zIndex:3,
    } },
    SECTIONS.map((s,i)=>{
      const on = active===s;
      return React.createElement('div', {
        key:s, className:'lp-link', style:{
          flex:1, minHeight:0, display:'flex', alignItems:'center', justifyContent:'center',
          borderBottom: i<SECTIONS.length-1 ? `1px solid ${C.lineSoft}` : 'none',
          background: on? t.deep : 'transparent',
        } },
        React.createElement('span', { style:{
          writingMode:'vertical-rl', transform:'rotate(180deg)',
          fontFamily:FONT.mono, fontSize:8.5, letterSpacing:1.2, textTransform:'uppercase',
          fontWeight: on?600:500, color: on? C.paper : C.ink3, whiteSpace:'nowrap',
        } }, s));
    }));
}

/* ---- TopNav ------------------------------------------------------------ */
const NAV = ['Índice','Año','Mes','Semana','Día','Notas'];
function TopNav(props){
  const { theme:th, current } = props;
  const t = theme(th);
  return React.createElement('div', { style:{
      position:'absolute', top:0, left:0, right:0, height:56, zIndex:3,
      display:'flex', alignItems:'center', gap:18, padding:'0 30px',
      borderBottom:`1px solid ${C.line}`, background:C.paper,
    } },
    React.createElement('div', { className:'lp-link', style:{ display:'flex', alignItems:'baseline', gap:7 } },
      React.createElement('span', { style:{ width:7, height:7, borderRadius:'50%', background:t.deep, alignSelf:'center' } }),
      React.createElement('span', { style:{ fontFamily:FONT.serif, fontStyle:'italic', fontWeight:500, fontSize:21, color:C.ink, letterSpacing:.2 } }, 'Linen Paper Co.')
    ),
    React.createElement('div', { style:{ display:'flex', alignItems:'center', gap:5, marginLeft:6 } },
      NAV.map(n=>{
        const on = current===n;
        return React.createElement('span', { key:n, className:'lp-link', style:{
          fontFamily:FONT.sans, fontSize:11.5, fontWeight: on?600:500,
          color: on? t.ink : C.ink3, padding:'5px 11px', borderRadius:999,
          background: on? t.tint : 'transparent', border:`1px solid ${on?t.mid:'transparent'}`,
        } }, n);
      })
    ),
    React.createElement('div', { style:{ marginLeft:'auto', display:'flex', alignItems:'center', gap:9, fontFamily:FONT.mono, fontSize:9.5, letterSpacing:1, color:C.ink3 } },
      React.createElement('span', null, 'Sin fechar'),
      React.createElement('span', { style:{ color:C.line } }, '·'),
      React.createElement('span', { style:{ color:t.deep, fontWeight:500 } }, t.name.toUpperCase()),
      React.createElement('span', { style:{ width:11, height:11, borderRadius:'50%', background:t.mid, border:`1px solid ${t.deep}` } })
    ));
}

/* ---- Page wrapper (1080x810) ------------------------------------------ */
function Page(props){
  const LP = window.LP;
  const { theme:th, tab, currentNav, padding=34, children, contentStyle } = props;
  return React.createElement('div', { className:'lp-page lp-grain', style:{
      position:'relative', width:1080, height:810, background:C.cream,
      fontFamily:FONT.sans, color:C.ink, overflow:'hidden',
    } },
    React.createElement(LP.TopNav, { theme:th, current:currentNav }),
    React.createElement(LP.SideTabs, { theme:th, active:tab }),
    React.createElement('div', { style:{
        position:'absolute', top:56, left:0, right:38, bottom:0, padding,
        zIndex:1, ...(contentStyle||{})
      } }, children));
}

/* ---- helpers compartidos ----------------------------------------------- */
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const MONTHS_SHORT = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const DOW_MON = ['L','M','M','J','V','S','D'];
const DOW_SUN = ['D','L','M','M','J','V','S'];
const DOW_FULL_MON = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

Object.assign(window, {
  LP: {
    C, THEMES, THEME_ORDER, theme, FONT, Icon, CB, LinkChip, Eyebrow, SideTabs, TopNav, Page,
    SECTIONS, NAV, MONTHS, MONTHS_SHORT, DOW_MON, DOW_SUN, DOW_FULL_MON,
  },
  LP_C: C, Icon, CB, LinkChip, Eyebrow, SideTabs, TopNav, Page,
});
})();
