/* ============================================================================
   masters-core.jsx — IndexHub · Yearly · MonthlySpread · Daily
   Todas: página 1080×810 vía <Page>.
   ========================================================================== */
(function(){
const h = React.createElement;

/* utilidades compartidas */
function rule(w, color){ return h('div',{style:{height:1, background:color, width:w||'100%'}}); }
function writeLines(n, gap, color){
  const a=[]; for(let i=0;i<n;i++) a.push(h('div',{key:i,style:{height:1, background:color, marginTop:i?gap:0}}));
  return a;
}
function miniMonth(name, days, offset, t, C, FONT, idx){
  const LP=window.LP;
  const cells=[]; for(let i=0;i<offset;i++) cells.push(null);
  for(let d=1;d<=days;d++) cells.push(d);
  while(cells.length%7) cells.push(null);
  return h('a',{key:'mm'+idx, href:'#month-'+String(idx+1).padStart(2,'0'), className:'lp-link', style:{padding:'0 2px', textDecoration:'none', display:'block'}},
    h('div',{style:{fontFamily:FONT.serif, fontStyle:'italic', fontSize:15, color:C.ink, marginBottom:4}}, name),
    h('div',{style:{display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'1px 0'}},
      LP.DOW_MON.map((d,i)=>h('div',{key:'h'+i, style:{fontFamily:FONT.mono, fontSize:6.5, textAlign:'center', color:i>=5?t.deep:C.ink4, paddingBottom:2}}, d)),
      cells.map((c,i)=>h('div',{key:i, style:{textAlign:'center', fontFamily:FONT.sans, fontSize:8, lineHeight:'12px', height:12,
        color: c==null?'transparent':((i%7>=5)?t.deep:C.ink2)}}, c==null?'·':c))
    ));
}

/* ---------------------------------------------------------------- IndexHub */
function IndexHub(props){
  const LP=window.LP, C=LP.C, FONT=LP.FONT; const t=LP.theme(props.theme);
  const months = LP.MONTHS;
  const chips = [
    {l:'Estilo',i:'star',href:'#hub'},{l:'Bienestar',i:'leaf',href:'#habits'},{l:'Autocuidado',i:'heart',href:'#wellness'},
    {l:'Finanzas',i:'coin',href:'#finance'},{l:'Productividad',i:'target',href:'#productivity'}
  ];
  const routes = [
    {n:'01', i:'cal',   l:'Vista anual',   m:'12 meses · metas',     href:'#yearly'},
    {n:'02', i:'grid',  l:'Plan mensual',  m:'calendario + foco',    href:'#month-01'},
    {n:'03', i:'week',  l:'Semana',        m:'7 días · lunes',       href:'#week-01'},
    {n:'04', i:'sun',   l:'Diario',        m:'hora a hora',          href:'#day'},
    {n:'05', i:'chart', l:'Hábitos',       m:'31 días',              href:'#habits'},
    {n:'06', i:'coin',  l:'Finanzas',      m:'presupuesto + gastos', href:'#finance'},
    {n:'07', i:'bowl',  l:'Bienestar',     m:'comidas + cuidado',    href:'#wellness'},
    {n:'08', i:'target',l:'Productividad', m:'proyectos + metas',    href:'#productivity'},
    {n:'09', i:'note',  l:'Notas',         m:'espacio libre',        href:'#notes'},
  ];
  return h(LP.Page,{theme:props.theme, currentNav:'Índice', padding:0},
    h('div',{style:{display:'flex', height:'100%'}},
      // izquierda
      h('div',{style:{flex:'1 1 0', padding:'34px 30px 30px 40px', display:'flex', flexDirection:'column'}},
        h(LP.Eyebrow,{color:t.deep}, 'Hub · navegación'),
        h('div',{style:{marginTop:18}},
          h('div',{style:{fontFamily:FONT.serif, fontWeight:500, fontSize:76, lineHeight:.9, color:C.ink}}, 'Índice'),
          h('div',{style:{fontFamily:FONT.serif, fontStyle:'italic', fontSize:30, color:t.deep, marginTop:2}}, 'todo a un toque')),
        h('div',{style:{display:'flex', flexWrap:'wrap', gap:7, marginTop:22}},
          chips.map(c=>h('a',{key:c.l, href:c.href, className:'lp-link', style:{textDecoration:'none'}},
            h(LP.LinkChip,{theme:props.theme, icon:c.i}, c.l)))),
        h('div',{style:{marginTop:26}}, h(LP.Eyebrow,{color:C.ink3}, 'Los doce meses')),
        h('div',{style:{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:9, marginTop:14}},
          months.map((m,i)=>h('a',{key:m, href:'#month-'+String(i+1).padStart(2,'0'), className:'lp-link', style:{display:'flex', alignItems:'center', gap:9, textDecoration:'none',
            border:`1px solid ${C.line}`, borderRadius:4, padding:'10px 12px', background:C.paper}},
            h('span',{style:{fontFamily:FONT.mono, fontSize:9, color:t.deep}}, String(i+1).padStart(2,'0')),
            h('span',{style:{fontFamily:FONT.serif, fontStyle:'italic', fontSize:16, color:C.ink}}, m)))),
        h('div',{style:{flex:1}}),
        h('div',{style:{fontFamily:FONT.mono, fontSize:9, letterSpacing:1, color:C.ink4}}, 'TOCA CUALQUIER ELEMENTO PARA NAVEGAR · PDF HIPERENLAZADO')
      ),
      // derecha — directorio sobre tint
      h('div',{style:{flex:'0 0 392px', background:t.tint, borderLeft:`1px solid ${t.mid}`, padding:'34px 34px 30px', display:'flex', flexDirection:'column'}},
        h(LP.Eyebrow,{color:t.deep}, 'Directorio'),
        h('div',{style:{marginTop:14, flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between'}},
          routes.map((r,idx)=>h('a',{key:r.n, href:r.href, className:'lp-link', style:{display:'flex', alignItems:'center', gap:14, textDecoration:'none',
            padding:'10px 0', borderTop: idx? `1px solid ${t.mid}`:'none'}},
            h('span',{style:{fontFamily:FONT.mono, fontSize:11, color:t.deep, width:18}}, r.n),
            h('span',{style:{width:26, height:26, borderRadius:'50%', background:C.paper, border:`1px solid ${t.mid}`,
              display:'flex', alignItems:'center', justifyContent:'center', flex:'none'}}, h(LP.Icon,{name:r.i, size:13, color:t.deep})),
            h('span',{style:{fontFamily:FONT.sans, fontSize:14, fontWeight:600, color:t.ink, flex:1}}, r.l),
            h('span',{style:{fontFamily:FONT.mono, fontSize:8.5, letterSpacing:.5, color:t.deep, textAlign:'right'}}, r.m),
            h(LP.Icon,{name:'arrowR', size:13, color:t.mid})
          )))
      )
    )
  );
}

/* ------------------------------------------------------------------ Yearly */
function Yearly(props){
  const LP=window.LP, C=LP.C, FONT=LP.FONT; const t=LP.theme(props.theme);
  const data = [31,28,31,30,31,30,31,31,30,31,30,31];
  const offs = [3,6,6,2,4,0,2,5,1,3,6,1];
  const LPI = window.LPI;
  return h(LP.Page,{theme:props.theme, currentNav:'Año', padding:0},
    h('div',{style:{display:'flex', height:'100%'}},
      // sidebar metas
      h('div',{style:{flex:'0 0 256px', padding:'34px 26px 28px 40px', display:'flex', flexDirection:'column', borderRight:`1px solid ${C.line}`}},
        h(LP.Eyebrow,{color:t.deep}, 'El año'),
        h('div',{style:{marginTop:14, fontFamily:FONT.serif, fontWeight:500, fontSize:54, lineHeight:.88, color:C.ink}}, 'Vista', ),
        h('div',{style:{fontFamily:FONT.serif, fontStyle:'italic', fontSize:40, color:t.deep, lineHeight:.9}}, 'anual'),
        h('div',{style:{marginTop:26}}, h(LP.Eyebrow,{color:C.ink3}, 'Palabra del año')),
        h('div',{style:{marginTop:10, background:t.tint, border:`1px solid ${t.mid}`, borderRadius:5, padding:'16px 16px', textAlign:'center'}},
          LPI.field('year-word',{fontFamily:FONT.serif, fontStyle:'italic', fontSize:30, color:t.ink, textAlign:'center'})),
        h('div',{style:{marginTop:24}}, h(LP.Eyebrow,{color:C.ink3}, 'Metas · 7 áreas')),
        h('div',{style:{marginTop:10, display:'flex', flexDirection:'column', gap:0}},
          [0,1,2,3,4,5,6].map(i=>h('div',{key:i, style:{display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderTop:i?`1px solid ${C.lineSoft}`:'none'}},
            h(LP.CB,{theme:props.theme}),
            LPI.line('goal-'+i,{flex:1, fontFamily:FONT.sans, fontSize:13, fontWeight:500, color:C.ink2})))),
        h('div',{style:{flex:1}}),
        h('div',{style:{marginTop:14}}, h(LP.Eyebrow,{color:C.ink3}, 'Soltar')),
        h('div',{style:{marginTop:8, display:'flex', flexWrap:'wrap', gap:6}},
          [0,1,2].map(i=>h('span',{key:i, style:{fontFamily:FONT.mono, fontSize:9, letterSpacing:.5, color:t.deep,
            border:`1px solid ${t.mid}`, borderRadius:999, padding:'4px 9px'}},
            LPI.field('soltar-'+i,{width:62, fontFamily:FONT.mono, fontSize:9, letterSpacing:.5, color:t.deep, textAlign:'center'}))))
      ),
      // mini calendarios 4x3
      h('div',{style:{flex:1, padding:'34px 36px 30px', display:'flex', flexDirection:'column'}},
        h('div',{style:{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gridTemplateRows:'repeat(3,1fr)', gap:'14px 18px', flex:1}},
          LP.MONTHS_SHORT.map((m,i)=>miniMonth(LP.MONTHS[i], data[i], offs[i], t, C, FONT, i)))
      )
    )
  );
}

/* ---------------------------------------------------------- MonthlySpread */
function MonthlySpread(props){
  const LP=window.LP, C=LP.C, FONT=LP.FONT; const t=LP.theme(props.theme);
  const monthName = props.monthName || 'Enero';
  const LPI = window.LPI;
  // calendario 7x6 — rejilla genérica sin fechar (offset visual, 31 celdas numeradas)
  const offset=3, days=31;
  const cells=[]; for(let i=0;i<offset;i++) cells.push(null);
  for(let d=1;d<=days;d++) cells.push(d);
  while(cells.length<42) cells.push(null);
  return h(LP.Page,{theme:props.theme, tab:null, currentNav:'Mes', padding:0},
    h('div',{style:{display:'flex', height:'100%'}},
      // izquierda — calendario
      h('div',{style:{flex:'1 1 0', padding:'30px 26px 28px 40px', display:'flex', flexDirection:'column'}},
        h('div',{style:{display:'flex', alignItems:'baseline', justifyContent:'space-between'}},
          h('div',null,
            h(LP.Eyebrow,{color:t.deep, line:false}, 'Plan mensual · sin fechar'),
            h('div',{style:{fontFamily:FONT.serif, fontWeight:500, fontSize:48, color:C.ink, marginTop:4, lineHeight:1}}, monthName)),
          h('div',{style:{fontFamily:FONT.mono, fontSize:9, color:C.ink3, textAlign:'right'}}, 'MES ____ / AÑO ____')),
        // cabecera días
        h('div',{style:{display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginTop:18, borderBottom:`1px solid ${C.line}`}},
          LP.DOW_FULL_MON.map((d,i)=>h('div',{key:i, style:{fontFamily:FONT.mono, fontSize:9, letterSpacing:1, textAlign:'center', padding:'0 0 8px',
            color: i>=5?t.deep:C.ink3, textTransform:'uppercase'}}, d.slice(0,3)))),
        // celdas
        h('div',{style:{flex:1, display:'grid', gridTemplateColumns:'repeat(7,1fr)', gridTemplateRows:'repeat(6,1fr)'}},
          cells.map((c,i)=>{ const wknd=(i%7>=5);
            return h('div',{key:i, style:{borderRight:(i%7!==6)?`1px solid ${C.lineSoft}`:'none',
              borderBottom: i<35?`1px solid ${C.lineSoft}`:'none', padding:'4px 5px', background: wknd? 'rgba(0,0,0,.012)':'transparent',
              display:'flex', flexDirection:'column', gap:2, minHeight:0, overflow:'hidden'}},
              c? h('span',{style:{fontFamily:FONT.sans, fontSize:11, fontWeight:500, color: wknd?t.deep:C.ink2}}, c):null,
              c? LPI.field('cal-'+c,{fontSize:8, color:t.ink, lineHeight:1.1}):null);
          }))
      ),
      // lomo visual
      h('div',{style:{flex:'0 0 1px', background:C.line, margin:'30px 0',
        boxShadow:`-8px 0 14px -10px rgba(0,0,0,.10), 8px 0 14px -10px rgba(0,0,0,.10)`}}),
      // derecha — panel
      h('div',{style:{flex:'0 0 348px', padding:'30px 32px 28px 28px', display:'flex', flexDirection:'column', gap:16}},
        // foco
        h('div',{style:{background:t.tint, border:`1px solid ${t.mid}`, borderRadius:5, padding:'14px 16px'}},
          h(LP.Eyebrow,{color:t.deep, line:false}, 'Foco del mes'),
          LPI.field('month-foco',{fontFamily:FONT.serif, fontStyle:'italic', fontSize:21, color:t.ink, marginTop:5, lineHeight:1.15})),
        // prioridades
        h('div',null, h(LP.Eyebrow,{color:C.ink3}, 'Prioridades'),
          h('div',{style:{marginTop:8}}, [0,1,2,3,4].map(i=>h('div',{key:i, style:{display:'flex', alignItems:'center', gap:9, padding:'6px 0', borderBottom:`1px solid ${C.lineSoft}`}},
            h(LP.CB,{theme:props.theme}), LPI.line('mprio-'+i,{flex:1, fontFamily:FONT.sans, fontSize:12.5, color:C.ink2}))))),
        // pagos + habitos en fila
        h('div',{style:{display:'flex', gap:18, flex:1}},
          h('div',{style:{flex:1}}, h(LP.Eyebrow,{color:C.ink3, line:false}, 'Pagos & fechas'),
            h('div',{style:{marginTop:8}}, [0,1,2,3,4].map(i=>h('div',{key:i, style:{display:'flex', alignItems:'center', gap:8, padding:'5px 0'}},
              h(LP.CB,{theme:props.theme, size:13}),
              LPI.field('pago-d-'+i,{width:22, fontFamily:FONT.mono, fontSize:10, color:t.deep}),
              LPI.line('pago-l-'+i,{flex:1, fontFamily:FONT.sans, fontSize:12, color:C.ink2}))))),
          h('div',{style:{flex:1}}, h(LP.Eyebrow,{color:C.ink3, line:false}, 'Hábitos del mes'),
            h('div',{style:{marginTop:10, display:'flex', flexDirection:'column', gap:11}}, [0,1,2,3].map(i=>h('div',{key:i},
              h('div',{style:{display:'flex', justifyContent:'space-between', marginBottom:4, alignItems:'center', gap:6}},
                LPI.field('mhabit-name-'+i,{flex:1, fontFamily:FONT.sans, fontSize:11, color:C.ink2}),
                h('span',{style:{display:'inline-flex', alignItems:'baseline', flex:'none'}},
                  LPI.number('mhabit-n-'+i,{width:20, fontFamily:FONT.mono, fontSize:9, color:t.deep, textAlign:'right'}),
                  h('span',{style:{fontFamily:FONT.mono, fontSize:9, color:t.deep}}, '/31'))),
              h('div',{style:{height:4, borderRadius:2, background:C.lineSoft, overflow:'hidden'}},
                h('div',{className:'js-bar', 'data-src':'mhabit-n-'+i, 'data-max':31, style:{height:'100%', width:'0%', background:t.mid}}))))))
        ),
        // reflexión
        h('div',null, h(LP.Eyebrow,{color:C.ink3}, 'Reflexión'),
          h('div',{style:{marginTop:12, display:'flex', flexDirection:'column', gap:14}},
            [0,1,2].map(i=>LPI.line('mreflex-'+i,{fontFamily:FONT.sans, fontSize:12, color:C.ink2}))))
      )
    )
  );
}

/* ------------------------------------------------------------------- Daily */
function Daily(props){
  const LP=window.LP, C=LP.C, FONT=LP.FONT; const t=LP.theme(props.theme);
  const LPI=window.LPI;
  const hours=['6','7','8','9','10','11','12','13','14','15','16','17','18','19'];
  const micro=[{i:'cloud',k:'Clima'},{i:'heart',k:'Ánimo'},{i:'moon',k:'Sueño'},{i:'drop',k:'Agua'}];
  const meals=['Desayuno','Almuerzo','Cena','Snacks'];
  return h(LP.Page,{theme:props.theme, currentNav:'Día', padding:0},
    h('div',{style:{display:'flex', height:'100%'}},
      // Col 1
      h('div',{style:{flex:'0 0 348px', padding:'28px 24px 26px 40px', borderRight:`1px solid ${C.line}`, display:'flex', flexDirection:'column'}},
        h('div',{style:{display:'flex', alignItems:'flex-end', gap:14}},
          LPI.field('day-num',{width:96, fontFamily:FONT.serif, fontStyle:'italic', fontWeight:500, fontSize:78, lineHeight:.8, color:t.deep}),
          h('div',{style:{paddingBottom:8}},
            LPI.field('day-name',{width:150, fontFamily:FONT.serif, fontSize:26, color:C.ink, lineHeight:1}),
            h('div',{style:{fontFamily:FONT.mono, fontSize:9, letterSpacing:1, color:C.ink3}}, 'DÍA ___ / SEM ___'))),
        // micro chips
        h('div',{style:{display:'flex', gap:6, marginTop:16}}, micro.map((m,mi)=>h('div',{key:m.k, style:{flex:1, border:`1px solid ${C.line}`, borderRadius:4, padding:'7px 6px', background:C.paper}},
          h('div',{style:{display:'flex', alignItems:'center', gap:4}}, h(LP.Icon,{name:m.i, size:11, color:t.deep}),
            h('span',{style:{fontFamily:FONT.mono, fontSize:7, letterSpacing:.5, color:C.ink3, textTransform:'uppercase'}}, m.k)),
          LPI.field('micro-'+mi,{fontFamily:FONT.sans, fontSize:9.5, fontWeight:600, color:C.ink2, marginTop:3})))),
        // agenda
        h('div',{style:{marginTop:16, flex:1, overflow:'hidden'}},
          h(LP.Eyebrow,{color:C.ink3}, 'Agenda'),
          h('div',{style:{marginTop:6}},
            hours.map(hr=>h('div',{key:hr, style:{display:'flex', gap:10, height:21, borderTop:`1px solid ${C.lineSoft}`, paddingTop:3, alignItems:'center'}},
              h('span',{style:{fontFamily:FONT.mono, fontSize:8.5, color:C.ink4, width:24, flex:'none'}}, hr.padStart(2,'0')+':00'),
              LPI.field('agenda-'+hr,{flex:1, fontFamily:FONT.sans, fontSize:11, color:t.ink})))))
      ),
      // Col 2
      h('div',{style:{flex:'1 1 0', padding:'28px 24px 26px', borderRight:`1px solid ${C.line}`, display:'flex', flexDirection:'column', gap:14}},
        h('div',null, h(LP.Eyebrow,{color:t.deep}, 'Las tres del día'),
          h('div',{style:{marginTop:10, display:'flex', flexDirection:'column', gap:9}}, [1,2,3].map(n=>h('div',{key:n, style:{display:'flex', alignItems:'center', gap:10}},
            h('span',{style:{fontFamily:FONT.serif, fontStyle:'italic', fontSize:22, color:t.deep, width:18}}, n),
            h(LP.CB,{theme:props.theme}),
            LPI.line('dtop-'+n,{flex:1, fontFamily:FONT.sans, fontSize:13, color:C.ink2}))))),
        h('div',{style:{background:t.tint, border:`1px solid ${t.mid}`, borderRadius:5, padding:'12px 14px'}},
          h(LP.Eyebrow,{color:t.deep, line:false}, 'Foco del día'),
          LPI.field('day-foco',{fontFamily:FONT.serif, fontStyle:'italic', fontSize:19, color:t.ink, marginTop:4})),
        h('div',{style:{flex:1}}, h(LP.Eyebrow,{color:C.ink3}, 'Por hacer'),
          h('div',{style:{marginTop:8}},
            [0,1,2,3,4,5,6,7].map(i=>h('div',{key:i, style:{display:'flex', alignItems:'center', gap:9, padding:'6px 0', borderBottom:`1px solid ${C.lineSoft}`}},
              h(LP.CB,{theme:props.theme}), LPI.line('dtodo-'+i,{flex:1, fontFamily:FONT.sans, fontSize:12.5, color:C.ink2}))))),
        h('div',null, h(LP.Eyebrow,{color:C.ink3}, 'Gratitud'),
          h('div',{style:{marginTop:12, display:'flex', flexDirection:'column', gap:13}},
            [0,1,2].map(i=>LPI.line('dgrat-'+i,{fontFamily:FONT.sans, fontSize:12, color:C.ink2}))))
      ),
      // Col 3
      h('div',{style:{flex:'0 0 300px', padding:'28px 30px 26px 22px', display:'flex', flexDirection:'column', gap:14}},
        h('div',null, h(LP.Eyebrow,{color:C.ink3, line:false}, 'Agua'),
          h('div',{style:{display:'flex', gap:7, marginTop:8}}, [0,1,2,3,4,5,6,7].map(i=>LPI.drop('dwater-'+i, 21)))),
        h('div',null, h(LP.Eyebrow,{color:C.ink3}, 'Comidas'),
          h('div',{style:{marginTop:8, display:'flex', flexDirection:'column', gap:0}}, meals.map((m,i)=>h('div',{key:m, style:{display:'flex', alignItems:'center', gap:10, padding:'7px 0', borderBottom:`1px solid ${C.lineSoft}`}},
            h('span',{style:{fontFamily:FONT.mono, fontSize:8, letterSpacing:.5, color:t.deep, width:62, textTransform:'uppercase'}}, m),
            LPI.line('dmeal-'+i,{flex:1, fontFamily:FONT.sans, fontSize:11, color:C.ink2}))))),
        h('div',null, h(LP.Eyebrow,{color:C.ink3}, 'Hábitos'),
          h('div',{style:{marginTop:8, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'7px 12px'}}, [0,1,2,3,4].map(i=>h('div',{key:i, style:{display:'flex', alignItems:'center', gap:7}},
            h(LP.CB,{theme:props.theme, size:13}), LPI.field('dhabit-'+i,{flex:1, fontFamily:FONT.sans, fontSize:11, color:C.ink2}))))),
        h('div',{style:{flex:1}},
          h('div',{style:{height:'100%', minHeight:64, border:`1px dashed ${t.mid}`, borderRadius:5, padding:'10px 12px', display:'flex', flexDirection:'column', justifyContent:'center'}},
            h(LP.Eyebrow,{color:t.deep, line:false}, 'Momento destacado'),
            LPI.field('dmoment',{fontFamily:FONT.serif, fontStyle:'italic', fontSize:16, color:t.ink, marginTop:4, lineHeight:1.2}))),
        h('div',null, h(LP.Eyebrow,{color:C.ink3, line:false}, 'Notas'),
          h('div',{style:{marginTop:10, display:'flex', flexDirection:'column', gap:13}},
            [0,1,2,3].map(i=>LPI.line('dnote-'+i,{fontFamily:FONT.sans, fontSize:11, color:C.ink2}))))
      )
    )
  );
}

Object.assign(window, { IndexHub, Yearly, MonthlySpread, Daily });
})();
