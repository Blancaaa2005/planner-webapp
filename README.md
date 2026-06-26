# Planner Digital · Todo en Uno

Web-app **en blanco** e interactiva generada a partir del bundle de Claude Design
«Planner Digital Todo en Uno». Es un único archivo HTML autocontenido: se abre con
doble clic, funciona sin conexión y guarda todo lo que escribes en el propio
navegador.

## Generar la web-app y descargarla

Necesitas [Node.js](https://nodejs.org) 18 o superior. Desde esta carpeta:

```bash
npm install
npm run build:planner
```

El resultado queda en `out/Planner-Digital-Todo-en-Uno.html`.

### Descargar por HTTP

Para servir el archivo y descargarlo por HTTP (útil para compartir):

```bash
npm run serve
```

Se abre un servidor en `http://localhost:3000`. Puedes:
- **Abrir** en el navegador: `http://localhost:3000`
- **Descargar**: `http://localhost:3000/Planner-Digital-Todo-en-Uno.html`

Presiona **Ctrl+C** para detener el servidor.

### Notas

Ese archivo `.html` es el entregable. Mándalo tal cual al cliente (o ábrelo con doble clic).
La primera vez, `build:planner` descarga e incrusta las tipografías de Google como
woff2 en base64; quedan cacheadas en `assets/fonts/` para las siguientes compilaciones,
así que el resto de builds funcionan **sin red**.

## Cómo se usa (cliente final)

- **Doble clic** sobre el `.html`. Se abre en Chrome, Safari (iPad) o Android sin
  instalar nada y sin conexión.
- Una **barra superior** permite moverse: `‹ / ›` página anterior/siguiente, **Índice**,
  **Calendario**, los **6 colores** de tema, **Exportar**, **Importar**, **Borrar página**,
  **Borrar todo** e **Imprimir**. También se puede navegar con las flechas **← / →**
  del teclado (cuando no estás escribiendo en un campo).
- Todo lo que escribas o marques (textos, casillas, gotas de agua, cuadrículas de
  hábitos…) se guarda automáticamente en el navegador (`localStorage`) y reaparece al
  reabrir el archivo.
- Los **valores derivados** se calculan solos: total y «queda» en Finanzas, gasto por
  categoría según el registro, sumas de hábitos, % de proyectos, barras de bienestar, etc.
- **Exportar** descarga un `.json` con todos tus datos; **Importar** lo vuelve a cargar
  (útil para copia de seguridad o pasar de un dispositivo a otro).
- **Imprimir** genera un PDF con todas las páginas (una por hoja, 1080×810).

## Estructura del planner

Sin fechar (la configuración elegida es **modo tema *live*** y **opción B**):

- Portada · Índice · Vista anual
- **12 meses** (por nombre) + **52 semanas** (numeradas, inicio en **lunes**) + 1 plantilla de **Día**
- Una página de cada sección: Hábitos · Finanzas · Bienestar · Productividad · Notas

## Cambiar idioma o textos

Todo el contenido vive en los componentes del bundle, en `src/`:

- `src/brand.jsx` — sistema de marca: colores, tipografías, paletas (`THEMES`),
  nombres de meses/días, navegación.
- `src/covers.jsx` — portada.
- `src/masters-core.jsx` — Índice, Vista anual, Mes, Día.
- `src/masters-week.jsx` — Semana.
- `src/masters-extras.jsx` — Hábitos, Finanzas, Bienestar, Productividad, Notas.

Las etiquetas fijas (cabeceras como «Prioridades», nombres de los meses, etc.) son
texto normal en esos archivos: edítalas y vuelve a ejecutar `npm run build:planner`.
Para cambiar **paletas** o **tipografías**, edita `THEMES` y `FONT` en `src/brand.jsx`.

> Las zonas donde el cliente escribe son campos en blanco (`input` / `textarea`); no
> contienen datos de ejemplo. No hace falta tocarlas para «vaciarlas»: ya salen vacías.

## Cómo está montado (para quien mantenga el código)

- `build/build-planner.mjs` — orquesta todo: concatena los `src/*.jsx` en el orden del
  host, añade `build/interactive.jsx`, compila con esbuild, renderiza cada página a HTML
  estático, convierte el tema «sentinela» a variables CSS y ensambla el HTML final con
  fuentes, temas, runtime y configuración embebidos.
- `build/interactive.jsx` — se añade **después** del bundle y sustituye, en tiempo de
  build, las primitivas compartidas (`Page`, `TopNav`, `SideTabs`, `CB`) por versiones
  con anclas `<a>` reales y casillas reales, define los ayudantes de campos en blanco
  (`window.LPI`) y el orden de páginas.
- `build/runtime.js` — router por hash, persistencia en `localStorage`, cambio de tema
  en vivo, escalado al viewport, barra de herramientas y recálculo de valores derivados.
- `build/runtime.css` — estilos de la barra, el «escenario», los campos y las casillas.
- `build/fetch-fonts.mjs` — descarga e incrusta las tipografías una sola vez.
- `build/validate.mjs` — prueba de humo con Playwright contra el `file://` generado
  (navegación, persistencia, temas, valores derivados, cero red). Ejecútala con
  `node build/validate.mjs` tras una compilación.

El tamaño del HTML resultante (~4,6 MB, casi todo tipografías) queda muy por debajo del
presupuesto de 25 MB.
