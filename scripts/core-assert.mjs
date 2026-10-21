if (ARCH.length !== 134) throw new Error('ARCH=' + ARCH.length + ', esperado 134');
if (QUESTIONS.length !== 60) throw new Error('QUESTIONS=' + QUESTIONS.length + ', esperado 60');
var answers = {};
for (var qi = 0; qi < QUESTIONS.length; qi++) answers[QUESTIONS[qi].id] = 2;
var p = score(answers);
var expected = { x: 0, y: 0, z: 0, c: 56, s: 56 };
var keys = ['x', 'y', 'z', 'c', 's'];
for (var ki = 0; ki < keys.length; ki++) {
  var k = keys[ki];
  if (p[k] !== expected[k]) throw new Error(k + '=' + p[k] + ', esperado ' + expected[k]);
}
var n = nearest(p)[0];
if (n.a.n !== 'Socialismo Islâmico / Islamo-esquerdismo' || n.pct !== 77) {
  throw new Error('top1 inesperado: ' + n.a.n + ' ' + n.pct + '%');
}
console.log('core ok');
