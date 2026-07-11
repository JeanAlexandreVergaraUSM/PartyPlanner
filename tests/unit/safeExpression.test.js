import { describe, expect, it } from 'vitest';
import { evaluateSafeExpression } from '../../src/security/safeExpression.js';

describe('evaluateSafeExpression', () => {
  it('evalúa operaciones aritméticas respetando precedencia', () => {
    expect(evaluateSafeExpression('2 + 3 * 4')).toBe(14);
    expect(evaluateSafeExpression('(2 + 3) * 4')).toBe(20);
    expect(evaluateSafeExpression('-5 + +2')).toBe(-3);
  });

  it('convierte porcentajes postfix', () => {
    const result = evaluateSafeExpression('C1 * 70% + T1 * 30%', {
      variables: { C1: 6, T1: 5 },
    });
    expect(result).toBeCloseTo(5.7, 10);
  });

  it('permite solo funciones entregadas explícitamente', () => {
    const result = evaluateSafeExpression('avg(C1, C2, C3)', {
      variables: { C1: 4, C2: 5, C3: 6 },
      functions: {
        avg: (...values) => values.reduce((a, b) => a + b, 0) / values.length,
      },
    });
    expect(result).toBe(5);
    expect(() => evaluateSafeExpression('alert(1)')).toThrow(/Función no permitida/);
  });

  it('soporta strings y funciones de notas cruzadas', () => {
    const values = new Map([
      ['Programación', 6.1],
      ['MAT101', 5.4],
    ]);
    expect(evaluateSafeExpression('final("Programación")', {
      functions: { final: name => values.get(name) ?? 0 },
    })).toBe(6.1);
    expect(evaluateSafeExpression("finalCode('MAT101')", {
      functions: { finalCode: code => values.get(code) ?? 0 },
    })).toBe(5.4);
  });

  it('evalúa comparadores de forma controlada', () => {
    expect(evaluateSafeExpression('Asistencia >= 55', {
      variables: { Asistencia: 70 },
    })).toBe(true);
    expect(evaluateSafeExpression('C1 != C2', {
      variables: { C1: 5, C2: 6 },
    })).toBe(true);
  });

  it('usa el valor configurado para identificadores desconocidos', () => {
    expect(evaluateSafeExpression('NO_EXISTE + 2')).toBe(2);
    expect(evaluateSafeExpression('NO_EXISTE + 2', {
      unknownIdentifierValue: 10,
    })).toBe(12);
  });

  it.each([
    'avg.constructor("return 42")()',
    'C1.__proto__',
    'globalThis.process',
    '({}).constructor',
    '[1,2,3]',
    '`template`',
    'C1 && C2',
    'C1 || C2',
  ])('bloquea expresiones de escape: %s', expression => {
    expect(() => evaluateSafeExpression(expression, {
      variables: { C1: 1, C2: 2 },
      functions: { avg: (...xs) => xs[0] ?? 0 },
    })).toThrow();
  });

  it('rechaza números y strings mal formados', () => {
    expect(() => evaluateSafeExpression('1.2.3 + 1')).toThrow(/Número inválido/);
    expect(() => evaluateSafeExpression('final("sin cerrar)')).toThrow(/String sin cerrar/);
  });
});
