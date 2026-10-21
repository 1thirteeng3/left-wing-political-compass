# Spec: delivery

## Objetivo
Fechar a onda com qualidade: estender a suite de testes, validar tudo,
commitar e subir. 1 commit único (padrão das ondas anteriores).

## Comandos
- Testes: node scripts/test.mjs
- Sintaxe SW (sanidade, não muda): node --check sw.js
- Deploy: git add -A; git commit; git push origin main (Vercel auto-deploy)

## Tarefas (critérios de aceitação)
1. scripts/test.mjs: adicionar à lista de keys ×3 (linha ~43):
   themeB, themeT, themeAuto, themeLight, themeDark, fsB, fsExitB, fsT.
2. Rodar suite completa → all checks passed (agora 15+ checks: os 14
   atuais + novas keys).
3. Verificação manual cross-module: dark on + fullscreen on juntos
   (fundo do canvas usa var(--bg) do tema ativo — deve funcionar; testar).
4. Commit único com mensagem no padrão do repo (ex.: "Onda P5: dark mode
   (3 estados) + fullscreen do cubo"), push main.

## Boundaries
- Always: test.mjs verde antes do commit; push apenas após verde.
- Ask first: qualquer mudança em sitemap.xml, manifest, sw.js, api/*.
- Never: commitar com testes falhando; mudar CACHE do sw sem necessidade.

## Success Criteria
1. git push concluído; suite 100% verde local
2. Deploy Vercel sem erro (verificado no próximo contato ou via log)
3. Nenhum arquivo fora de { index.html, scripts/test.mjs, docs de spec }

## Open Questions
(nenhum)
