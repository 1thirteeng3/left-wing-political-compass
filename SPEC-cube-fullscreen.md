# Spec: cube-fullscreen

## Objetivo
Exploração limpa e nítida dos 134 pontos do cubo 3D em tela cheia: só o
canvas (sem header, sem controles, sem legendas), renderizando na resolução
nativa da tela. Usuário: visitante explorando o mapa. Sucesso: canvas ocupa
a viewport inteira, nítido (dpr nativo), interações de exploração intactas.

## Comportamento (critérios de aceitação)
1. Botão #fsB (class "btn small") na .ctrls, ao lado de "Resetar vista"
   (#reset). Label localizado fsB ×3; title/aria fsT ×3.
2. Clique → document.querySelector('.cubewrap').requestFullscreen()
   (elemento = .cubewrap, não o card).
3. Toggle: se document.fullscreenElement === cubewrap, clique sai
   (document.exitFullscreen()); label muda para fsExitB ×3.
4. fullscreenchange listener: atualiza label/aria do #fsB; ao ENTRAR,
   chama cv.focus() (setas/R funcionam imediatamente).
5. CSS (bloco /* Cubo */):
   .cubewrap:fullscreen{border:0;height:100%;background:var(--bg)}
   .cubewrap:fullscreen #cube{height:100%;width:100%}
   (sobrescreve clamp(300px,52vw,430px); :fullscreen só aplica ao
   elemento fullscreado)
6. Nitidez: SEM código novo — drawCube já usa devicePixelRatio (:1747) e
   ResizeObserver no cv (:1956) já redesenha. VERIFICAR que labels/linhas
   não ficam serrilhados em tela cheia.
7. Feature detection: se !document.fullscreenEnabled (iOS Safari <16.4),
   #fsB recebe hidden. Sem fallback custom (fora de escopo).
8. Interações preservadas na tela cheia: arrastar gira, hover mostra
   tooltip, checkbox "nomear todas"/inclinação ficam FORA (fora de escopo
   por decisão do usuário — só canvas).
9. Saída: Esc nativo OU botão (agora "Sair da tela cheia"). Ao sair, CSS
   normal volta e ResizeObserver re-normaliza o desenho.

## Comandos
Build/test: node scripts/test.mjs
Deploy: git commit + push main (Vercel)

## Project Structure
- index.html: único arquivo tocado
  - ~linha 270: botão na .ctrls
  - ~linha 168-181: regras :fullscreen
  - dicts ×3: fsB, fsExitB, fsT
  - JS perto dos handlers do canvas (~:1930-1956): listener

## Code Style
- ES5 inline, handler no estilo existente (addEventListener com function)
- Exemplo:
  var fsB = document.getElementById('fsB');
  function fsActive(){ return document.fullscreenElement === wrap; }
  fsB.onclick = function(){
    if(fsActive()) document.exitFullscreen();
    else wrap.requestFullscreen();
  };

## Testing Strategy
- node scripts/test.mjs: sintaxe dos scripts inline; keys fsB, fsExitB,
  fsT ×3.
- Manual (Chrome/Edge desktop): entrar/sair via botão e via Esc; nitidez
  dos pontos/labels; arrastar gira; hover tooltip funciona; foco no canvas
  (setas giram, R reseta).
- Manual (mobile Android, se disponível): botão some sem fullscreenEnabled.

## Boundaries
- Always: keys ×3; feature-detect fullscreenEnabled; rodar test.mjs.
- Ask first: se quiser levar controles (inclinação/legendas) pra dentro
  da tela cheia (mudaria o escopo acordado).
- Never: usar CSS hacks tipo height:100vh fora de :fullscreen; não tocar
  no drawCube (renda existente é correta).

## Success Criteria
1. node scripts/test.mjs → all checks passed
2. Tela cheia: canvas ocupa 100% da viewport, nitidez consistente com o
   dpr da tela, sem borda/sem UI externa
3. Botão alterna entrar/sair; Esc também sai; label sempre correto
4. Ao voltar, o canvas redesenha no tamanho original sem distorção

## Open Questions
(nenhum — canvas-only decidido com o usuário; sem fallback p/ iOS antigo
além de ocultar o botão)
