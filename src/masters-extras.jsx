/* ============================================================================
   masters-extras.jsx — HabitTracker · Finance · Wellness · Productivity
                        · Notes · Stickers   (todas 1080×810 vía <Page>)
   ========================================================================== */
(function(){
const h = React.createElement;
function bar(pct, t, C, hgt){
  return h('div',{style:{height:hgt||5, borderRadius:3, background:C.lineSoft, overflow:'hidden'}},
    h('div',{style:{height:'100%', width:Math.min(100,pct)+'%', background:t.mid}}));
}
function writeLines(n, gap, color){ const a=[]; for(let i=0;i<n;i++) a.push(h('div',{key:i,style:{height:1, background:color, marginTop:i?gap:0}})); return a; }

/* ----------------------------------------------------------- HabitTracker */
function HabitTracker(props){
  const LP=window.LP, C=LP.C, FONT=LP.FONT; const t=LP.theme(props.theme);
  const LPI=window.LPI;
  const moods=['😞','😕','😐','🙂','😊'];
  const days=Array.from({length:31},(_,i)=>i+1);
  const rows=Array.from({length:11},(_,i)=>i);
  return h(LP.Page,{theme:props.theme, tab:'Bienestar', padding:0},
    h('div',{style:{padding:'30px 34px 26px 40px', display:'flex', flexDirection:'column', height:'100%'}},
      h('div',{style:{display:'flex', alignItems:'flex-end', justifyContent:'space-between'}},
        h('div',null, h(LP.Eyebrow,{color:t.deep, line:false}, 'Seguimiento mensual'),
          h('div',{style:{fontFamily:FONT.serif, fontWeight:500, fontSize:44, color:C.ink, marginTop:3, lineHeight:1}}, 'Hábitos')),
        h('div',{style:{display:'flex', gap:22, fontFamily:FONT.mono, fontSize:9, color:C.ink3, textAlign:'right'}},
          h('div',null, h('div',{style:{color:t.deep, fontSize:11}}, 'MES ____'), 'MES'),
          h('div',null, h('div',{style:{color:t.deep, fontSize:11, display:'flex', alignItems:'baseline', gap:3, justifyContent:'flex-end'}}, '🔥', LPI.number('streak',{width:24, fontFamily:FONT.mono, fontSize:11, color:t.deep, textAlign:'right'}), 'días'), 'RACHA'))),
      // header números
      h('div',{style:{display:'grid', gridTemplateColumns:'150px repeat(31,1fr) 34px', marginTop:18, alignItems:'center'}},
        h('span',null),
        days.map(d=>h('span',{key:d, style:{fontFamily:FONT.mono, fontSize:7, textAlign:'center', color: (d%7===0||d%7===6)?t.deep:C.ink4}}, d)),
        h('span',{style:{fontFamily:FONT.mono, fontSize:8, textAlign:'center', color:t.deep, fontWeight:600}}, 'Σ')),
      h('div',{style:{flex:1, display:'flex', flexDirection:'column'}},
        rows.map(r=>h('div',{key:r, className:'js-habit-row', style:{flex:1, display:'grid', gridTemplateColumns:'150px repeat(31,1fr) 34px', alignItems:'center', borderTop:`1px solid ${C.lineSoft}`}},
          LPI.field('hname-'+r,{fontFamily:FONT.sans, fontSize:11.5, color:C.ink2}),
          days.map(d=>h('div',{key:d, style:{display:'flex', justifyContent:'center'}}, LPI.sq('h-'+r+'-'+d, 11))),
          h('span',{className:'js-habit-sum', style:{fontFamily:FONT.mono, fontSize:9.5, textAlign:'center', color:t.deep, fontWeight:600}}, '0')))),
      // mood row
      h('div',{style:{marginTop:14, display:'flex', alignItems:'center', gap:20, background:t.tint, border:`1px solid ${t.mid}`, borderRadius:5, padding:'12px 18px'}},
        h('span',{style:{fontFamily:FONT.mono, fontSize:8.5, letterSpacing:1.5, color:t.deep, textTransform:'uppercase'}}, 'Ánimo del mes'),
        h('div',{style:{display:'flex', gap:14}}, moods.map((m,i)=>h('span',{key:i, className:'lp-link', style:{fontSize:22, opacity:.92}}, m))),
        h('span',{style:{flex:1, height:1, background:t.mid}}),
        h('span',{style:{fontFamily:FONT.serif, fontStyle:'italic', fontSize:19, color:t.ink}}, 'El progreso vive en los días pequeños.'))
    )
  );
}

/* ----------------------------------------------------------------- Finance */
function Finance(props){
  const LP=window.LP, C=LP.C, FONT=LP.FONT; const t=LP.theme(props.theme);
  const LPI=window.LPI;
  const catRows=Array.from({length:8},(_,i)=>i);
  const ledgerRows=Array.from({length:12},(_,i)=>i);
  return h(LP.Page,{theme:props.theme, tab:'Finanzas', padding:0},
    h('div',{style:{display:'flex', height:'100%'}},
      // izquierda presupuesto
      h('div',{style:{flex:'1 1 0', padding:'30px 26px 26px 40px', borderRight:`1px solid ${C.line}`, display:'flex', flexDirection:'column'}},
        h(LP.Eyebrow,{color:t.deep, line:false}, 'Presupuesto · sin fechar'),
        h('div',{style:{fontFamily:FONT.serif, fontWeight:500, fontSize:40, color:C.ink, marginTop:3}}, 'Finanzas'),
        h('div',{style:{display:'flex', gap:0, marginTop:18, background:t.tint, border:`1px solid ${t.mid}`, borderRadius:6, overflow:'hidden'}},
          h('div',{style:{flex:1, padding:'16px 18px'}},
            h('div',{style:{fontFamily:FONT.mono, fontSize:8.5, letterSpacing:1.5, color:t.deep, textTransform:'uppercase'}}, 'Entra'),
            h('div',{style:{display:'flex', alignItems:'baseline'}},
              LPI.number('fin-entra',{fontFamily:FONT.serif, fontStyle:'italic', fontSize:34, color:t.ink, lineHeight:1.1, minWidth:0}),
              h('span',{style:{fontFamily:FONT.serif, fontStyle:'italic', fontSize:18, color:t.ink, flex:'none'}}, ' €'))),
          h('div',{style:{flex:1, padding:'16px 18px', borderLeft:`1px solid ${t.mid}`}},
            h('div',{style:{fontFamily:FONT.mono, fontSize:8.5, letterSpacing:1.5, color:t.deep, textTransform:'uppercase'}}, 'Sale'),
            h('div',{style:{display:'flex', alignItems:'baseline'}},
              LPI.number('fin-sale',{fontFamily:FONT.serif, fontStyle:'italic', fontSize:34, color:C.ink2, lineHeight:1.1, minWidth:0}),
              h('span',{style:{fontFamily:FONT.serif, fontStyle:'italic', fontSize:18, color:C.ink2, flex:'none'}}, ' €'))),
          h('div',{style:{flex:1, padding:'16px 18px', borderLeft:`1px solid ${t.mid}`}},
            h('div',{style:{fontFamily:FONT.mono, fontSize:8.5, letterSpacing:1.5, color:t.deep, textTransform:'uppercase'}}, 'Queda'),
            h('div',{style:{display:'flex', alignItems:'baseline'}},
              h('span',{className:'js-fin-queda', style:{fontFamily:FONT.serif, fontStyle:'italic', fontSize:34, color:t.deep, lineHeight:1.1}}, '0,00'),
              h('span',{style:{fontFamily:FONT.serif, fontStyle:'italic', fontSize:18, color:t.deep}}, ' €')))),
        h('div',{style:{marginTop:22}}, h(LP.Eyebrow,{color:C.ink3}, 'Por categoría')),
        h('div',{style:{marginTop:10, flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between'}},
          catRows.map(i=>h('div',{key:i},
            h('div',{style:{display:'flex', justifyContent:'space-between', marginBottom:4, alignItems:'center', gap:8}},
              LPI.field('cat-name-'+i,{flex:1, fontFamily:FONT.sans, fontSize:12.5, color:C.ink2}),
              h('span',{style:{display:'inline-flex', alignItems:'baseline', flex:'none', fontFamily:FONT.mono, fontSize:9.5, color:t.deep}},
                h('span',{className:'js-cat-spent', 'data-i':i}, '0,00'),
                h('span',null,' / '),
                LPI.number('cat-budget-'+i,{width:42, fontFamily:FONT.mono, fontSize:9.5, color:t.deep, textAlign:'right'}),
                h('span',null,' €'))),
            h('div',{style:{height:5, borderRadius:3, background:C.lineSoft, overflow:'hidden'}},
              h('div',{className:'js-cat-bar', 'data-i':i, style:{height:'100%', width:'0%', background:t.mid}}))))),
        h('div',{style:{marginTop:16, border:`1px dashed ${t.mid}`, borderRadius:5, padding:'10px 14px', display:'flex', alignItems:'baseline', gap:5}},
          h('span',{style:{fontFamily:FONT.serif, fontStyle:'italic', fontSize:16, color:t.ink, flex:'none'}}, 'Nota financiera:'),
          LPI.field('fin-nota',{flex:1, fontFamily:FONT.serif, fontStyle:'italic', fontSize:16, color:C.ink3}))
      ),
      // derecha ledger
      h('div',{style:{flex:'0 0 408px', padding:'30px 36px 26px 28px', display:'flex', flexDirection:'column'}},
        h(LP.Eyebrow,{color:t.deep}, 'Registro de gastos'),
        h('div',{style:{display:'grid', gridTemplateColumns:'34px 1fr 88px 64px', marginTop:14, paddingBottom:7, borderBottom:`1px solid ${t.mid}`}},
          ['Fecha','Descripción','Categoría','Importe'].map((x,i)=>h('span',{key:i, style:{fontFamily:FONT.mono, fontSize:8, letterSpacing:.8, color:t.deep, textTransform:'uppercase', textAlign:i===3?'right':'left'}}, x))),
        h('div',{style:{flex:1, display:'flex', flexDirection:'column'}},
          ledgerRows.map(i=>h('div',{key:i, className:'js-led-row', style:{flex:1, display:'grid', gridTemplateColumns:'34px 1fr 88px 64px', alignItems:'center', borderBottom:`1px solid ${C.lineSoft}`}},
            LPI.field('led-'+i+'-date',{fontFamily:FONT.mono, fontSize:10, color:t.deep}),
            LPI.field('led-'+i+'-desc',{fontFamily:FONT.sans, fontSize:12, color:C.ink2}),
            h('input',{type:'text', className:'lp-field', name:'led-'+i+'-cat', 'data-led':'cat', style:{fontFamily:FONT.sans, fontSize:10.5, color:C.ink3}}),
            h('input',{type:'text', inputMode:'numeric', className:'lp-field lp-num', name:'led-'+i+'-amt', 'data-led':'amt', style:{fontFamily:FONT.mono, fontSize:10.5, color:C.ink, textAlign:'right'}})))),
        h('div',{style:{display:'flex', alignItems:'baseline', justifyContent:'space-between', borderTop:`1.5px solid ${t.deep}`, marginTop:6, paddingTop:10}},
          h('span',{style:{fontFamily:FONT.mono, fontSize:9, letterSpacing:1.5, color:C.ink3, textTransform:'uppercase'}}, 'Total mes'),
          h('span',{className:'js-fin-total', style:{fontFamily:FONT.serif, fontStyle:'italic', fontSize:36, color:t.deep}}, '0,00 €'))
      )
    )
  );
}

/* ---------------------------------------------------------------- Wellness */
function Wellness(props){
  const LP=window.LP, C=LP.C, FONT=LP.FONT; const t=LP.theme(props.theme);
  const LPI=window.LPI;
  const dows=LP.DOW_FULL_MON.map(d=>d.slice(0,3));
  const slots=['Desayuno','Almuerzo','Cena','Snacks'];
  const groceryRows=Array.from({length:12},(_,i)=>i);
  const careRows=Array.from({length:6},(_,i)=>i);
  const body=[['Energía'],['Estrés'],['Descanso']];
  return h(LP.Page,{theme:props.theme, tab:'Autocuidado', padding:0},
    h('div',{style:{padding:'26px 30px 22px 40px', display:'flex', flexDirection:'column', height:'100%'}},
      h('div',{style:{display:'flex', alignItems:'flex-end', justifyContent:'space-between'}},
        h('div',null, h(LP.Eyebrow,{color:t.deep, line:false}, 'Bienestar · semana'),
          h('div',{style:{fontFamily:FONT.serif, fontWeight:500, fontSize:40, color:C.ink, marginTop:2}}, 'Cuerpo & cocina')),
        h('div',{style:{fontFamily:FONT.mono, fontSize:9, color:C.ink3}}, 'SEMANA ____')),
      h('div',{style:{display:'flex', gap:20, marginTop:16, flex:1, minHeight:0}},
        // meal planner
        h('div',{style:{flex:'1 1 0', display:'flex', flexDirection:'column'}},
          h(LP.Eyebrow,{color:C.ink3}, 'Menú semanal'),
          h('div',{style:{marginTop:8, flex:1, display:'grid', gridTemplateColumns:'62px repeat(4,1fr)', gridTemplateRows:'auto repeat(7,1fr)', border:`1px solid ${C.line}`, borderRadius:5, overflow:'hidden'}},
            h('div',{style:{borderRight:`1px solid ${C.lineSoft}`, borderBottom:`1px solid ${C.line}`, background:C.paper}}),
            slots.map((s,i)=>h('div',{key:s, style:{padding:'7px 8px', borderBottom:`1px solid ${C.line}`, borderRight:i<3?`1px solid ${C.lineSoft}`:'none', background:C.paper, fontFamily:FONT.mono, fontSize:8, letterSpacing:.5, color:t.deep, textTransform:'uppercase'}}, s)),
            dows.map((d,r)=>[
              h('div',{key:'d'+r, style:{padding:'0 8px', display:'flex', alignItems:'center', borderRight:`1px solid ${C.lineSoft}`, borderTop:r?`1px solid ${C.lineSoft}`:'none', fontFamily:FONT.sans, fontSize:11, fontWeight:600, color: (r>=5)?t.deep:C.ink2}}, d),
              slots.map((s,c)=>h('div',{key:r+'-'+c, style:{borderRight:c<3?`1px solid ${C.lineSoft}`:'none', borderTop:r?`1px solid ${C.lineSoft}`:'none', background:(r>=5)?'rgba(0,0,0,.012)':'transparent', display:'flex'}},
                LPI.field('meal-'+r+'-'+c,{fontSize:8.5, color:C.ink2, padding:'2px 5px'})))
            ])
          )),
        // right column
        h('div',{style:{flex:'0 0 300px', display:'flex', flexDirection:'column', gap:14}},
          h('div',null, h(LP.Eyebrow,{color:C.ink3}, 'Lista de compra'),
            h('div',{style:{marginTop:8, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5px 16px'}},
              groceryRows.map(i=>h('div',{key:i, style:{display:'flex', alignItems:'center', gap:7}},
                h(LP.CB,{theme:props.theme, size:12}), LPI.field('groc-'+i,{flex:1, fontFamily:FONT.sans, fontSize:11.5, color:C.ink2}))))),
          h('div',{style:{background:t.tint, border:`1px solid ${t.mid}`, borderRadius:5, padding:'12px 16px'}},
            h(LP.Eyebrow,{color:t.deep, line:false}, 'Chequeo corporal'),
            h('div',{style:{marginTop:10, display:'flex', flexDirection:'column', gap:9}}, body.map((b,i)=>h('div',{key:i},
              h('div',{style:{display:'flex', justifyContent:'space-between', marginBottom:3, alignItems:'center'}},
                h('span',{style:{fontFamily:FONT.sans, fontSize:11.5, color:t.ink}}, b[0]),
                h('span',{style:{display:'inline-flex', alignItems:'baseline', fontFamily:FONT.mono, fontSize:9.5, color:t.deep}},
                  LPI.number('body-n-'+i,{width:20, fontFamily:FONT.mono, fontSize:9.5, color:t.deep, textAlign:'right'}), '/10')),
              h('div',{style:{height:5, borderRadius:3, background:C.paper, overflow:'hidden'}},
                h('div',{className:'js-bar', 'data-src':'body-n-'+i, 'data-max':10, style:{height:'100%', width:'0%', background:t.deep}})))))))
      ),
      // bottom: agua + autocuidado
      h('div',{style:{display:'flex', gap:20, marginTop:14, flex:'0 0 132px'}},
        h('div',{style:{flex:'1 1 0'}},
          h(LP.Eyebrow,{color:C.ink3}, 'Agua diaria'),
          h('div',{style:{marginTop:8, display:'flex', flexDirection:'column', gap:4}}, dows.map((d,r)=>h('div',{key:r, style:{display:'flex', alignItems:'center', gap:10}},
            h('span',{style:{fontFamily:FONT.sans, fontSize:10.5, color:(r>=5)?t.deep:C.ink3, width:30}}, d),
            h('div',{style:{display:'flex', gap:5}}, [0,1,2,3,4,5,6,7].map(i=>LPI.drop('wwat-'+r+'-'+i, 14))))))),
        h('div',{style:{flex:'0 0 300px'}},
          h(LP.Eyebrow,{color:C.ink3}, 'Menú de autocuidado'),
          h('div',{style:{marginTop:8, display:'grid', gridTemplateColumns:'1fr 1fr', gap:7}}, careRows.map(i=>h('div',{key:i, style:{border:`1px solid ${C.line}`, borderRadius:4, padding:'7px 10px', background:C.paper}},
            LPI.field('care-d-'+i,{fontFamily:FONT.mono, fontSize:8, color:t.deep, letterSpacing:.5}),
            LPI.field('care-l-'+i,{fontFamily:FONT.serif, fontStyle:'italic', fontSize:14, color:C.ink, marginTop:1})))))
      )
    )
  );
}

/* ------------------------------------------------------------- Productivity */
function Productivity(props){
  const LP=window.LP, C=LP.C, FONT=LP.FONT; const t=LP.theme(props.theme);
  const LPI=window.LPI;
  const projectRows=Array.from({length:4},(_,i)=>i);
  const phases=['Idea','Plan','Diseño','Desarrollo','Revisión','Entrega'];
  const milestoneRows=Array.from({length:6},(_,i)=>i);
  const actionRows=Array.from({length:3},(_,i)=>i);
  return h(LP.Page,{theme:props.theme, tab:'Productividad', padding:0},
    h('div',{style:{display:'flex', height:'100%'}},
      // izquierda proyectos
      h('div',{style:{flex:'1 1 0', padding:'30px 26px 26px 40px', borderRight:`1px solid ${C.line}`, display:'flex', flexDirection:'column'}},
        h(LP.Eyebrow,{color:t.deep, line:false}, 'Proyectos'),
        h('div',{style:{fontFamily:FONT.serif, fontWeight:500, fontSize:40, color:C.ink, marginTop:2}}, 'Productividad'),
        h('div',{style:{marginTop:16, flex:1, display:'flex', flexDirection:'column', gap:12}},
          projectRows.map(i=>h('div',{key:i, className:'js-proj-card', style:{flex:1, border:`1px solid ${C.line}`, borderRadius:6, background:C.paper, padding:'13px 16px', display:'flex', flexDirection:'column', justifyContent:'center'}},
            h('div',{style:{display:'flex', alignItems:'center', justifyContent:'space-between', gap:10}},
              LPI.field('proj-name-'+i,{flex:1, fontFamily:FONT.serif, fontStyle:'italic', fontSize:22, color:C.ink}),
              h('span',{style:{flex:'none', fontFamily:FONT.mono, fontSize:8, letterSpacing:.8, color:t.deep, border:`1px solid ${t.mid}`, borderRadius:999, padding:'3px 9px', background:t.tint, textTransform:'uppercase'}},
                LPI.field('proj-status-'+i,{width:78, fontFamily:FONT.mono, fontSize:8, letterSpacing:.8, color:t.deep, textTransform:'uppercase', textAlign:'center'}))),
            h('div',{style:{display:'flex', alignItems:'center', gap:12, marginTop:9}},
              h('div',{style:{flex:1, height:6, borderRadius:3, background:C.lineSoft, overflow:'hidden'}},
                h('div',{className:'js-proj-bar', style:{height:'100%', width:'0%', background:t.mid}})),
              h('span',{className:'js-proj-pct', style:{fontFamily:FONT.mono, fontSize:11, color:t.deep, fontWeight:600}}, '0%')),
            h('div',{style:{display:'flex', gap:5, marginTop:9}}, phases.map((ph,j)=>h('span',{key:ph, style:{display:'flex', alignItems:'center', gap:4}},
              h(LP.CB,{theme:props.theme, size:11}),
              h('span',{style:{fontFamily:FONT.sans, fontSize:9.5, color:C.ink3}}, ph))))))),
      ),
      // derecha meta + hitos
      h('div',{style:{flex:'0 0 372px', padding:'30px 34px 26px 28px', display:'flex', flexDirection:'column', gap:14}},
        h('div',{style:{background:t.tint, border:`1px solid ${t.mid}`, borderRadius:6, padding:'14px 16px'}},
          h(LP.Eyebrow,{color:t.deep, line:false}, 'Desglose de meta'),
          h('div',{style:{marginTop:10, display:'flex', flexDirection:'column', gap:7}},
            [['Por qué','goal-porque'],['Resultado','goal-resultado'],['Responsable','goal-responsable'],['Fecha','goal-fecha']].map((r,i)=>h('div',{key:i, style:{display:'flex', alignItems:'baseline', gap:10}},
              h('span',{style:{fontFamily:FONT.mono, fontSize:8, letterSpacing:.8, color:t.deep, textTransform:'uppercase', width:78, flex:'none'}}, r[0]),
              LPI.field(r[1],{flex:1, fontFamily:FONT.sans, fontSize:13, color:t.ink, fontWeight:500}))))),
        h('div',{style:{flex:1}}, h(LP.Eyebrow,{color:C.ink3}, 'Hitos'),
          h('div',{style:{marginTop:12, position:'relative', paddingLeft:18}},
            h('div',{style:{position:'absolute', left:5, top:4, bottom:4, width:1, background:C.line}}),
            milestoneRows.map(i=>h('div',{key:i, style:{display:'flex', alignItems:'center', gap:12, padding:'8px 0', position:'relative'}},
              h('span',{style:{position:'absolute', left:-18, display:'flex'}}, h(LP.CB,{theme:props.theme, size:11})),
              LPI.field('mile-date-'+i,{width:48, flex:'none', fontFamily:FONT.mono, fontSize:9.5, color:t.deep}),
              LPI.field('mile-label-'+i,{flex:1, fontFamily:FONT.sans, fontSize:13, color:C.ink2}))))),
        h('div',null, h(LP.Eyebrow,{color:C.ink3}, 'Acciones de la semana'),
          h('div',{style:{marginTop:9, display:'flex', flexDirection:'column', gap:8}}, actionRows.map(i=>h('div',{key:i, style:{display:'flex', alignItems:'center', gap:9}},
            h(LP.CB,{theme:props.theme}), LPI.line('paction-'+i,{flex:1, fontFamily:FONT.sans, fontSize:12.5, color:C.ink2})))))
      )
    )
  );
}

/* ------------------------------------------------------------------- Notes */
function Notes(props){
  const LP=window.LP, C=LP.C, FONT=LP.FONT; const t=LP.theme(props.theme); const LPI=window.LPI;
  return h(LP.Page,{theme:props.theme, currentNav:'Notas', padding:0},
    h('div',{style:{display:'flex', height:'100%'}},
      // rayado
      h('div',{style:{flex:1, padding:'30px 26px 30px 40px', display:'flex', flexDirection:'column'}},
        h(LP.Eyebrow,{color:t.deep}, 'Rayado'),
        h('div',{style:{marginTop:18, flex:1, backgroundImage:`repeating-linear-gradient(${C.lineSoft} 0 1px, transparent 1px 24px)`, backgroundPositionY:'6px'}},
          LPI.area('notes-rayado',{lineHeight:'24px', fontSize:14, color:C.ink2}))),
      // lomo
      h('div',{style:{flex:'0 0 1px', background:C.line, margin:'30px 0', boxShadow:`-8px 0 14px -10px rgba(0,0,0,.10), 8px 0 14px -10px rgba(0,0,0,.10)`}}),
      // punteado
      h('div',{style:{flex:1, padding:'30px 38px 30px 26px', display:'flex', flexDirection:'column'}},
        h(LP.Eyebrow,{color:t.deep}, 'Punteado'),
        h('div',{style:{marginTop:18, flex:1, backgroundImage:`radial-gradient(${C.line} 1px, transparent 1.4px)`, backgroundSize:'18px 18px', backgroundPosition:'4px 8px'}},
          LPI.area('notes-punteado',{lineHeight:'18px', fontSize:13, color:C.ink2})))
    )
  );
}

/* ---------------------------------------------------------------- Stickers */
function Stickers(props){
  const LP=window.LP, C=LP.C, FONT=LP.FONT; const t=LP.theme(props.theme);
  const banners=['Hoy','Esta semana','Recordar','Metas','Hábitos','Dinero'];
  const prio=['urgente','luego','algún día','hecho','en espera'];
  const tags=['p1','p2','p3'];
  const moods=['😊','🙂','😐','😕','😞','😍'];
  const weather=['sun','cloud','drop','moon'];
  const trackers=[['Agua','drop'],['Pasos','target'],['Sueño','moon'],['Leer','book']];
  function sticker(child, style){ return h('div',{className:'lp-link', style:{boxShadow:'0 1px 2px rgba(0,0,0,.08)', borderRadius:6, ...style}}, child); }
  return h(LP.Page,{theme:props.theme, tab:'Estilo', padding:0},
    h('div',{style:{padding:'28px 36px 24px 40px', display:'flex', flexDirection:'column', height:'100%'}},
      h('div',{style:{display:'flex', alignItems:'flex-end', justifyContent:'space-between'}},
        h('div',null, h(LP.Eyebrow,{color:t.deep, line:false}, 'Hoja de stickers funcionales'),
          h('div',{style:{fontFamily:FONT.serif, fontWeight:500, fontSize:40, color:C.ink, marginTop:2}}, 'Stickers')),
        h('div',{style:{fontFamily:FONT.mono, fontSize:9, color:C.ink3}}, 'RECORTA & PEGA EN TU APP')),
      h('div',{style:{flex:1, display:'flex', gap:26, marginTop:20}},
        // col izq: banners + prioridad
        h('div',{style:{flex:'0 0 320px', display:'flex', flexDirection:'column', gap:16}},
          h('div',null, h(LP.Eyebrow,{color:C.ink3}, 'Banners de sección'),
            h('div',{style:{marginTop:10, display:'flex', flexDirection:'column', gap:9}}, banners.map((b,i)=>sticker(
              h('span',{style:{fontFamily:FONT.serif, fontStyle:'italic', fontSize:20, color:t.ink}}, b),
              {background:t.tint, border:`1px solid ${t.mid}`, padding:'9px 18px', textAlign:'center'})))),
          h('div',null, h(LP.Eyebrow,{color:C.ink3}, 'Prioridad & estado'),
            h('div',{style:{marginTop:10, display:'flex', flexWrap:'wrap', gap:8}},
              prio.map(p=>sticker(h('span',{style:{fontFamily:FONT.mono, fontSize:9, letterSpacing:.5, color:t.deep, textTransform:'uppercase'}}, p), {background:C.paper, border:`1px solid ${t.mid}`, padding:'6px 12px', borderRadius:999})),
              tags.map(tg=>sticker(h('span',{style:{fontFamily:FONT.mono, fontSize:9, color:C.paper}}, tg), {background:t.deep, padding:'6px 11px', borderRadius:999})),
              sticker(h(LP.Icon,{name:'flag', size:14, color:t.deep}), {background:C.paper, border:`1px solid ${t.mid}`, padding:'6px 10px'}),
              sticker(h(LP.Icon,{name:'star', size:14, color:t.deep, style:{fill:t.tint}}), {background:C.paper, border:`1px solid ${t.mid}`, padding:'6px 10px'})))),
        // col centro: mood + clima + trackers
        h('div',{style:{flex:'1 1 0', display:'flex', flexDirection:'column', gap:16}},
          h('div',null, h(LP.Eyebrow,{color:C.ink3}, 'Ánimo'),
            h('div',{style:{marginTop:10, display:'flex', gap:9}}, moods.map((m,i)=>sticker(h('span',{style:{fontSize:24}}, m), {background:C.paper, border:`1px solid ${C.line}`, width:48, height:48, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'50%'})))),
          h('div',null, h(LP.Eyebrow,{color:C.ink3}, 'Clima'),
            h('div',{style:{marginTop:10, display:'flex', gap:9}}, weather.map(w=>sticker(h(LP.Icon,{name:w, size:20, color:t.deep}), {background:t.tint, border:`1px solid ${t.mid}`, width:48, height:48, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'50%'})))),
          h('div',null, h(LP.Eyebrow,{color:C.ink3}, 'Mini-trackers'),
            h('div',{style:{marginTop:10, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10}}, trackers.map(tk=>sticker(
              h('div',{style:{display:'flex', flexDirection:'column', alignItems:'center', gap:5}},
                h(LP.Icon,{name:tk[1], size:18, color:t.deep}),
                h('span',{style:{fontFamily:FONT.serif, fontStyle:'italic', fontSize:14, color:C.ink}}, tk[0]),
                h('span',{style:{fontFamily:FONT.mono, fontSize:10, color:t.deep}}, '0/0')),
              {background:C.paper, border:`1px solid ${t.mid}`, padding:'14px 8px', aspectRatio:'1', display:'flex', alignItems:'center', justifyContent:'center'})))),
          h('div',{style:{flex:1}}, h(LP.Eyebrow,{color:C.ink3}, 'Notas & listas'),
            h('div',{style:{marginTop:10, display:'flex', gap:10, height:'calc(100% - 26px)'}},
              sticker(h('div',{style:{height:'100%', backgroundImage:`repeating-linear-gradient(${C.lineSoft} 0 1px, transparent 1px 18px)`, backgroundPositionY:'10px'}}), {flex:1, background:C.paper, border:`1px solid ${t.mid}`, padding:'10px 12px'}),
              sticker(h('div',{style:{display:'flex', flexDirection:'column', gap:8, paddingTop:4}}, [0,1,2,3].map(i=>h('div',{key:i, style:{display:'flex', alignItems:'center', gap:8}}, h(LP.CB,{theme:props.theme, on:false, size:13}), h('div',{style:{flex:1, height:1, background:C.lineSoft}})))), {flex:1, background:t.tint, border:`1px solid ${t.mid}`, padding:'10px 12px'}))))
      )
    )
  );
}

Object.assign(window, { HabitTracker, Finance, Wellness, Productivity, Notes, Stickers });
})();
