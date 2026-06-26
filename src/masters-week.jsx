/* ============================================================================
   masters-week.jsx — WeeklySpread(weekStart)  ·  página única 1080×810
   weekStart: 1 = lunes, 0 = domingo  (ambos coexisten)
   ========================================================================== */
(function(){
const h = React.createElement;

function WeeklySpread(props){
  const LP=window.LP, C=LP.C, FONT=LP.FONT; const t=LP.theme(props.theme);
  const LPI = window.LPI;
  const weekStart = Number(props.weekStart!=null ? props.weekStart : 1); // 1=lun, 0=dom
  const weekNo = props.weekNo || '';
  const ABBR_MON=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  const ABBR_SUN=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const abbr = weekStart===1 ? ABBR_MON : ABBR_SUN;
  const weekendIdx = weekStart===1 ? [5,6] : [0,6];

  function dayCol(i){
    const wknd = weekendIdx.includes(i);
    return h('div',{key:i, style:{flex:1, minWidth:0, borderRight: i<6?`1px solid ${C.lineSoft}`:'none',
      padding:'0 9px', display:'flex', flexDirection:'column'}},
      h('div',{style:{display:'flex', alignItems:'baseline', gap:6, paddingBottom:8, borderBottom:`1px solid ${wknd?t.mid:C.line}`}},
        h('span',{style:{fontFamily:FONT.mono, fontSize:8.5, letterSpacing:1, textTransform:'uppercase', color: wknd?t.deep:C.ink3}}, abbr[i]),
        LPI.field('wnum-'+i,{width:42, marginLeft:'auto', textAlign:'right', fontFamily:FONT.serif, fontStyle:'italic', fontSize:30, lineHeight:.8, color: wknd?t.deep:C.ink})),
      h('div',{style:{paddingTop:8, display:'flex', flexDirection:'column'}},
        [0,1,2,3,4,5].map(r=>h('div',{key:r, style:{display:'flex', alignItems:'center', gap:6, padding:'7px 0', borderBottom:`1px solid ${C.lineSoft}`}},
          h(LP.CB,{theme:props.theme, size:12}),
          LPI.line('wd'+i+'-'+r,{flex:1, fontFamily:FONT.sans, fontSize:10.5, color:C.ink2})))));
  }

  return h(LP.Page,{theme:props.theme, currentNav:'Semana', padding:0},
    h('div',{style:{display:'flex', flexDirection:'column', height:'100%'}},
      // cabecera
      h('div',{style:{padding:'24px 36px 12px 40px', display:'flex', alignItems:'flex-end', justifyContent:'space-between'}},
        h('div',null,
          h(LP.Eyebrow,{color:t.deep, line:false}, 'Plan semanal · sin fechar'),
          h('div',{style:{display:'flex', alignItems:'baseline', gap:14, marginTop:3}},
            h('div',{style:{fontFamily:FONT.serif, fontWeight:500, fontSize:42, color:C.ink, lineHeight:1}}, 'Semana'),
            h('div',{style:{fontFamily:FONT.serif, fontStyle:'italic', fontSize:24, color:t.deep}}, weekStart===1?'inicio lunes':'inicio domingo'))),
        h('div',{style:{fontFamily:FONT.mono, fontSize:9, color:C.ink3, textAlign:'right', lineHeight:1.6}},
          h('div',null,'SEMANA '+(weekNo||'____')+' / 52'), h('div',{style:{color:t.deep}}, weekStart===1?'L → D':'D → S'))),
      // 7 columnas
      h('div',{style:{flex:1, display:'flex', padding:'4px 30px 0 32px', minHeight:0}},
        [0,1,2,3,4,5,6].map(dayCol)),
      // tira inferior
      h('div',{style:{flex:'0 0 196px', display:'flex', gap:0, borderTop:`1px solid ${C.line}`, marginTop:8}},
        // Top 3
        h('div',{style:{flex:'0 0 280px', padding:'16px 26px 16px 40px', borderRight:`1px solid ${C.line}`}},
          h(LP.Eyebrow,{color:t.deep}, 'Top 3 · semana'),
          h('div',{style:{marginTop:12, display:'flex', flexDirection:'column', gap:11}}, [0,1,2].map(i=>h('div',{key:i, style:{display:'flex', alignItems:'center', gap:10}},
            h('span',{style:{fontFamily:FONT.serif, fontStyle:'italic', fontSize:22, color:t.deep, width:16}}, i+1),
            h(LP.CB,{theme:props.theme}),
            LPI.line('wtop-'+i,{flex:1, fontFamily:FONT.sans, fontSize:13, color:C.ink2}))))),
        // Hábitos
        h('div',{style:{flex:1, padding:'16px 26px', borderRight:`1px solid ${C.line}`}},
          h(LP.Eyebrow,{color:t.deep}, 'Hábitos'),
          h('div',{style:{marginTop:10}},
            h('div',{style:{display:'grid', gridTemplateColumns:'96px repeat(7,1fr)', alignItems:'center', marginBottom:5}},
              h('span',null), abbr.map((a,i)=>h('span',{key:i, style:{fontFamily:FONT.mono, fontSize:7.5, textAlign:'center', color: weekendIdx.includes(i)?t.deep:C.ink4}}, a))),
            [0,1,2,3].map(r=>h('div',{key:r, style:{display:'grid', gridTemplateColumns:'96px repeat(7,1fr)', alignItems:'center', padding:'4px 0', borderTop:`1px solid ${C.lineSoft}`}},
              LPI.field('whabit-'+r,{fontFamily:FONT.sans, fontSize:11, color:C.ink2}),
              [0,1,2,3,4,5,6].map(c=>h('div',{key:c, style:{display:'flex', justifyContent:'center'}}, h(LP.CB,{theme:props.theme, size:12}))))))),
        // Notas
        h('div',{style:{flex:'0 0 280px', padding:'16px 38px 16px 26px'}},
          h(LP.Eyebrow,{color:C.ink3}, 'Notas'),
          h('div',{style:{marginTop:14, display:'flex', flexDirection:'column', gap:16}}, [0,1,2,3,4].map(i=>LPI.line('wnote-'+i,{fontFamily:FONT.sans, fontSize:11, color:C.ink2}))))
      )
    )
  );
}

Object.assign(window, { WeeklySpread });
})();
