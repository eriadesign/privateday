/**
 * Serve `dist/` localmente para conferir o build antes do deploy.
 *
 *     npm run build && npm run preview     # http://localhost:4173
 *     npm run preview -- outra/pasta       # serve outra pasta no lugar de dist/
 *
 * Imita o que Pages, Vercel e AWS fazem: `/pasta/` responde com
 * `pasta/index.html`, e pasta sem barra final redireciona para a com barra.
 */
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const dist = path.resolve(
  process.argv[2] ?? path.join(import.meta.dirname, "../dist"),
);
const porta = Number(process.env.PORT) || 4173;

const tipos = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".otf": "font/otf",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
};

async function resolver(caminhoUrl) {
  const arquivo = path.join(dist, decodeURIComponent(caminhoUrl));
  if (!arquivo.startsWith(dist)) return null;
  const info = await stat(arquivo).catch(() => null);
  if (info?.isFile()) return arquivo;
  if (info?.isDirectory()) return resolver(path.join(caminhoUrl, "index.html"));
  return null;
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, "http://localhost");
  const info = await stat(path.join(dist, decodeURIComponent(pathname))).catch(
    () => null,
  );
  if (info?.isDirectory() && !pathname.endsWith("/")) {
    res.writeHead(301, { Location: `${pathname}/` }).end();
    return;
  }
  const arquivo = await resolver(pathname);
  if (!arquivo) {
    res.writeHead(404, { "Content-Type": "text/plain" }).end("404");
    return;
  }
  res.writeHead(200, {
    "Content-Type":
      tipos[path.extname(arquivo).toLowerCase()] ?? "application/octet-stream",
  });
  createReadStream(arquivo).pipe(res);
}).listen(porta, () => console.log(`dist/ em http://localhost:${porta}`));
