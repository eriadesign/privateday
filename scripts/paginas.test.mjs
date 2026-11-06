import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import {
  absolutizarImagens,
  aplicarNoindex,
  caminhosLocais,
  listarEdicoes,
  noHead,
  redirecionamento,
  trocarCanonical,
  trocarOgUrl,
} from "./lib/paginas.mjs";

test("listarEdicoes pega só as pastas de ano, em ordem", async () => {
  const pasta = await mkdtemp(path.join(tmpdir(), "edicoes-"));
  try {
    for (const nome of ["2027", "2026", "scripts", "202", "docs"]) {
      await mkdir(path.join(pasta, nome));
    }
    assert.deepEqual(await listarEdicoes(pasta), ["2026", "2027"]);
  } finally {
    await rm(pasta, { recursive: true, force: true });
  }
});

test("noHead insere depois do <head>, ou no começo de um fragmento", () => {
  assert.equal(
    noHead("<html><head><title>x</title></head></html>", "<meta a>"),
    "<html><head>\n    <meta a><title>x</title></head></html>",
  );
  assert.equal(
    noHead("<div>fragmento</div>", "<meta a>"),
    "<meta a>\n<div>fragmento</div>",
  );
});

test("trocarCanonical deixa um canonical só", () => {
  const html =
    '<head>\n    <link rel="canonical" href="2027/">\n<title>x</title></head>';
  const novo = trocarCanonical(html, "https://site/");
  assert.equal(novo.match(/rel="canonical"/g).length, 1);
  assert.match(novo, /href="https:\/\/site\/"/);
});

test("trocarOgUrl só mexe na meta que existe", () => {
  assert.equal(
    trocarOgUrl('<meta property="og:url" content="velha">', "nova"),
    '<meta property="og:url" content="nova">',
  );
  assert.equal(trocarOgUrl("<head></head>", "nova"), "<head></head>");
});

test("absolutizarImagens resolve a og:image relativa à página", () => {
  const html =
    '<meta property="og:image" content="assets/capa.webp">' +
    '<meta name="twitter:image" content="https://cdn/x.png">';
  const novo = absolutizarImagens(html, "https://site/2027/");
  assert.match(novo, /content="https:\/\/site\/2027\/assets\/capa\.webp"/);
  assert.match(novo, /content="https:\/\/cdn\/x\.png"/);
});

test("aplicarNoindex troca o robots existente ou cria um", () => {
  assert.equal(
    aplicarNoindex('<head><meta name="robots" content="index"></head>'),
    '<head><meta name="robots" content="noindex, nofollow"></head>',
  );
  assert.match(aplicarNoindex("<head></head>"), /noindex, nofollow/);
});

test("redirecionamento leva ao destino com query e hash", () => {
  const html = redirecionamento("./");
  assert.match(html, /url=\.\//);
  assert.match(html, /location\.replace\("\.\/" \+ location\.search/);
});

test("caminhosLocais ignora endereços externos, âncoras e mailto", () => {
  const html = `
    <img src="assets/sol.png" srcset="assets/a.webp 1x, assets/b.webp 2x">
    <a href="#topo"></a><a href="https://x.com"></a><a href="mailto:a@b">
    <link href="css/estilos.css?v=2">
    <div style="background:url('assets/fundo.png')"></div>
    <a href="//cdn.com/x.js"></a>`;
  assert.deepEqual(caminhosLocais(html).sort(), [
    "assets/a.webp",
    "assets/b.webp",
    "assets/fundo.png",
    "assets/sol.png",
    "css/estilos.css",
  ]);
});

test("caminhosLocais ignora comentários, %23 de SVG e URL() do JavaScript", () => {
  const texto = `
    /* @font-face { src: url('../assets/sem-licenca.ttf'); } */
    <!-- <img src="assets/velha.png"> -->
    .grao { background: url("data:image/svg+xml,<rect filter='url(%23ruido)'/>"); }
    <script>var origem = new URL(document.referrer);</script>
    .sol { background: url(assets/sol.png); }`;
  assert.deepEqual(caminhosLocais(texto), ["assets/sol.png"]);
});
