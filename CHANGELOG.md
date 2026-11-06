# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [Não publicado]

### Estrutura do repositório (nov/2026)

- **Build em `dist/`:** `npm run build` monta o site com a edição atual na
  raiz e cada edição na sua pasta. A edição da raiz sai de `site.json`, no
  lugar do `index.htm` que redirecionava.
- **Publicação por GitHub Actions** no Pages, mais `vercel.json` e o workflow
  de AWS (S3 + CloudFront), que liga quando as variáveis da conta existirem.
- **CI em todo PR:** formatação, testes, Tailwind de 2027 atualizado e build,
  que falha se algum arquivo citado nas páginas não existir.
- **`2027/index.htm` passa a `index.html`.** Links antigos para `index.htm`
  redirecionam para a pasta.
- `og:image` de 2027 relativa no código; o build grava o endereço completo.
- Prettier, `.editorconfig`, `.nvmrc`, docs, CONTRIBUTING e templates de PR e
  issue, no padrão do repositório de páginas da AUVP.

## Edição de 2027 (nov/2026)

- Copy nova em todas as dobras, dobra de palestras refeita, favicon do design
  system e links de compra no ingresso e na pílula.
- Endereço raiz de volta para 2026 até o lançamento de 2027.
