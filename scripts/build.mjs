/**
 * Monta o site completo em `dist/`:
 *
 *     dist/index.html        a edição atual (site.json), servida na raiz
 *     dist/<ano>/            cada edição, com todas as páginas e assets
 *     dist/**\/index.htm      redireciona para a pasta: cobre os links antigos,
 *                            de quando as páginas se chamavam index.htm
 *
 * A mesma pasta serve o GitHub Pages, a Vercel e a AWS. O que muda entre eles
 * vem do ambiente:
 *
 * - `SITE_BASE_PATH`: subcaminho do site. No Pages de repositório de projeto é
 *   `/<repo>`; na Vercel e em domínio próprio fica vazio. Hoje as páginas só
 *   usam caminhos relativos, então ele só aparece no log.
 * - `SITE_URL`: endereço público. Com ele, o build grava canonical, og:url e
 *   og:image absolutos. Na Vercel, se ausente, sai de
 *   `VERCEL_PROJECT_PRODUCTION_URL`.
 * - `SITE_INDEXAVEL`: só com `true` o site pode ser indexado. Sem ela, todo
 *   HTML sai com `noindex, nofollow` e a raiz ganha um robots.txt que bloqueia
 *   tudo. Com ela, cada página mantém o robots que tiver no código (a de 2027
 *   segue com noindex até o lançamento).
 *
 * No fim, confere se todo caminho local citado no HTML e no CSS existe no site
 * montado. Qualquer arquivo faltando derruba o build com a lista.
 *
 * Ver docs/DEPLOY.md.
 */
import {
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
  absolutizarImagens,
  aplicarNoindex,
  caminhosLocais,
  listarEdicoes,
  redirecionamento,
  trocarCanonical,
  trocarOgUrl,
} from "./lib/paginas.mjs";

const raiz = path.resolve(import.meta.dirname, "..");
const dist = path.join(raiz, "dist");

// A action `configure-pages` devolve "/" quando o site fica na raiz.
const base = (process.env.SITE_BASE_PATH ?? "").replace(/\/+$/, "");
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = (
  process.env.SITE_URL || (vercelUrl ? `https://${vercelUrl}` : "")
).replace(/\/+$/, "");
const indexavel = process.env.SITE_INDEXAVEL === "true";

function falhar(titulo, erros) {
  console.error(`\n${titulo}\n${erros.map((e) => `  - ${e}`).join("\n")}\n`);
  process.exit(1);
}

const { edicaoAtual } = JSON.parse(
  await readFile(path.join(raiz, "site.json"), "utf8"),
);
const edicoes = await listarEdicoes(raiz);
if (!edicoes.includes(edicaoAtual)) {
  falhar("site.json com problema:", [
    `edicaoAtual é "${edicaoAtual}", mas as pastas de edição são: ${edicoes.join(", ")}`,
  ]);
}

// Arquivos de ferramenta que ficam no repositório e não vão para o site.
const foraDoSite = new Set(["tailwind.config.js"]);

/** Copia a pasta de uma edição para `destino`, com a página em index.html. */
async function copiarEdicao(ano, destino) {
  const origem = path.join(raiz, ano);
  await cp(origem, destino, {
    recursive: true,
    filter: (arquivo) => !foraDoSite.has(path.basename(arquivo)),
  });
  // 2026 ainda se chama index.htm: é o mesmo arquivo colado no WordPress e
  // fica intocado. No site ela vira index.html, e o index.htm passa a
  // redirecionar, para não quebrar link antigo.
  const htm = path.join(destino, "index.htm");
  const html = path.join(destino, "index.html");
  const temHtm = await stat(htm).catch(() => null);
  const temHtml = await stat(html).catch(() => null);
  if (temHtm && !temHtml) await cp(htm, html);
  await writeFile(htm, redirecionamento("./"));
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const ano of edicoes) await copiarEdicao(ano, path.join(dist, ano));
// A edição atual também responde na raiz, com os próprios assets ao lado.
await copiarEdicao(edicaoAtual, dist);

// O Pages processa o site com Jekyll por padrão, e o Jekyll ignora pastas
// iniciadas por underscore. Nada aqui depende disso hoje, mas desligar evita
// a surpresa no dia em que depender.
await writeFile(path.join(dist, ".nojekyll"), "");

const arquivos = (await readdir(dist, { recursive: true })).map((f) =>
  f.split(path.sep).join("/"),
);
const paginas = arquivos.filter((f) => /\.html?$/.test(f));

for (const arquivo of paginas) {
  const caminho = path.join(dist, arquivo);
  let html = await readFile(caminho, "utf8");
  const original = html;
  const pasta = path.posix.dirname(arquivo);

  if (siteUrl && !arquivo.endsWith("index.htm")) {
    const pagina = `${siteUrl}/${pasta === "." ? "" : `${pasta}/`}`;
    html = absolutizarImagens(html, pagina);
    if (path.posix.basename(arquivo) === "index.html") {
      // A pasta da edição atual repete a raiz: as duas apontam para a raiz.
      const principal = pasta === "." || pasta === edicaoAtual;
      const endereco = principal ? `${siteUrl}/` : pagina;
      html = trocarOgUrl(trocarCanonical(html, endereco), endereco);
    }
  }
  if (!indexavel) html = aplicarNoindex(html);

  if (html !== original) await writeFile(caminho, html);
}

if (!indexavel) {
  await writeFile(
    path.join(dist, "robots.txt"),
    "# Homologação: nada aqui deve ser indexado.\nUser-agent: *\nDisallow: /\n",
  );
  console.log(`noindex aplicado em ${paginas.length} páginas (homologação)`);
}

// Todo caminho local citado no HTML e no CSS precisa existir no site montado.
const existentes = new Set(arquivos);
const faltando = [];
for (const arquivo of arquivos.filter((f) => /\.(html?|css)$/.test(f))) {
  const texto = await readFile(path.join(dist, arquivo), "utf8");
  const pasta = path.posix.dirname(arquivo);
  for (const ref of caminhosLocais(texto)) {
    let alvo = path.posix.normalize(
      path.posix.join(pasta, decodeURIComponent(ref)),
    );
    if (ref.endsWith("/") || alvo === ".") {
      alvo = path.posix.join(alvo, "index.html");
    }
    if (!existentes.has(alvo)) faltando.push(`${arquivo}: ${ref}`);
  }
}
if (faltando.length)
  falhar("Arquivos citados que não existem no site:", faltando);

console.log(
  `edições: ${edicoes.join(", ")} (na raiz: ${edicaoAtual})` +
    `\nSite montado em ${dist} (base "${base || "/"}"${siteUrl ? `, ${siteUrl}` : ""})`,
);
