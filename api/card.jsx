import { ImageResponse } from '@vercel/og';
import { octIdx, OCT, LBL, hueAt } from './shared.jsx';
export const config = { runtime: 'edge' };

function num(v, a, b, dflt) {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return dflt;
  return Math.max(a, Math.min(b, n));
}
function sgn(v) {
  return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v);
}

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = ['pt', 'en', 'es'].includes(searchParams.get('lang')) ? searchParams.get('lang') : 'pt';
    const x = num(searchParams.get('x'), -100, 100, 0);
    const y = num(searchParams.get('y'), -100, 100, 0);
    const z = num(searchParams.get('z'), -100, 100, 0);
    const c = num(searchParams.get('c'), 0, 100, 50);
    const s = num(searchParams.get('s'), 0, 100, 50);
    const hasResult = searchParams.get('v') === '1' && ['x', 'y', 'z', 'c', 's'].every((k) => searchParams.get(k) !== null);
    const mode = searchParams.get('m') === 'fast' ? 'fast' : 'full';
    const t = LBL[lang];
    const hue = hueAt(c);
    const accent = `hsl(${Math.round(hue)},80%,46%)`;
    const octIdxv = octIdx(x, y, z);
    const oct = OCT[lang][octIdxv];

    return new ImageResponse(
      {
        type: 'div',
        props: {
          style: {
            width: 1200, height: 630, display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', background: '#EDEFEC', color: '#14181B',
            fontFamily: 'Arial,sans-serif', padding: '56px 64px',
          },
          children: [
            {
              type: 'div',
              props: {
                style: { display: 'flex', justifyContent: 'space-between', fontSize: 26, color: '#586268' },
                children: [t.title, hasResult ? `X${sgn(x)} Y${sgn(y)} Z${sgn(z)}` : t.cta],
              },
            },
            {
              type: 'div',
              props: {
                children: [
                  {
                    type: 'div',
                    props: {
                      style: { fontSize: hasResult ? 72 : 84, fontWeight: 800, lineHeight: 1.05 },
                      children: hasResult ? oct.toUpperCase() : t.title,
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', marginTop: 28, gap: 12 },
                      children: ['X', 'Y', 'Z'].map((k, i) => {
                        const v = [x, y, z][i];
                        const w = 300;
                        const fillW = (Math.abs(v) / 100) * (w / 2);
                        return {
                          type: 'div',
                          props: {
                            style: { display: 'flex', flexDirection: 'column', gap: 6 },
                            children: [
                              { type: 'div', props: { style: { fontSize: 22, color: '#586268' }, children: `${k}  ${sgn(v)}` } },
                              {
                                type: 'div',
                                props: {
                                  style: { width: w, height: 20, border: '2px solid #586268', position: 'relative' },
                                  children: {
                                    type: 'div',
                                    props: {
                                      style: {
                                        position: 'absolute', top: 0, bottom: 0,
                                        left: v < 0 ? w / 2 - fillW : w / 2, width: fillW, background: accent,
                                      },
                                    },
                                  },
                                },
                              },
                            ],
                          },
                        };
                      }),
                    },
                  },
                ],
              },
            },
            {
              type: 'div',
              props: {
                style: { display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#586268' },
                children: [t.site + (hasResult ? ' · ' + t[mode] : ''), hasResult ? t.lens
                  .replace('{c}', String(c)).replace('{s}', String(s)) : t.axes],
              },
            },
          ],
        },
      },
      { width: 1200, height: 630 }
    );
  } catch (e) {
    return new Response('Erro ao gerar card', { status: 500 });
  }
}
