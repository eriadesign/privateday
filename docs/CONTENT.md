# Conteúdo

Os textos ficam direto no HTML de cada edição: `2027/index.html` e
`2027/obrigado.htm`. Não há arquivo de conteúdo separado.

## 2026

`2026/index.htm` é a cópia do que está no WordPress. **Não altere**: mudança
de texto em 2026 é feita no WordPress, e só depois copiada para cá, se for
preciso manter o backup em dia.

## 2027

- Cada dobra começa com um comentário `<!-- ==== NOME ==== -->`.
- Pontos a preencher estão marcados com `TROCAR` no código.
- Links de compra apontam para `privateday.auvpag.com.br/pay/...`. O
  `js/main.js` reconhece esses links sozinho e registra o clique no Clarity
  como intenção de compra.
- Nos títulos da festa, evite as letras C e Ç: na Oferta do Dia, o C se lê
  como L.

### O que falta antes do lançamento

- [ ] Remover a linha `noindex` do começo do `index.html` (ver
      [DEPLOY.md](DEPLOY.md), "Lançar uma edição").
- [ ] Preencher a data, que está como "em breve".
- [ ] Incluir o lineup quando estiver fechado, no lugar de "Conheça os
      palestrantes em breve".
- [ ] Trocar o vídeo, cuja capa ainda mostra "Disco fever".
- [ ] Confirmar a licença da fonte Oferta do Dia e das fotos do guia.
- [ ] Refazer `2027/obrigado.htm`, que ainda está no visual de 2026.

## Regras de escrita

- Português do Brasil, frases curtas.
- Nada de promessa de rentabilidade ou de urgência artificial.
- Toda imagem que informa tem `alt` em português; imagem decorativa leva
  `alt=""` e `aria-hidden="true"`.
