#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const html = readFileSync(join(root, 'index.html'), 'utf8');

let failures = 0;
const fail = (msg) => { failures++; console.error('FAIL: ' + msg); };
const ok = (msg) => console.log('ok: ' + msg);

const tmp = mkdtempSync(join(tmpdir(), 'bussola-test-'));

const re = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
let n = 0, m;
while ((m = re.exec(html)) !== null) {
  n++;
  const f = join(tmp, 'script' + n + '.js');
  writeFileSync(f, m[1]);
  const r = spawnSync(process.execPath, ['--check', f], { encoding: 'utf8' });
  if (r.status !== 0) fail('inline script ' + n + ' syntax: ' + (r.stderr || '').split('\n')[0]);
  else ok('inline script ' + n + ' syntax');
}
if (n < 2) fail('expected at least 2 inline scripts, found ' + n);

const coreStart = html.indexOf('var AXIS');
const coreEnd = html.indexOf('/*CORE-END*/');
if (coreStart < 0 || coreEnd < 0) {
  fail('core markers not found');
} else {
  const core = html.slice(coreStart, coreEnd);
  const assert = readFileSync(join(root, 'scripts', 'core-assert.mjs'), 'utf8');
  const cf = join(tmp, 'core.js');
  writeFileSync(cf, core + '\n' + assert);
  const r = spawnSync(process.execPath, [cf], { encoding: 'utf8' });
  if (r.status !== 0) fail('core regression: ' + (r.stderr || 'exit ' + r.status));
  else ok('core regression (134 correntes / 60 questões / ponto de referência)');
}

for (const key of ['ctaStart', 'saveNote', 'cmpScale', 'cmpMore', 'cmpLess', 'embedB', 'openL', 'themeB', 'themeT', 'themeAuto', 'themeLight', 'themeDark', 'fsB', 'fsExitB', 'fsT']) {
  const count = (html.match(new RegExp(key + ':', 'g')) || []).length;
  if (count !== 3) fail('i18n key "' + key + '": ' + count + ' definições, esperado 3 (pt/en/es)');
  else ok('i18n key "' + key + '" ×3');
}

const card = readFileSync(join(root, 'api', 'card.jsx'), 'utf8');
const share = readFileSync(join(root, 'api', 'share.jsx'), 'utf8');
if (!/@vercel\/og/.test(card)) fail('card.jsx sem ImageResponse');
else ok('card.jsx ImageResponse');
if (!/OCT\[lang\]/.test(share)) fail('share.jsx sem OCT localizado');
else ok('share.jsx OCT localizado');

const sm = readFileSync(join(root, 'sitemap.xml'), 'utf8');
const urls = (sm.match(/<url>/g) || []).length;
if (urls !== 138) fail('sitemap.xml tem ' + urls + ' urls, esperado 138');
else ok('sitemap.xml 138 urls');

const data = JSON.parse(readFileSync(join(root, 'api', 'data', 'correntes.json'), 'utf8'));
if (data.correntes.length !== 134) fail('correntes.json tem ' + data.correntes.length + ' correntes, esperado 134');
else ok('correntes.json 134 correntes');

rmSync(tmp, { recursive: true, force: true });
if (failures) { console.error(failures + ' failure(s)'); process.exit(1); }
console.log('all checks passed');
