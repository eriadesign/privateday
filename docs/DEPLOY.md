# Publicação

O repositório gera **um único site estático** em `dist/`:

| Caminho         | Origem                                                   |
| --------------- | -------------------------------------------------------- |
| `/`             | a pasta da edição atual (`edicaoAtual` em `site.json`)   |
| `/<ano>/`       | cada pasta de edição (`2026/`, `2027/`), copiada inteira |
| `/**/index.htm` | redireciona para a pasta, para links antigos             |

A mesma pasta serve o **GitHub Pages**, a **Vercel** e a **AWS**. Quem monta
tudo é `scripts/build.mjs`, chamado por `npm run build`.

---

## Lançar uma edição

1. No `index.html` da edição nova, tire a linha
   `<meta name="robots" content="noindex">` e confira o checklist de
   [CONTENT.md](CONTENT.md).
2. Em `site.json`, troque `edicaoAtual` pelo ano novo.
3. Abra o PR. Depois do merge, a raiz passa a abrir a edição nova em poucos
   minutos, e a anterior continua no seu endereço (`/2026/`).

A edição anterior não precisa de nenhuma mudança: o canonical de cada página é
gravado pelo build.

---

## Indexação

O `scripts/build.mjs` só deixa o site ser indexado com `SITE_INDEXAVEL=true`.
Sem ela, todo HTML sai com `<meta name="robots" content="noindex, nofollow">` e
a raiz ganha um `robots.txt` que bloqueia tudo: é o modo homologação, o padrão
de qualquer build local ou de preview.

O Pages e a AWS são os endereços públicos, então os dois workflows definem
`SITE_INDEXAVEL: "true"`. Nesse modo cada página mantém o robots que tem no
código: a de 2027 segue com `noindex` até o lançamento. Na Vercel, crie a
variável em **Settings → Environment Variables** se ela for um endereço público.

---

## GitHub Pages

Publicado pelo workflow `.github/workflows/deploy.yml` a cada push na `main`.

**Endereço:** <https://eriadesign.github.io/privateday/>.

### Ativação (uma vez só)

1. Abra **Settings → Pages** no repositório.
2. Em **Source**, escolha **GitHub Actions** (não "Deploy from a branch").
3. Pronto. O próximo push na `main` publica.

Enquanto a fonte for "Deploy from a branch", o Pages publica a pasta do
repositório como está, sem build: a raiz fica sem página.

Para publicar sem esperar um commit novo: **Actions → Deploy no GitHub Pages →
Run workflow**.

### Como o build sabe o endereço

O workflow pergunta ao próprio GitHub, pela action `configure-pages`, e repassa
ao build:

| Variável         | Vai para                                           | Exemplo no Pages                          |
| ---------------- | -------------------------------------------------- | ----------------------------------------- |
| `SITE_BASE_PATH` | log do build (as páginas só usam caminho relativo) | `/privateday`                             |
| `SITE_URL`       | canonical, og:url e og:image absolutos             | `https://eriadesign.github.io/privateday` |

Nada fica fixado no código. No dia em que um domínio próprio for configurado, a
action passa a devolver o domínio e o build se ajusta sozinho.

---

## Vercel

Configurada por `vercel.json`. Basta importar o repositório na Vercel uma vez
(**Add New → Project**): o arquivo já define install, build e pasta de saída.

Na Vercel o site fica na raiz do domínio. A URL canônica sai de
`VERCEL_PROJECT_PRODUCTION_URL`, que a Vercel define sozinha. Para fixar outra
(domínio próprio, por exemplo), crie a variável `SITE_URL` em **Settings →
Environment Variables**. Cada PR ganha um preview com todas as edições.

**Cabeçalhos.** O `vercel.json` manda em todas as páginas `X-Frame-Options:
SAMEORIGIN`, `X-Content-Type-Options: nosniff` e `Referrer-Policy:
strict-origin-when-cross-origin`. Os assets não têm hash no nome, então não
recebem cache longo.

---

## AWS (S3 + CloudFront)

Workflow `.github/workflows/deploy-aws.yml`, a cada push na `main`. Ele só roda
depois que a variável `SITE_DISTRIBUTION_ID` existir no repositório. Crie, em
**Settings → Secrets and variables → Actions → Variables**:

| Variável               | O que é                                                 |
| ---------------------- | ------------------------------------------------------- |
| `SITE_DISTRIBUTION_ID` | id da distribuição CloudFront (liga o workflow)         |
| `AWS_ACCOUNT_ID`       | conta da AWS                                            |
| `SITE_BUCKET`          | bucket S3 que recebe o site                             |
| `AWS_DEPLOY_ROLE`      | role assumida por OIDC; sem ela, `<SITE_BUCKET>-deploy` |
| `SITE_URL`             | endereço público, ex.: `https://privateday.auvp.com.br` |

A role precisa confiar no provedor OIDC do GitHub para este repositório e ter
permissão de escrita no bucket e de invalidação na distribuição.

- **Ordem do deploy** (`scripts/ci/deploy.sh`): envia os arquivos novos, apaga
  os que saíram e invalida o cache.
- **Voltar uma versão:** **Actions → Deploy na AWS → Run workflow**, informando
  o commit (precisa fazer parte da `main`).
- **O deploy substitui a raiz do bucket.** O `aws s3 sync --delete` apaga o que
  estiver lá e não vier do `dist/`. Use um bucket só para este site.

---

## Testar o build antes de publicar

```bash
npm run build
npm run preview     # http://localhost:4173
```

Para ver o que o Pages vai gerar (canonical e og absolutos):

```bash
SITE_URL=https://eriadesign.github.io/privateday SITE_INDEXAVEL=true npm run build
```

O build falha se algum arquivo citado em HTML ou CSS não existir no site
montado: um erro ali seria uma imagem quebrada em produção.

---

## Checklist antes de anunciar

- [ ] `npm run check` passa
- [ ] A edição que vai para a raiz está em `site.json`
- [ ] A página da edição nova não tem mais `noindex`
- [ ] Nenhum "em breve" ou `TROCAR` sobrou sem ser decisão consciente
- [ ] Os links de checkout respondem
- [ ] Conferi em 390px de largura, não só no desktop
