import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const OCT = {
  pt: [
    'Socialdemocracia estatista',
    'Marxismo-leninismo de mercado',
    'Democracia econômica',
    'Mutualismo e autogestão de mercado',
    'Planejamento democrático',
    'Marxismo-leninismo clássico',
    'Erosão do capitalismo',
    'Comunismo libertário',
  ],
  en: [
    'Statist social democracy',
    'Market Marxism-Leninism',
    'Economic democracy',
    'Mutualism and market self-management',
    'Democratic planning',
    'Classical Marxism-Leninism',
    'Erosion of capitalism',
    'Libertarian communism',
  ],
  es: [
    'Socialdemocracia estatista',
    'Marxismo-leninismo de mercado',
    'Democracia económica',
    'Mutualismo y autogestión de mercado',
    'Planificación democrática',
    'Marxismo-leninismo clásico',
    'Erosión del capitalismo',
    'Comunismo libertario',
  ],
};

const LBL = {
  pt: { title: 'BÚSSOLA DA ESQUERDA', cta: 'Descubra sua posição · 60 afirmações · 134 correntes', site: 'left-wing-political-compass.vercel.app' },
  en: { title: 'LEFT-WING COMPASS', cta: 'Find your position · 60 statements · 134 currents', site: 'left-wing-political-compass.vercel.app' },
  es: { title: 'BRÚJULA DE LA IZQUIERDA', cta: 'Descubre tu posición · 60 afirmaciones · 134 corrientes', site: 'left-wing-political-compass.vercel.app' },
};

const HUES = [[0, 6], [30, 26], [55, 55], [75, 100], [100, 140]];
function hueAt(c) {
  c = Math.max(0, Math.min(100, c));
  for (let i = 1; i < HUES.length; i++) {
    if (c <= HUES[i][0]) {
      const a = HUES[i - 1], b = HUES[i], t = (c - a[0]) / (b[0] - a[0]);
      return a[1] + t * (b[1] - a[1]);
    }
  }
  return 140;
}

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
    const t = LBL[lang];
    const hue = hueAt(c);
    const accent = `hsl(${Math.round(hue)},80%,46%)`;
    const octIdx = (x >= 0 ? 1 : 0) + (y >= 0 ? 2 : 0) + (z >= 0 ? 4 : 0);
    const oct = OCT[lang][octIdx];

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
                children: [t.site, hasResult ? `Cor ${c} · Forma ${s}` : '3 eixos + 2 lentes'],
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
