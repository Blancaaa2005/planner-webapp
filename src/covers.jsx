/* ============================================================================
   covers.jsx — Portada (1 diseño, 6 colorways)
   ========================================================================== */
function Cover(props){
  const LP = window.LP, C = LP.C, FONT = LP.FONT;
  const t = LP.theme(props.theme);

  // Detalle vegetal abstracto (3 trazos) — recoloreado por paleta
  const sprig = React.createElement('svg', { width:120, height:120, viewBox:'0 0 120 120', fill:'none',
      stroke:t.deep, strokeWidth:1.3, strokeLinecap:'round' },
    React.createElement('path', { d:'M60 112 C60 78 60 50 60 20' }),
    React.createElement('path', { d:'M60 64 C40 60 30 46 30 30 C50 32 60 46 60 64 M60 50 C80 46 90 32 90 18 C70 20 60 34 60 50 M60 84 C44 82 36 72 36 60 C52 62 60 72 60 84' , stroke:t.mid }),
    React.createElement('circle', { cx:60, cy:18, r:5, fill:t.tint, stroke:t.deep }));

  return React.createElement('div', { id: window.__PAGE_ID__, className:'lp-page lp-grain', style:{
      position:'relative', width:1080, height:810, background:C.cream, overflow:'hidden',
      fontFamily:FONT.sans, color:C.ink,
    } },
    // marco fino
    React.createElement('div', { style:{ position:'absolute', inset:26, border:`1px solid ${C.line}`, zIndex:1 } }),
    React.createElement('div', { style:{ position:'absolute', inset:33, border:`1px solid ${t.mid}`, zIndex:1 } }),

    React.createElement('div', { style:{ position:'absolute', inset:33, zIndex:2, display:'flex', flexDirection:'column',
        alignItems:'center', padding:'52px 70px' } },

      // eyebrow superior
      React.createElement('div', { style:{ display:'flex', alignItems:'center', gap:12, fontFamily:FONT.mono,
          fontSize:11, letterSpacing:3.5, color:C.ink3, textTransform:'uppercase' } },
        React.createElement('span', { style:{ width:6, height:6, borderRadius:'50%', background:t.deep } }),
        'Linen Paper Co.',
        React.createElement('span', { style:{ width:6, height:6, borderRadius:'50%', background:t.deep } })),

      React.createElement('div', { style:{ marginTop:6, fontFamily:FONT.mono, fontSize:9.5, letterSpacing:2.6, color:t.deep } }, 'EST · MMXXVI'),

      React.createElement('div', { style:{ flex:1 } }),

      // título
      React.createElement('div', { style:{ textAlign:'center', lineHeight:.92 } },
        React.createElement('div', { style:{ fontFamily:FONT.serif, fontWeight:500, fontSize:96, letterSpacing:1, color:C.ink } }, 'Planner'),
        React.createElement('div', { style:{ fontFamily:FONT.serif, fontStyle:'italic', fontWeight:500, fontSize:84, color:t.deep, marginTop:-6 } }, 'Digital'),
        React.createElement('div', { style:{ marginTop:14, fontFamily:FONT.mono, fontSize:13, letterSpacing:7, textTransform:'uppercase', color:C.ink2 } }, 'Todo en Uno')),

      React.createElement('div', { style:{ marginTop:30 } }, sprig),

      React.createElement('div', { style:{ flex:1 } }),

      // pie
      React.createElement('div', { style:{ width:'100%', display:'flex', alignItems:'flex-end', justifyContent:'space-between',
          borderTop:`1px solid ${C.line}`, paddingTop:18 } },
        React.createElement('div', null,
          React.createElement('div', { style:{ fontFamily:FONT.serif, fontStyle:'italic', fontSize:26, color:C.ink } }, t.name),
          React.createElement('div', { style:{ fontFamily:FONT.mono, fontSize:9.5, letterSpacing:1.5, color:C.ink3, marginTop:3 } }, 'PANTONE® '+t.pantone)),
        React.createElement('div', { style:{ display:'flex', gap:6, alignItems:'center' } },
          LP.THEME_ORDER.map(k=> React.createElement('a', { key:k, href:'#cover', 'data-swatch':k, className:'lp-link', style:{ width:13, height:13, borderRadius:'50%',
            background: LP.THEMES[k].mid, border:`1px solid ${LP.THEMES[k].deep}`,
            outlineOffset:2, display:'inline-block' } }))),
        React.createElement('div', { style:{ textAlign:'right', fontFamily:FONT.mono, fontSize:9.5, letterSpacing:1.5, color:C.ink3, lineHeight:1.7 } },
          React.createElement('div', null, 'SIN FECHAR'),
          React.createElement('div', { style:{ color:t.deep } }, 'INTERACTIVO · PDF'))
      )
    )
  );
}

Object.assign(window, { Cover });
