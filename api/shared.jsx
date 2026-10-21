export const OCT = {
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

export const LBL = {
  pt: {
    title: 'BÚSSOLA DA ESQUERDA',
    cta: 'Descubra sua posição · 60 afirmações · 134 correntes',
    site: 'left-wing-political-compass.vercel.app',
    full: 'Completo',
    fast: 'Expresso',
    lens: 'Cor {c} · Forma {s}',
    axes: '3 eixos + 2 lentes',
    shareDesc: 'Resultado: {oct} — veja sua posição no mapa da esquerda.',
    shareDescHome: '60 afirmações, 134 correntes, 3 eixos + 2 lentes. Descubra sua posição e compartilhe.',
    shareOpen: 'Abrir a Bússola da Esquerda',
  },
  en: {
    title: 'LEFT-WING COMPASS',
    cta: 'Find your position · 60 statements · 134 currents',
    site: 'left-wing-political-compass.vercel.app',
    full: 'Full',
    fast: 'Express',
    lens: 'Color {c} · Shape {s}',
    axes: '3 axes + 2 lenses',
    shareDesc: 'Result: {oct} — see where you stand on the left-wing map.',
    shareDescHome: '60 statements, 134 currents, 3 axes + 2 lenses. Find your position and share it.',
    shareOpen: 'Open the Left-Wing Compass',
  },
  es: {
    title: 'BRÚJULA DE LA IZQUIERDA',
    cta: 'Descubre tu posición · 60 afirmaciones · 134 corrientes',
    site: 'left-wing-political-compass.vercel.app',
    full: 'Completo',
    fast: 'Exprés',
    lens: 'Color {c} · Forma {s}',
    axes: '3 ejes + 2 lentes',
    shareDesc: 'Resultado: {oct} — mira tu posición en el mapa de la izquierda.',
    shareDescHome: '60 afirmaciones, 134 corrientes, 3 ejes + 2 lentes. Descubre tu posición y compártela.',
    shareOpen: 'Abrir la Brújula de la Izquierda',
  },
};

export const HUES = [[0, 6], [30, 26], [55, 55], [75, 100], [100, 140]];

export function hueAt(c) {
  c = Math.max(0, Math.min(100, c));
  for (let i = 1; i < HUES.length; i++) {
    if (c <= HUES[i][0]) {
      const a = HUES[i - 1], b = HUES[i], t = (c - a[0]) / (b[0] - a[0]);
      return a[1] + t * (b[1] - a[1]);
    }
  }
  return HUES[HUES.length - 1][1];
}

export function octIdx(x, y, z) {
  return (x >= 0 ? 1 : 0) + (y >= 0 ? 2 : 0) + (z >= 0 ? 4 : 0);
}
