import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const args = process.argv.slice(2);
const valueAfter = (flag, fallback) => {
  const index = args.indexOf(flag);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};
const host = valueAfter('--host', '127.0.0.1');
const port = Number(valueAfter('--port', '4173'));
const root = process.cwd();
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.webp': 'image/webp',
};

createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const safePath = normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, '');
  let filePath = join(root, safePath === '/' ? 'index.html' : safePath);
  const looksLikeFile = extname(safePath) !== '' || safePath.startsWith('/docs/');
  if (!filePath.startsWith(root) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
    if (looksLikeFile) {
      response.statusCode = 404;
      response.end('Not found');
      return;
    }
    filePath = join(root, 'index.html');
  }
  response.setHeader('Content-Type', mime[extname(filePath)] || 'application/octet-stream');
  response.setHeader('Cache-Control', 'no-store');
  createReadStream(filePath).pipe(response);
}).listen(port, host, () => {
  console.log(`MARKOVLAB preview listening on ${host}:${port}`);
});
