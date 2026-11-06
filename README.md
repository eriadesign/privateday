# AUVP Private Day

Landing pages do **AUVP Private Day**, uma pasta por edição, publicadas juntas
num único site estático. Endereço: **<https://eriadesign.github.io/privateday/>**.

| Endereço                                                                        | Pasta   | O que é                                           |
| ------------------------------------------------------------------------------- | ------- | ------------------------------------------------- |
| [/](https://eriadesign.github.io/privateday/)                                   | `2026/` | A edição atual, definida em `site.json`           |
| [/2026/](https://eriadesign.github.io/privateday/2026/)                         | `2026/` | Edição de 2026. Backup: não alterar               |
| [/2027/](https://eriadesign.github.io/privateday/2027/)                         | `2027/` | Edição de 2027, em desenvolvimento, com `noindex` |
| [/2027/obrigado.htm](https://eriadesign.github.io/privateday/2027/obrigado.htm) | `2027/` | Página de obrigado, ainda no visual de 2026       |

A raiz serve a edição atual: o build copia a pasta do ano escrito em
`site.json` para a raiz do site, e cada edição continua também no seu próprio
endereço. **Para lançar uma edição, troque o ano em `site.json`.** Ver
[docs/DEPLOY.md](docs/DEPLOY.md).

Cada edição é HTML puro, sem framework: `index.html` (em 2026, `index.htm`),
CSS, JS e as imagens em `assets/`. O build só copia as pastas, ajusta canonical
e imagem de compartilhamento ao endereço público e confere se todo arquivo
citado existe.

## Começando

Requer Node 22 (ver `.nvmrc`).

```bash
npm install            # instala o Prettier e o Tailwind 3
npm run build          # monta o site em dist/
npm run preview        # serve dist/ em http://localhost:4173
```

## Comandos

| Comando           | O que faz                                                    |
| ----------------- | ------------------------------------------------------------ |
| `npm run build`   | Monta o site completo em `dist/`                             |
| `npm run preview` | Serve `dist/` em http://localhost:4173                       |
| `npm run css`     | Gera `2027/css/tailwind.css` com as classes usadas na página |
| `npm test`        | Testes do build (`node --test`)                              |
| `npm run format`  | Aplica o Prettier                                            |
| `npm run check`   | Formatação, testes e build, o mesmo que a CI roda            |

## Onde mexer

**Trocar um texto, link ou pergunta do FAQ** → direto no `index.html` da
edição. Ver **[docs/CONTENT.md](docs/CONTENT.md)**.

**Mexer em cor, fonte ou elemento da festa** → `2027/css/estilos.css`, com o
racional em **[docs/BRAND.md](docs/BRAND.md)**.

**Usar uma classe do Tailwind que ainda não existe na página de 2027** → rode
`npm run css` e faça commit do `2027/css/tailwind.css`. A CI confere.

## Não mova nem apague os arquivos soltos na raiz

O site no ar no WordPress (`privateday.auvp.com.br`) carrega imagens e fonte da
raiz deste repositório, pelo endereço
`raw.githubusercontent.com/eriadesign/privateday/main/<arquivo>`. Se esses
arquivos saírem de lá, as imagens do site quebram na hora. Eles não entram no
site montado em `dist/`.

Eles só podem ser removidos depois que o código publicado no WordPress deixar
de apontar para a raiz. Antes disso, confira também se algum e-mail usa esses
endereços: arquivos como `email.png` e as assinaturas não aparecem em nenhuma
página daqui.

Pelo mesmo motivo, `2026/index.htm` é o código colado no bloco HTML do
WordPress e carrega `2026/assets/` pelo endereço raw, e `2027/obrigado.htm` faz
o mesmo com `2027/assets/`. Esses caminhos também não podem mudar.

## Documentação

| Documento                                    | Assunto                                                |
| -------------------------------------------- | ------------------------------------------------------ |
| [docs/CONTENT.md](docs/CONTENT.md)           | Como editar o conteúdo e o que falta preencher em 2027 |
| [docs/BRAND.md](docs/BRAND.md)               | Linguagem visual de 2027: os dois mundos               |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Estrutura, build e decisões técnicas                   |
| [docs/DEPLOY.md](docs/DEPLOY.md)             | Publicação, lançamento de edição e checklist           |
| [CONTRIBUTING.md](CONTRIBUTING.md)           | Fluxo de trabalho, branches e revisão                  |
| [CHANGELOG.md](CHANGELOG.md)                 | Histórico de mudanças                                  |

## Publicação

O mesmo `dist/` serve três destinos:

- **GitHub Pages**, a cada push na `main`, pelo workflow
  `.github/workflows/deploy.yml`.
- **Vercel**, configurada por `vercel.json`: basta importar o repositório.
- **AWS (S3 + CloudFront)**, pelo workflow `.github/workflows/deploy-aws.yml`,
  que só roda depois que as variáveis da conta forem criadas no repositório.

Ver [docs/DEPLOY.md](docs/DEPLOY.md).

## Versão exata de 2026

A tag `lp-2026` guarda o repositório como estava antes da primeira
organização. A tag `com-flora` guarda a versão com o Marcelo Flora anterior à
remoção temporária.
