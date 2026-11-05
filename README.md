# AUVP Private Day

Landing pages do AUVP Private Day. Cada edição é um projeto separado, com as próprias páginas e os próprios arquivos.

| Pasta | O que é | Estado |
|---|---|---|
| [`2026/`](2026/) | Edição de 2026 | Backup: não alterar |
| [`2027/`](2027/) | Edição de 2027 | Em desenvolvimento: é aqui que as alterações entram |

## Edição de 2026

Publicada no WordPress: `2026/index.htm` é o código colado no bloco HTML. Tudo fica em um arquivo só, com as imagens em `2026/assets/`.

## Edição de 2027

Publicada pelo GitHub Pages, como um site comum:

- `index.htm`: a página.
- `css/estilos.css`: os estilos próprios. É aqui que o visual muda.
- `css/tailwind.css`: as classes utilitárias, em arquivo gerado. Não edite à mão.
- `js/main.js`: as interações e a medição do Clarity.
- `assets/`: imagens, sempre citadas pelo caminho relativo, como `assets/brasilidades/sol.png`.
- `obrigado.htm`: a página de obrigado, ainda no formato antigo.

Ao usar uma classe do Tailwind que ainda não existe na página, gere `css/tailwind.css` de novo, a partir da raiz do repositório:

```bash
npx tailwindcss@3 -c 2027/tailwind.config.js -o 2027/css/tailwind.css --minify
```

## Não mova nem apague os arquivos soltos na raiz

O site no ar (`privateday.auvp.com.br`) carrega imagens e fonte da raiz deste repositório, pelo endereço `raw.githubusercontent.com/eriadesign/privateday/main/<arquivo>`. Se esses arquivos saírem de lá, as imagens do site quebram na hora.

Eles só podem ser removidos depois que o código publicado no WordPress deixar de apontar para a raiz. Antes disso, confira também se algum e-mail usa esses endereços: arquivos como `email.png` e as assinaturas não aparecem em nenhuma página daqui.

`2027/obrigado.htm` também carrega arquivos de `2027/assets/` por esse endereço, então eles só podem sair de lá depois que essa página for refeita.

## Pré-visualização

O GitHub Pages publica a `main`, e todo o conteúdo é público, inclusive o de 2027 enquanto está em desenvolvimento:

- 2027: <https://eriadesign.github.io/privateday/2027/>
- 2026: <https://eriadesign.github.io/privateday/2026/>
- O endereço raiz redireciona para a edição atual, 2027. A cada nova edição, troque o destino no `index.htm` da raiz.

## Rascunho de 2027

A landing de 2027 é dividida em dois mundos, seguindo o guia de identidade:

- **Palestras:** sóbrio e corporativo. Preto e branco, Anek Latin nos títulos, Roboto no corpo, linhas finas.
- **Festa:** paleta do tema Brasilidades, Oferta do Dia nos títulos, Elms Sans no corpo e os elementos do guia em forma de adesivo.

Para editar, as cores e as fontes estão em `:root`, no começo de `2027/css/estilos.css`. Se mudar uma cor, atualize também `2027/tailwind.config.js` e gere o CSS de novo. Pontos a preencher estão marcados no código com `TROCAR`.

Os elementos, as fotos do guia e `titulo-brasilidades.png`, o título em imagem, estão em `2027/assets/brasilidades/`. Além dos elementos do guia, a pasta tem adesivos regionais criados para a página: `pamonha`, `copo-cerveja`, `peixe-tucunare`, `fitinha-bonfim`, `cordel`, `berimbau`, `sombrinha`, `chapeu-cangaceiro`, `chimarrao`, `caju-fruta`, `sanfona`, `vitoria-regia` e `filtro-barro`.

Nos títulos da festa, evite as letras C e Ç: na Oferta do Dia, o C se lê como L.

No topo, a festa abre pelo sol no rodapé ou pela frase em destaque "Festa para celebrar.", que mostram a versão colorida.

Antes de publicar de verdade:

- [ ] Remover a linha `noindex` do começo do arquivo e o aviso de rascunho.
- [ ] Preencher datas, local e o link de checkout do ingresso único, que está como "em breve".
- [ ] Incluir o lineup quando estiver fechado, no lugar da linha "Lineup em breve".
- [ ] Trocar o vídeo, cuja capa ainda mostra "Disco fever", e incluir o link do dress code.
- [ ] Confirmar a licença da fonte Oferta do Dia e das fotos do guia.
- [ ] Refazer `2027/obrigado.htm`, que ainda está no visual de 2026.

## Versão exata de 2026

A tag `lp-2026` guarda o repositório como estava antes desta organização. A tag `com-flora` guarda a versão com o Marcelo Flora anterior à remoção temporária.
