# Plan: Onda P5 — tema (3 estados) + fullscreen do cubo

Mapa de capacidades aprovado (ver SPEC-*.md na raiz):

| Módulo | Responsabilidade | Depende de |
|---|---|---|
| theme-toggle | Toggle Auto→Claro→Escuro + persistência + anti-flash no head | — |
| cube-fullscreen | Fullscreen do canvas do cubo + CSS :fullscreen + listeners | — |
| delivery | Checks no test.mjs, validação, commit/push | theme-toggle, cube-fullscreen |

Build order: theme-toggle → cube-fullscreen → delivery (sequencial, mesmo
arquivo index.html, seções independentes).

## Estratégia
- 1 arquivo de código tocado (index.html) + 1 teste (scripts/test.mjs).
- Dark mode: infraestrutura CSS/token/refreshTheme JÁ existe — só UI de
  toggle + persistência + mini-script anti-flash no <head>.
- Fullscreen: drawCube (dpr) + ResizeObserver já cobrem nitidez/resize —
  só botão + CSS :fullscreen + listener de mudança de estado.
- Risks: flash de tema na inicialização (mitigado pelo head script);
  iOS Safari sem fullscreenEnabled (mitigado com feature-detect + hidden);
  i18n drift (mitigado por checks ×3 na suite).

## Verificação
- node scripts/test.mjs após cada módulo.
- Manual: ciclo de tema + reload; fullscreen entrar/sair/Esc; dark +
  fullscreen combinados.
