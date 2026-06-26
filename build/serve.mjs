/* Simple HTTP server to download the planner HTML. */
import http from 'http';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, '..', 'out', 'Planner-Digital-Todo-en-Uno.html');

const html = readFileSync(FILE);
const PORT = 3000;

http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/download') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } else if (req.url === '/Planner-Digital-Todo-en-Uno.html') {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': 'attachment; filename="Planner-Digital-Todo-en-Uno.html"'
    });
    res.end(html);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(PORT, () => {
  console.log(`
📄 Planner disponible en:
   • Abrir:       http://localhost:${PORT}
   • Descargar:   http://localhost:${PORT}/Planner-Digital-Todo-en-Uno.html

Presiona Ctrl+C para detener el servidor.
`);
});
