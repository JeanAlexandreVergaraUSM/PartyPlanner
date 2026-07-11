/**
 * Evaluador de expresiones matemáticas sin eval/new Function.
 * Soporta:
 * - números, identificadores y strings
 * - +, -, *, / y porcentajes postfix (70% => 0.7)
 * - comparadores: >, >=, <, <=, ==, !=
 * - llamadas solo a funciones entregadas explícitamente en `functions`
 * - identificadores desconocidos con valor configurable (por defecto 0)
 *
 * No soporta acceso a propiedades, constructores, arrays ni objetos.
 */
export function evaluateSafeExpression(expression, {
  variables = {},
  functions = {},
  unknownIdentifierValue = 0,
} = {}) {
  const tokens = tokenize(String(expression ?? ''));
  let pos = 0;

  const peek = () => tokens[pos];
  const consume = (type, value = undefined) => {
    const token = tokens[pos];
    if (!token || token.type !== type || (value !== undefined && token.value !== value)) {
      const got = token ? `${token.type}:${String(token.value)}` : 'fin de expresión';
      throw new Error(`Expresión inválida. Se esperaba ${value ?? type} y se recibió ${got}.`);
    }
    pos += 1;
    return token;
  };

  const parseExpression = () => parseComparison();

  const parseComparison = () => {
    let left = parseAdditive();
    while (peek()?.type === 'op' && ['>', '>=', '<', '<=', '==', '!='].includes(peek().value)) {
      const op = consume('op').value;
      const right = parseAdditive();
      switch (op) {
        case '>': left = left > right; break;
        case '>=': left = left >= right; break;
        case '<': left = left < right; break;
        case '<=': left = left <= right; break;
        case '==': left = left === right; break;
        case '!=': left = left !== right; break;
      }
    }
    return left;
  };

  const parseAdditive = () => {
    let left = parseMultiplicative();
    while (peek()?.type === 'op' && ['+', '-'].includes(peek().value)) {
      const op = consume('op').value;
      const right = parseMultiplicative();
      left = op === '+' ? Number(left) + Number(right) : Number(left) - Number(right);
    }
    return left;
  };

  const parseMultiplicative = () => {
    let left = parseUnary();
    while (peek()?.type === 'op' && ['*', '/'].includes(peek().value)) {
      const op = consume('op').value;
      const right = parseUnary();
      left = op === '*' ? Number(left) * Number(right) : Number(left) / Number(right);
    }
    return left;
  };

  const parseUnary = () => {
    if (peek()?.type === 'op' && ['+', '-'].includes(peek().value)) {
      const op = consume('op').value;
      const value = Number(parseUnary());
      return op === '-' ? -value : value;
    }
    return parsePostfix();
  };

  const parsePostfix = () => {
    let value = parsePrimary();
    while (peek()?.type === 'percent') {
      consume('percent');
      value = Number(value) / 100;
    }
    return value;
  };

  const parsePrimary = () => {
    const token = peek();
    if (!token) throw new Error('Expresión incompleta.');

    if (token.type === 'number') {
      consume('number');
      return token.value;
    }

    if (token.type === 'string') {
      consume('string');
      return token.value;
    }

    if (token.type === 'identifier') {
      const name = consume('identifier').value;

      if (peek()?.type === 'lparen') {
        consume('lparen');
        const args = [];
        if (peek()?.type !== 'rparen') {
          args.push(parseExpression());
          while (peek()?.type === 'comma') {
            consume('comma');
            args.push(parseExpression());
          }
        }
        consume('rparen');

        const fn = functions[name];
        if (typeof fn !== 'function') {
          throw new Error(`Función no permitida: ${name}`);
        }
        return fn(...args);
      }

      if (Object.prototype.hasOwnProperty.call(variables, name)) {
        return variables[name] ?? unknownIdentifierValue;
      }

      if (name === 'NaN') return NaN;
      if (name === 'Infinity') return Infinity;
      if (name === 'true') return true;
      if (name === 'false') return false;

      return unknownIdentifierValue;
    }

    if (token.type === 'lparen') {
      consume('lparen');
      const value = parseExpression();
      consume('rparen');
      return value;
    }

    throw new Error(`Token no permitido: ${String(token.value)}`);
  };

  const result = parseExpression();
  if (peek()?.type !== 'eof') {
    throw new Error(`Expresión inválida cerca de: ${String(peek()?.value ?? '')}`);
  }
  return result;
}

function tokenize(source) {
  const tokens = [];
  let i = 0;

  const isDigit = c => /[0-9]/.test(c);
  const isIdentifierStart = c => /[A-Za-z_]/.test(c);
  const isIdentifierPart = c => /[A-Za-z0-9_]/.test(c);

  while (i < source.length) {
    const c = source[i];

    if (/\s/.test(c)) {
      i += 1;
      continue;
    }

    if (isDigit(c) || (c === '.' && isDigit(source[i + 1] || ''))) {
      const start = i;
      let dotCount = 0;
      while (i < source.length && /[0-9.]/.test(source[i])) {
        if (source[i] === '.') dotCount += 1;
        if (dotCount > 1) throw new Error('Número inválido en la fórmula.');
        i += 1;
      }
      const n = Number(source.slice(start, i));
      if (!Number.isFinite(n)) throw new Error('Número inválido en la fórmula.');
      tokens.push({ type: 'number', value: n });
      continue;
    }

    if (c === '"' || c === "'") {
      const quote = c;
      i += 1;
      let value = '';
      let closed = false;
      while (i < source.length) {
        const ch = source[i++];
        if (ch === '\\') {
          if (i >= source.length) throw new Error('String incompleto en la fórmula.');
          const next = source[i++];
          const escapes = { n: '\n', r: '\r', t: '\t', '\\': '\\', '"': '"', "'": "'" };
          value += Object.prototype.hasOwnProperty.call(escapes, next) ? escapes[next] : next;
          continue;
        }
        if (ch === quote) {
          closed = true;
          break;
        }
        value += ch;
      }
      if (!closed) throw new Error('String sin cerrar en la fórmula.');
      tokens.push({ type: 'string', value });
      continue;
    }

    if (isIdentifierStart(c)) {
      const start = i++;
      while (i < source.length && isIdentifierPart(source[i])) i += 1;
      tokens.push({ type: 'identifier', value: source.slice(start, i) });
      continue;
    }

    const two = source.slice(i, i + 2);
    if (['>=', '<=', '==', '!='].includes(two)) {
      tokens.push({ type: 'op', value: two });
      i += 2;
      continue;
    }

    if (['+', '-', '*', '/', '>', '<'].includes(c)) {
      tokens.push({ type: 'op', value: c });
      i += 1;
      continue;
    }

    if (c === '%') {
      tokens.push({ type: 'percent', value: '%' });
      i += 1;
      continue;
    }

    if (c === '(') { tokens.push({ type: 'lparen', value: c }); i += 1; continue; }
    if (c === ')') { tokens.push({ type: 'rparen', value: c }); i += 1; continue; }
    if (c === ',') { tokens.push({ type: 'comma', value: c }); i += 1; continue; }

    // Punto fuera de un número implicaría acceso a propiedades (ej. avg.constructor), prohibido.
    if (c === '.') {
      throw new Error('El acceso a propiedades no está permitido en fórmulas.');
    }

    throw new Error(`Carácter no permitido en la fórmula: ${c}`);
  }

  tokens.push({ type: 'eof', value: null });
  return tokens;
}
