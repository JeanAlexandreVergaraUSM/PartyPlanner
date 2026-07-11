import { evaluateSafeExpression } from '../src/security/safeExpression.js';

const avg = (...nums) => nums.reduce((a, b) => a + b, 0) / nums.length;
const functions = {
  avg,
  min: Math.min,
  max: Math.max,
  final: () => NaN,
  finalCode: code => code === 'MAT101' ? 80 : NaN,
  finalId: () => NaN,
};

const variables = {
  C1: 60,
  C2: 80,
  T1: 100,
  Asistencia: 75,
};

const cases = [
  ['avg(C1,C2)*70% + T1*30%', 79],
  ['Asistencia >= 55%', true],
  ['finalCode("MAT101")*50% + C1*50%', 70],
  ['C3 + 5', 5],
];

for (const [expr, expected] of cases) {
  const got = evaluateSafeExpression(expr, { variables, functions });
  if (got !== expected) {
    throw new Error(`Fallo en ${expr}: esperado ${expected}, recibido ${got}`);
  }
}

const attackExpressions = [
  'avg.constructor("return 7*6")()',
  'Math.constructor("return 1")()',
  'globalThis',
  'C1.__proto__',
];

for (const expr of attackExpressions) {
  let blocked = false;
  try {
    const result = evaluateSafeExpression(expr, { variables, functions });
    // `globalThis` se resuelve como identificador desconocido=0, que es inocuo.
    if (expr === 'globalThis' && result === 0) blocked = true;
  } catch {
    blocked = true;
  }
  if (!blocked) {
    throw new Error(`La expresión peligrosa no fue bloqueada: ${expr}`);
  }
}

console.log('Security smoke tests: OK');
