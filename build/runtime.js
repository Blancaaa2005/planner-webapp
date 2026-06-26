/* ============================================================================
   Planner runtime — hash router, lazy localStorage persistence, live theme,
   viewport scaling, toolbar. Config injected as window.__LP_CFG__.
   ========================================================================== */
(function(){
'use strict';
var CFG = window.__LP_CFG__ || {};
var PAGE_W = CFG.pageW || 1080, PAGE_H = CFG.pageH || 810;
var DOC_ID = CFG.docId || 'planner';
var PAGE_IDS = CFG.pageIds || [];
var THEMES = CFG.themes || {};          // id -> {name,pantone}
var THEME_ORDER = CFG.themeOrder || [];
var DEFAULT_THEME = CFG.defaultTheme || THEME_ORDER[0];
var LABELS = CFG.labels || {};
var NS = 'lp:' + DOC_ID + ':';

/* ---- safe storage -------------------------------------------------------- */
function lsGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
function lsSet(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
function lsDel(k){ try{ localStorage.removeItem(k); }catch(e){} }
function key(pageId,name){ return NS + pageId + '|' + name; }

/* ---- per-page persistence ------------------------------------------------ */
function pageOf(el){ var p = el.closest('.lp-page'); return p ? p.id : null; }

function saveField(el){
  var pid = pageOf(el); if(!pid || !el.name) return;
  if(el.type === 'checkbox'){ lsSet(key(pid, el.name), el.checked ? '1':'0'); }
  else if(el.type === 'radio'){ if(el.checked) lsSet(key(pid,'radio|'+el.name), el.value); }
  else { lsSet(key(pid, el.name), el.value); }
}

function restorePage(pageEl){
  if(pageEl.getAttribute('data-restored') === '1') return;
  if(typeof window.rebuildPage === 'function') window.rebuildPage(pageEl); // dynamic rows first
  var pid = pageEl.id;
  var els = pageEl.querySelectorAll('input,textarea,select');
  for(var i=0;i<els.length;i++){
    var el = els[i]; if(!el.name) continue;
    if(el.type === 'checkbox'){
      var v = lsGet(key(pid, el.name)); if(v!==null) el.checked = (v==='1');
    } else if(el.type === 'radio'){
      var rv = lsGet(key(pid,'radio|'+el.name)); if(rv!==null) el.checked = (el.value===rv);
    } else {
      var tv = lsGet(key(pid, el.name)); if(tv!==null) el.value = tv;
    }
  }
  pageEl.setAttribute('data-restored','1');
  recompute(pageEl);
}

/* ---- derived values ------------------------------------------------------ */
function num(v){ if(v==null) return 0; v=(''+v).replace(/\./g,'').replace(',','.').replace(/[^0-9.\-]/g,''); var n=parseFloat(v); return isNaN(n)?0:n; }
function money(n){ return n.toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2}); }

function recompute(pageEl){
  if(typeof window.recomputePage === 'function'){ try{ window.recomputePage(pageEl); }catch(e){} }
}

/* live derived values: bars from a single numeric field, habit row sums,
   project completion %, finance balance + per-category spend + month total. */
window.recomputePage = function(page){
  var id = page.id || '';
  // numeric-field bars (wellness body chequeo, monthly habit counts)
  var bars = page.querySelectorAll('.js-bar');
  for(var i=0;i<bars.length;i++){
    var b=bars[i], src=b.getAttribute('data-src'), max=parseFloat(b.getAttribute('data-max'))||100;
    var inp=page.querySelector('[name="'+src+'"]'), v=inp?num(inp.value):0;
    b.style.width=Math.max(0,Math.min(100, max? v/max*100:0))+'%';
  }
  // habit-tracker row sums
  var sums=page.querySelectorAll('.js-habit-sum');
  for(var s=0;s<sums.length;s++){
    var row=sums[s].closest('.js-habit-row'); if(!row) continue;
    var tg=row.querySelectorAll('.lp-toggle'), c=0;
    for(var k=0;k<tg.length;k++) if(tg[k].checked) c++;
    sums[s].textContent=c;
  }
  // productivity project completion
  var cards=page.querySelectorAll('.js-proj-card');
  for(var p=0;p<cards.length;p++){
    var t2=cards[p].querySelectorAll('.lp-toggle'), done=0;
    for(var q=0;q<t2.length;q++) if(t2[q].checked) done++;
    var pc=t2.length? Math.round(done/t2.length*100):0;
    var pe=cards[p].querySelector('.js-proj-pct'); if(pe) pe.textContent=pc+'%';
    var pb=cards[p].querySelector('.js-proj-bar'); if(pb) pb.style.width=pc+'%';
  }
  // finance balance + ledger total + per-category spend
  if(id==='finance'){
    var inE=page.querySelector('[name="fin-entra"]'), inS=page.querySelector('[name="fin-sale"]');
    var entra=inE?num(inE.value):0, sale=inS?num(inS.value):0;
    var qd=page.querySelector('.js-fin-queda'); if(qd) qd.textContent=money(entra-sale);
    var amts=page.querySelectorAll('[data-led="amt"]'), total=0, byCat={};
    for(var a=0;a<amts.length;a++){
      var amt=num(amts[a].value); total+=amt;
      var rEl=amts[a].closest('.js-led-row'), cInp=rEl?rEl.querySelector('[data-led="cat"]'):null;
      var cv=cInp?(cInp.value||'').trim().toLowerCase():''; if(cv) byCat[cv]=(byCat[cv]||0)+amt;
    }
    var tt=page.querySelector('.js-fin-total'); if(tt) tt.textContent=money(total)+' €';
    var sp=page.querySelectorAll('.js-cat-spent');
    for(var c2=0;c2<sp.length;c2++){
      var di=sp[c2].getAttribute('data-i');
      var nmI=page.querySelector('[name="cat-name-'+di+'"]'), nm=nmI?(nmI.value||'').trim().toLowerCase():'';
      var spent=nm?(byCat[nm]||0):0; sp[c2].textContent=money(spent);
      var bdI=page.querySelector('[name="cat-budget-'+di+'"]'), bd=bdI?num(bdI.value):0;
      var cb=page.querySelector('.js-cat-bar[data-i="'+di+'"]');
      if(cb) cb.style.width=(bd?Math.max(0,Math.min(100,spent/bd*100)):0)+'%';
    }
  }
};

/* ---- router -------------------------------------------------------------- */
function resolveId(id){
  // undated planner: no #today/#sec-now sentinels needed, but stay graceful
  if(id === 'today') return 'day';
  if(/-now$/.test(id)) return id.replace(/-now$/,'-01');
  return id;
}
var current = null;
function show(id){
  id = resolveId(id || PAGE_IDS[0]);
  if(PAGE_IDS.indexOf(id) === -1) id = PAGE_IDS[0];
  var pages = document.querySelectorAll('.lp-page');
  for(var i=0;i<pages.length;i++) pages[i].classList.remove('is-active');
  var el = document.getElementById(id);
  if(!el) return;
  restorePage(el);
  el.classList.add('is-active');
  current = id;
  document.getElementById('tb-label').textContent = LABELS[id] || id;
  if(location.hash !== '#'+id){ history.replaceState(null,'','#'+id); }
  document.getElementById('lp-fit').scrollTop = 0;
  document.getElementById('lp-fit').scrollLeft = 0;
}
function go(delta){
  var i = PAGE_IDS.indexOf(current); if(i<0) i=0;
  var j = Math.min(PAGE_IDS.length-1, Math.max(0, i+delta));
  show(PAGE_IDS[j]);
}

/* ---- theme --------------------------------------------------------------- */
function applyTheme(id){
  if(!THEMES[id]) id = DEFAULT_THEME;
  document.documentElement.setAttribute('data-theme', id);
  var nm = THEMES[id].name || id, pt = THEMES[id].pantone || '';
  var names = document.querySelectorAll('.js-theme-name');
  for(var i=0;i<names.length;i++) names[i].textContent = nm;
  var pts = document.querySelectorAll('.js-theme-pantone');
  for(var j=0;j<pts.length;j++) pts[j].textContent = pt;
  var dots = document.querySelectorAll('.tb-dot');
  for(var k=0;k<dots.length;k++) dots[k].classList.toggle('on', dots[k].getAttribute('data-theme')===id);
  // cover swatch active outline
  var sw = document.querySelectorAll('[data-swatch]');
  for(var s=0;s<sw.length;s++) sw[s].style.outline = (sw[s].getAttribute('data-swatch')===id) ? '1.5px solid #2B2622' : 'none';
  lsSet('lp:theme', id);
}

/* ---- scaling ------------------------------------------------------------- */
function fit(){
  var pad = 24, toolbarH = 46;
  var vw = window.innerWidth, vh = window.innerHeight;
  var s = Math.min((vw - pad)/PAGE_W, (vh - toolbarH - pad)/PAGE_H);
  s = Math.max(0.2, s);
  var stage = document.getElementById('lp-stage');
  var wrap = document.getElementById('lp-stage-wrap');
  stage.style.transform = 'scale(' + s + ')';
  var w = PAGE_W*s, hgt = PAGE_H*s;
  wrap.style.width = w + 'px'; wrap.style.height = hgt + 'px';
  var fitEl = document.getElementById('lp-fit');
  var left = Math.max(0, (fitEl.clientWidth - w)/2);
  var top = Math.max(0, (fitEl.clientHeight - hgt)/2);
  wrap.style.left = left + 'px'; wrap.style.top = top + 'px';
}

/* ---- export / import / clear --------------------------------------------- */
function allKeys(){ var a=[]; for(var i=0;i<localStorage.length;i++){ var k=localStorage.key(i); if(k && k.indexOf(NS)===0) a.push(k); } return a; }
function exportData(){
  var data = { app:'Linen Paper Planner', doc:DOC_ID, version:1, date:new Date().toISOString(), theme:lsGet('lp:theme')||DEFAULT_THEME, data:{} };
  var ks = allKeys(); for(var i=0;i<ks.length;i++) data.data[ks[i]] = lsGet(ks[i]);
  var blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
  var url = URL.createObjectURL(blob); var a=document.createElement('a');
  a.href=url; a.download=DOC_ID+'-datos.json'; document.body.appendChild(a); a.click();
  document.body.removeChild(a); setTimeout(function(){ URL.revokeObjectURL(url); },1000);
}
function importData(){
  var inp=document.createElement('input'); inp.type='file'; inp.accept='application/json,.json';
  inp.onchange=function(){ var f=inp.files[0]; if(!f) return; var rd=new FileReader();
    rd.onload=function(){ try{ var obj=JSON.parse(rd.result); var d=obj.data||obj;
      for(var k in d){ if(k.indexOf('lp:')===0) lsSet(k, d[k]); }
      if(obj.theme) lsSet('lp:theme', obj.theme);
      location.reload();
    }catch(e){ alert('Archivo no válido.'); } };
    rd.readAsText(f); };
  inp.click();
}
function clearPage(){
  if(!current) return;
  if(!confirm('¿Borrar todo lo escrito en esta página ('+(LABELS[current]||current)+')?')) return;
  var pre = NS + current + '|'; var ks = allKeys();
  for(var i=0;i<ks.length;i++){ if(ks[i].indexOf(pre)===0) lsDel(ks[i]); }
  var el=document.getElementById(current); el.setAttribute('data-restored','0');
  // reset DOM fields in page
  var f=el.querySelectorAll('input,textarea'); for(var j=0;j<f.length;j++){ if(f[j].type==='checkbox') f[j].checked=false; else f[j].value=''; }
  restorePage(el);
}
function clearAll(){
  if(!confirm('¿Borrar TODOS los datos de este planner? Esta acción no se puede deshacer.')) return;
  var ks=allKeys(); for(var i=0;i<ks.length;i++) lsDel(ks[i]);
  location.reload();
}

/* ---- toolbar ------------------------------------------------------------- */
function buildToolbar(){
  var tb=document.getElementById('lp-toolbar');
  var html=''
   + '<span class="tb-brand">Linen Paper</span>'
   + '<button class="tb-nav" id="tb-prev" title="Anterior (←)">‹</button>'
   + '<span class="tb-label" id="tb-label"></span>'
   + '<button class="tb-nav" id="tb-next" title="Siguiente (→)">›</button>'
   + '<span class="tb-sep"></span>'
   + '<button data-go="hub">Índice</button>'
   + '<button data-go="yearly">Calendario</button>'
   + '<span class="tb-spacer"></span>'
   + '<span class="tb-dots" id="tb-dots"></span>'
   + '<span class="tb-sep"></span>'
   + '<button id="tb-export">Exportar</button>'
   + '<button id="tb-import">Importar</button>'
   + '<button id="tb-clearpage">Borrar página</button>'
   + '<button id="tb-clearall">Borrar todo</button>'
   + '<button id="tb-print">Imprimir</button>';
  tb.innerHTML=html;
  var dots=document.getElementById('tb-dots');
  THEME_ORDER.forEach(function(id){
    var b=document.createElement('button'); b.className='tb-dot'; b.setAttribute('data-theme',id);
    b.title=(THEMES[id]&&THEMES[id].name)||id;
    b.style.background=(THEMES[id]&&THEMES[id].swatch)||'#ccc';
    b.onclick=function(){ applyTheme(id); };
    dots.appendChild(b);
  });
  document.getElementById('tb-prev').onclick=function(){ go(-1); };
  document.getElementById('tb-next').onclick=function(){ go(1); };
  document.getElementById('tb-export').onclick=exportData;
  document.getElementById('tb-import').onclick=importData;
  document.getElementById('tb-clearpage').onclick=clearPage;
  document.getElementById('tb-clearall').onclick=clearAll;
  document.getElementById('tb-print').onclick=function(){ window.print(); };
  var gos=tb.querySelectorAll('[data-go]');
  for(var i=0;i<gos.length;i++) (function(el){ el.onclick=function(){ show(el.getAttribute('data-go')); }; })(gos[i]);
}

/* ---- events -------------------------------------------------------------- */
function onInput(e){
  var t=e.target;
  if(t && (t.classList.contains('lp-field')||t.classList.contains('lp-area')||t.classList.contains('lp-line')||t.classList.contains('lp-toggle')||t.type==='checkbox'||t.type==='radio')){
    saveField(t);
    var p=t.closest('.lp-page'); if(p) recompute(p);
  }
}

/* ---- anchor interception (file:// hash nav) ------------------------------ */
function onClick(e){
  var a=e.target.closest && e.target.closest('a[href^="#"]');
  if(a){
    e.preventDefault();
    var sw=a.getAttribute('data-swatch');
    if(sw){ applyTheme(sw); return; }
    show(a.getAttribute('href').slice(1));
  }
}

function onKey(e){
  var t=e.target, tag=(t&&t.tagName)||'';
  if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT') return;
  if(e.key==='ArrowLeft'){ go(-1); } else if(e.key==='ArrowRight'){ go(1); }
}

/* ---- boot ---------------------------------------------------------------- */
function boot(){
  buildToolbar();
  applyTheme(lsGet('lp:theme') || DEFAULT_THEME);
  document.addEventListener('input', onInput, true);
  document.addEventListener('change', onInput, true);
  document.addEventListener('click', onClick, true);
  document.addEventListener('keydown', onKey);
  window.addEventListener('resize', fit);
  window.addEventListener('hashchange', function(){ var id=location.hash.slice(1); if(id && id!==current) show(id); });
  fit();
  var start = location.hash.slice(1) || PAGE_IDS[0];
  show(start);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
