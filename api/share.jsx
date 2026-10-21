import { octIdx, OCT, LBL } from './shared.jsx';
const BASE = 'https://left-wing-political-compass.vercel.app';

function num(v, a, b, dflt) {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return dflt;
  return Math.max(a, Math.min(b, n));
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default function handler(req) {
  const u = new URL(req.url);
  const q = u.searchParams;
  const lang = ['pt', 'en', 'es'].includes(q.get('lang')) ? q.get('lang') : 'pt';
  const hasResult = q.get('v') === '1' && ['x', 'y', 'z', 'c', 's'].every((k) => q.get(k) !== null);
  const x = num(q.get('x'), -100, 100, 0);
  const y = num(q.get('y'), -100, 100, 0);
  const z = num(q.get('z'), -100, 100, 0);
  const c = num(q.get('c'), 0, 100, 50);
  const s = num(q.get('s'), 0, 100, 50);
  const mode = q.get('m') === 'fast' ? 'fast' : 'full';
  const t = LBL[lang];
  const oct = OCT[lang][octIdx(x, y, z)];
  const card = BASE + '/api/card?v=1&x=' + x + '&y=' + y + '&z=' + z + '&c=' + c + '&s=' + s + '&m=' + mode + '&lang=' + lang;
  const path = lang === 'en' ? '/en' : (lang === 'es' ? '/es' : '/');
  const target = hasResult
    ? BASE + path + '?v=1&x=' + x + '&y=' + y + '&z=' + z + '&c=' + c + '&s=' + s + '&m=' + mode + '&lang=' + lang
    : BASE + path;
  const title = hasResult ? oct : t.title;
  const desc = hasResult ? t.shareDesc.replace('{oct}', oct) : t.shareDescHome;
  const html = '<!doctype html><html lang="' + lang + '"><head><meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>' + esc(title) + '</title><meta name="robots" content="noindex">'
    + '<meta property="og:type" content="website">'
    + '<meta property="og:title" content="' + esc(title) + '">'
    + '<meta property="og:description" content="' + esc(desc) + '">'
    + '<meta property="og:image" content="' + esc(card) + '">'
    + '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">'
    + '<meta name="twitter:card" content="summary_large_image">'
    + '<meta name="twitter:title" content="' + esc(title) + '">'
    + '<meta name="twitter:description" content="' + esc(desc) + '">'
    + '<meta name="twitter:image" content="' + esc(card) + '">'
    + '</head><body>'
    + '<p>' + esc(desc) + '</p>'
    + '<p><a href="' + esc(target) + '">' + esc(t.shareOpen) + '</a></p>'
    + '<script>location.replace(' + JSON.stringify(target) + ');</script>'
    + '</body></html>';
  return new Response(html, {
    status: 200,
    headers: { 'content-type': 'text/html;charset=utf-8', 'cache-control': 'public,max-age=0,must-revalidate' },
  });
}
