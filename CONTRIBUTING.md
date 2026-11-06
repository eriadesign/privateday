# Como contribuir

## Antes de começar

Leia o documento correspondente ao que você vai mexer:

- texto ou link → [docs/CONTENT.md](docs/CONTENT.md)
- cor, fonte, elemento da festa → [docs/BRAND.md](docs/BRAND.md)
- estrutura, build ou publicação → [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
  e [docs/DEPLOY.md](docs/DEPLOY.md)

## Fluxo

```bash
git checkout -b tipo/descricao-curta
# ... suas alterações ...
npm run check
git commit -m "tipo: o que mudou"
git push -u origin tipo/descricao-curta
```

Abra o PR para `main`. O merge publica sozinho.

### Prefixos

| Prefixo    | Uso                                     |
| ---------- | --------------------------------------- |
| `conteudo` | Texto, link, pergunta de FAQ            |
| `foto`     | Imagem nova, recorte, substituição      |
| `feat`     | Dobra, componente ou comportamento novo |
| `fix`      | Correção                                |
| `estilo`   | Ajuste visual sem mudança de conteúdo   |
| `docs`     | Documentação                            |
| `chore`    | Dependência, configuração, ferramenta   |

Mensagem no imperativo e em português: `conteudo: troca a chamada do topo`,
`foto: adiciona registros da festa de 2026`.

## Antes de abrir o PR

```bash
npm run check
```

Precisa passar. A CI roda exatamente isso, e confere se o
`2027/css/tailwind.css` está atualizado.

E confira você mesmo:

- [ ] Nenhum texto de exemplo sobrou
- [ ] Toda imagem nova tem `alt` descritivo em português, ou é decorativa
- [ ] Percorri a alteração com `Tab` e o foco está sempre visível
- [ ] Conferi em 390px de largura, não só no desktop
- [ ] Nenhuma cor nova fora dos tokens de `estilos.css`
- [ ] Não mexi em `2026/` nem nos arquivos soltos da raiz

## O que uma revisão vai olhar

**Em mudança de conteúdo:** se o texto está correto, se os links respondem e
se não há promessa de rentabilidade.

**Em mudança visual:** se respeita os tokens e os dois mundos (palestras e
festa), se o contraste passa AA e se o movimento respeita
`prefers-reduced-motion`.

**Em mudança estrutural:** se o build continua passando sem `SITE_URL` e com
ela, e se nenhum caminho usado pelo WordPress mudou de lugar.
