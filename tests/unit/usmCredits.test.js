import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const csvPath = path.resolve(process.cwd(), 'public/data/ictel_malla.csv');

function readCreditsByCode() {
  const lines = fs.readFileSync(csvPath, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean);

  const headers = lines[0].split(';');
  const codeIndex = headers.indexOf('Código Asignatura');
  const creditsIndex = headers.indexOf('Créditos');
  const result = new Map();

  for (const line of lines.slice(1)) {
    const columns = line.split(';');
    result.set(columns[codeIndex], Number(columns[creditsIndex]));
  }

  return result;
}

describe('Créditos actualizados de memorias USM', () => {
  it('mantiene los créditos oficiales solicitados', () => {
    const credits = readCreditsByCode();

    expect(credits.get('MAT-270')).toBe(7);
    expect(credits.get('ILN-250')).toBe(6);
    expect(credits.get('IWG-397')).toBe(6);
    expect(credits.get('IWG-396')).toBe(6);
    expect(credits.get('IWG-394')).toBe(9);
    expect(credits.get('IWG-399')).toBe(6);
    expect(credits.get('IWG-398')).toBe(6);
    expect(credits.get('IWG-395')).toBe(12);
  });
});
