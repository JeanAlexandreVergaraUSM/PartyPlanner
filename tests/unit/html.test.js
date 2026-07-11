import { beforeEach, describe, expect, it } from 'vitest';
import {
  escapeAttr,
  escapeHtml,
  safeHexColor,
  safeImageDataUrl,
  setLabeledText,
} from '../../src/security/html.js';

describe('helpers HTML seguros', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('escapa caracteres con significado HTML', () => {
    expect(escapeHtml(`<img src=x onerror="alert('x')">`))
      .toBe('&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;');
    expect(escapeAttr('`"><svg>')).toBe('&#96;&quot;&gt;&lt;svg&gt;');
  });

  it('acepta solo colores hexadecimales de seis dígitos', () => {
    expect(safeHexColor('#A1b2C3')).toBe('#A1b2C3');
    expect(safeHexColor('red')).toBe('#64748b');
    expect(safeHexColor('#fff', '#000000')).toBe('#000000');
  });

  it('acepta data URLs de imágenes permitidas y rechaza contenido ejecutable', () => {
    expect(safeImageDataUrl('data:image/png;base64,aGVsbG8=')).toBe('data:image/png;base64,aGVsbG8=');
    expect(safeImageDataUrl('javascript:alert(1)')).toBe('');
    expect(safeImageDataUrl('data:text/html;base64,PGgxPkU8L2gxPg==')).toBe('');
  });

  it('escribe etiquetas y valores como nodos de texto, no como HTML', () => {
    const host = document.createElement('div');
    setLabeledText(host, 'Nombre', '<img src=x onerror=alert(1)>');

    expect(host.querySelector('b')?.textContent).toBe('Nombre:');
    expect(host.textContent).toContain('<img src=x onerror=alert(1)>');
    expect(host.querySelector('img')).toBeNull();
  });
});
