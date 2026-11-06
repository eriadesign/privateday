# Linguagem visual de 2027

A landing de 2027 é dividida em dois mundos, seguindo o guia de identidade:

- **Palestras:** sóbrio e corporativo. Preto e branco, Anek Latin nos
  títulos, Roboto no corpo, linhas finas.
- **Festa:** paleta do tema Brasilidades, Oferta do Dia nos títulos, Elms Sans
  no corpo e os elementos do guia em forma de adesivo.

## Onde ficam

As cores e as fontes estão em `:root`, no começo de `2027/css/estilos.css`.
Se mudar uma cor, atualize também `2027/tailwind.config.js` e rode
`npm run css`.

| Token       | Cor       |
| ----------- | --------- |
| `--mato`    | `#758c39` |
| `--mar`     | `#88bddd` |
| `--areia`   | `#fee7d8` |
| `--canario` | `#ffa737` |
| `--caju`    | `#fc5447` |
| `--cacau`   | `#281a16` |

## Elementos

Os elementos, as fotos do guia e `titulo-brasilidades.png`, o título em
imagem, estão em `2027/assets/brasilidades/`. Além dos elementos do guia, a
pasta tem adesivos regionais criados para a página: `pamonha`,
`copo-cerveja`, `peixe-tucunare`, `fitinha-bonfim`, `cordel`, `berimbau`,
`sombrinha`, `chapeu-cangaceiro`, `chimarrao`, `caju-fruta`, `sanfona`,
`vitoria-regia` e `filtro-barro`.

O `titulo-brasilidades.png` é marrom. Sobre fundo escuro, ele entra como
máscara CSS com a cor `--areia` (ver `.frase-brasilidades` e
`.ingresso-titulo`).

## Fonte da festa

A Oferta do Dia (Eduardo Luiz Ramalho Sobreira, IFPE, 2014) ainda está com a
licença a confirmar, por isso o arquivo não está no repositório, que é
público. Só aparece em quem tem a fonte instalada; os demais visitantes veem a
Bangers. Com a licença confirmada, envie o arquivo para `2027/assets/` e
descomente o `@font-face` no começo do `estilos.css`.

## Interações

- No topo, a festa abre pelo sol ou pela frase em destaque "Cultura rica na
  pista.", que mostram a versão colorida.
- O movimento respeita `prefers-reduced-motion`.
