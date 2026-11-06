# Arquitetura

```
/
├── 2026/               edição de 2026: index.htm (fragmento do WordPress), obrigado.htm, assets/
├── 2027/               edição de 2027: index.html, obrigado.htm, css/, js/, assets/
├── site.json           qual edição responde na raiz
├── scripts/            build.mjs, preview.mjs, lib/ e testes
├── docs/
├── .github/            workflows de CI e deploy, templates de PR e issue
├── vercel.json
└── (arquivos soltos)   imagens que o WordPress carrega pelo endereço raw: não mexer
```

## Stack

| Camada     | Escolha                 | Por quê                                                   |
| ---------- | ----------------------- | --------------------------------------------------------- |
| Páginas    | HTML, CSS e JS puros    | Cada edição é um site pequeno; não precisa de framework   |
| Estilo     | Tailwind 3 (só em 2027) | `css/tailwind.css` gerado pelo `npm run css` e versionado |
| Build      | `scripts/build.mjs`     | Copia as edições, ajusta endereços e confere os arquivos  |
| Formatação | Prettier                | Scripts, docs e configs. As pastas das edições ficam fora |
| Testes     | `node --test`           | As funções do build, em `scripts/paginas.test.mjs`        |

Não há banco, API nem formulário. Todo destino de conversão é um link para
um domínio que já existe (checkout, WhatsApp, Typeform).

## Edições

Cada ano é uma pasta independente, com os próprios assets. Uma edição nova
começa como cópia da anterior ou do zero, sem mexer na que está no ar.

`site.json` diz qual edição responde na raiz. O build copia essa pasta para a
raiz do site **e** para `/<ano>/`, então os links das duas formas funcionam. Na
cópia de `/<ano>/` da edição atual, o canonical aponta para a raiz.

## Decisões que valem explicação

**2026 continua `index.htm`.** É o código colado no bloco HTML do WordPress
(privateday.auvp.com.br), sem `<html>` nem `<head>`. O arquivo fica intocado
para continuar sendo a cópia fiel do que está lá. No site montado ele vira
`index.html`, e o build insere as metas no começo do fragmento.

**Endereços raw do GitHub.** O WordPress não tem os assets: ele os carrega de
`raw.githubusercontent.com/eriadesign/privateday/main/...`. Por isso os
arquivos soltos na raiz, `2026/assets/` e os assets de `2027/` citados no
`obrigado.htm` não podem mudar de lugar enquanto o WordPress apontar para eles.

**`index.htm` que redireciona.** As páginas se chamavam `index.htm`. O build
grava um `index.htm` em cada pasta que redireciona para a pasta, mantendo
`?utm` e `#âncora`, para links antigos não quebrarem.

**Verificação de arquivos.** No fim do build, todo caminho local citado em
`src`, `href`, `srcset` e `url()` precisa existir no `dist/`. Comentários,
endereços externos e âncoras ficam de fora.

**Tailwind versionado.** O `2027/css/tailwind.css` fica no git para a página
abrir direto do arquivo, sem build. A CI gera de novo e falha se o resultado
mudar.

**`og:image` relativa.** No código, a imagem de compartilhamento é relativa à
página. O build a transforma em endereço absoluto a partir de `SITE_URL`, que é
o que Facebook, WhatsApp e LinkedIn exigem, e grava o `og:url` e o canonical.
