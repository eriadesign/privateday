# AUVP Private Day

Landing pages do AUVP Private Day. Cada edição é um projeto separado, com as próprias páginas e os próprios arquivos.

| Pasta | O que é | Estado |
|---|---|---|
| [`2026/`](2026/) | Edição de 2026 | Backup: não alterar |
| [`2027/`](2027/) | Edição de 2027 | Em desenvolvimento: é aqui que as alterações entram |

Em cada pasta:

- `index.htm`: a landing page. É o código colado no bloco HTML do WordPress.
- `obrigado.htm`: a página de obrigado.
- `assets/`: imagens e fonte usadas pelas páginas.

## Não mova nem apague os arquivos soltos na raiz

O site no ar (`privateday.auvp.com.br`) carrega imagens e fonte da raiz deste repositório, pelo endereço `raw.githubusercontent.com/eriadesign/privateday/main/<arquivo>`. Se esses arquivos saírem de lá, as imagens do site quebram na hora.

Eles só podem ser removidos depois que o código publicado no WordPress deixar de apontar para a raiz. Antes disso, confira também se algum e-mail usa esses endereços: arquivos como `email.png` e as assinaturas não aparecem em nenhuma página daqui.

## Imagens novas

As páginas apontam para os arquivos pelo endereço completo, porque o código é colado no WordPress:

```
https://raw.githubusercontent.com/eriadesign/privateday/main/2027/assets/<arquivo>
```

Esse endereço só funciona depois que o arquivo chega à `main`.

## Pré-visualização

O GitHub Pages publica a `main`, e todo o conteúdo é público, inclusive o de 2027 enquanto está em desenvolvimento:

- 2026: <https://eriadesign.github.io/privateday/2026/>
- 2027: <https://eriadesign.github.io/privateday/2027/>
- O endereço raiz redireciona para 2026. Quando a página de 2027 estiver pronta, troque o destino no `index.htm` da raiz.

## Versão exata de 2026

A tag `lp-2026` guarda o repositório como estava antes desta organização. A tag `com-flora` guarda a versão com o Marcelo Flora anterior à remoção temporária.
