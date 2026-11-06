/**
 * Funções puras que o build aplica ao HTML das páginas. Ficam aqui, separadas
 * de scripts/build.mjs, para terem teste próprio (scripts/paginas.test.mjs).
 */
import { readdir } from "node:fs/promises";

/** Pastas de edição: uma por ano, com quatro dígitos (`2026/`, `2027/`...). */
export async function listarEdicoes(raiz) {
  const itens = await readdir(raiz, { withFileTypes: true });
  return itens
    .filter((i) => i.isDirectory() && /^\d{4}$/.test(i.name))
    .map((i) => i.name)
    .sort();
}

/**
 * Insere `trecho` logo depois de `<head>`. A página de 2026 é um fragmento
 * colado no WordPress, sem `<head>`: nesse caso o trecho vai no começo.
 */
export function noHead(html, trecho) {
  return /<head[^>]*>/i.test(html)
    ? html.replace(/<head[^>]*>/i, (tag) => `${tag}\n    ${trecho}`)
    : `${trecho}\n${html}`;
}

/** Deixa no HTML só um canonical, apontando para `href`. */
export function trocarCanonical(html, href) {
  const sem = html.replace(
    /[ \t]*<link\b[^>]*\brel\s*=\s*["']?canonical\b[^>]*>\n?/gi,
    "",
  );
  return noHead(sem, `<link rel="canonical" href="${href}">`);
}

/** Troca (ou cria) a meta `og:url`. */
export function trocarOgUrl(html, href) {
  const meta = `<meta property="og:url" content="${href}">`;
  return /<meta\s+property="og:url"[^>]*>/i.test(html)
    ? html.replace(/<meta\s+property="og:url"[^>]*>/gi, meta)
    : html;
}

/**
 * Imagem de compartilhamento em endereço absoluto, como Facebook, WhatsApp e
 * LinkedIn exigem. No código ela fica relativa à página; `pagina` é o endereço
 * completo da pasta da página, terminado em `/`.
 */
export function absolutizarImagens(html, pagina) {
  return html.replace(
    /(<meta\s+(?:property|name)="(?:og:image|og:image:secure_url|twitter:image)"\s+content=")([^"]+)(")/g,
    (_, antes, valor, depois) =>
      antes +
      (/^https?:/.test(valor) ? valor : new URL(valor, pagina).href) +
      depois,
  );
}

/** Homologação: `noindex, nofollow` no lugar de qualquer robots da página. */
export function aplicarNoindex(html) {
  const robots = '<meta name="robots" content="noindex, nofollow">';
  return /<meta\s+name="robots"[^>]*>/i.test(html)
    ? html.replace(/<meta\s+name="robots"[^>]*>/gi, robots)
    : noHead(html, robots);
}

/** Página mínima que manda o visitante para `destino`, mantendo ?query e #hash. */
export function redirecionamento(destino) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <title>AUVP Private Day</title>
    <meta name="robots" content="noindex">
    <meta http-equiv="refresh" content="0; url=${destino}">
    <script>location.replace(${JSON.stringify(destino)} + location.search + location.hash);</script>
</head>
<body>
    <p><a href="${destino}">AUVP Private Day</a></p>
</body>
</html>
`;
}

/**
 * Caminhos locais citados em `src`, `href`, `srcset` e `url()`: o que precisa
 * existir no site montado. Endereços com protocolo, âncoras (inclusive a
 * `%23` de SVG embutido), `mailto:` e `tel:` ficam de fora, assim como o que
 * estiver dentro de comentário.
 */
export function caminhosLocais(conteudo) {
  const texto = conteudo
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");
  const valores = [];
  for (const m of texto.matchAll(/\s(?:src|href)\s*=\s*"([^"]*)"/gi)) {
    valores.push(m[1]);
  }
  for (const m of texto.matchAll(/\ssrcset\s*=\s*"([^"]*)"/gi)) {
    for (const parte of m[1].split(","))
      valores.push(parte.trim().split(/\s+/)[0]);
  }
  // `url(` minúsculo e fora de palavra: `new URL(...)` do JavaScript não entra.
  for (const m of texto.matchAll(
    /(?<![\w.])url\(\s*['"]?([^'")]+)['"]?\s*\)/g,
  )) {
    valores.push(m[1]);
  }
  return [
    ...new Set(
      valores
        .map((v) => v.trim())
        .filter(
          (v) => v && !/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|%23|\?|\{|\$)/i.test(v),
        )
        .map((v) => v.split(/[?#]/)[0])
        .filter(Boolean),
    ),
  ];
}
