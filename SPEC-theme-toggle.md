# Spec: theme-toggle

## Objetivo
Dar ao usuário controle explícito de tema (claro/escuro) num site cujo CSS já
tem todo o sistema de tokens (auto via prefers-color-scheme, forçado via
[data-theme="dark"|"light"], --is-dark, refreshTheme() no MutationObserver).
Usuário: visitante. Sucesso: escolha persiste entre visitas, sem flash de
tema errado no carregamento, e a mudança re-renderiza cubo/lentes/projeções
sem glitches (refreshTheme já cobre via MutationObserver).

## Comportamento (critérios de aceitação)
1. Botão #themeB (class "btn small") no grupo do topo, à direita dos botões
   PT/EN/ES. Label de texto localizado (themeB) — consistente com os botões
   de idioma.
2. Ciclo determinístico: auto → light → dark → auto. Estado interno
   JS (var THEME), NÃO deduzido de computed style.
3. Persistência: localStorage['bussola-theme'] ∈ {'light','dark'};
   ausente = auto (segue prefers-color-scheme). try/catch em todo acesso
   (padrão existente de bussola-lang).
4. Aplicação:
   - auto  → remove documentElement.dataset.theme
   - light → documentElement.dataset.theme = 'light'
   - dark  → documentElement.dataset.theme = 'dark'
5. Anti-flash: mini-script inline no <head> (3º script inline do doc)
   aplica o valor salvo ANTES do primeiro paint.
6. Acessibilidade: aria-label dinâmico com o estado atual (themeAuto/
   themeLight/themeDark) ×3 línguas.
7. Mudança de tema re-renderiza tudo automaticamente ( já coberto:
   MutationObserver em data-theme → refreshTheme → updateLensVars +
   updateLensTokens + updateViz + renderResult). Nada a fazer aqui —
   VERIFICAR visualmente (legenda de lente, cores do canvas, projeções).
8. Ícone: svg inline (sol/lua) opcional ao lado do texto; aria-hidden.

## Comandos
Build/test: node scripts/test.mjs   (Windows PowerShell, npm.ps1 bloqueado)
Deploy: git commit + push main (Vercel)

## Project Structure
- index.html: único arquivo tocado
  - <head>: 3º script inline (anti-flash)
  - ~linha 238-242: botão no grupo do header
  - dicts pt (~:418), en (~:448), es (~:478): novas keys
  - bloco JS de idioma (~:2158): função applyTheme + listener

## Code Style (convenções do repo)
- ES5-style: var, function decls, sem arrow/let/const no código inline
- try/catch silencioso em localStorage
- setText(id, v) para aplicar i18n
- Exemplo de saída esperada:
  try{ var t=null; try{ t=localStorage.getItem('bussola-theme'); }catch(e){}
  }catch(e){}
  if(t==='light'||t==='dark') root.dataset.theme=t;

## Testing Strategy
- node scripts/test.mjs: sintaxe dos 3 scripts inline (regex genérico já
  cobre o 3º); nova check: keys themeB, themeT, themeAuto, themeLight,
  themeDark presentes ×3.
- Manual: alternar ciclo e conferir (a) persistência após reload,
  (b) sem flash com tema salvo ≠ sistema, (c) canvas/lentes re-renderizam,
  (d) Esc/interação nenhuma quebra.

## Boundaries
- Always: keys ×3 nas línguas; try/catch em localStorage; rodar test.mjs.
- Ask first: mudar valores de cor dos tokens (o dark já existe e está
  calibrado — NÃO reajustar paleta).
- Never: mudar fórmula/pesos do quiz; tocar em sw.js (nada muda no shell).

## Success Criteria
1. node scripts/test.mjs → all checks passed (com as novas checks)
2. localStorage['bussola-theme']='dark' + reload em sistema claro → tema
   escuro desde o primeiro paint, sem flash claro visível
3. Ciclo auto→light→dark→auto funciona e sobrevive a reload
4. Em estado auto, o site segue o sistema (comportamento atual preservado)

## Open Questions
(nenhum — decisões tomadas com o usuário: ciclo 3 estados, botão de texto
localizado, localStorage 'bussola-theme')
