import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('tema oscuro y claro', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    document.documentElement.dataset.theme = 'dark';
    document.body.innerHTML = `
      <button id="themeToggle">
        <span data-theme-icon></span>
        <span data-theme-label></span>
      </button>
    `;
  });

  it('parte en oscuro y permite cambiar a claro', async () => {
    const { initTheme } = await import('../../src/theme.js');
    initTheme();

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.querySelector('[data-theme-label]').textContent).toBe('Modo claro');

    document.getElementById('themeToggle').click();

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(document.querySelector('[data-theme-label]').textContent).toBe('Modo oscuro');
    expect(localStorage.getItem('partyplanner:theme:v1')).toBe('light');
  });

  it('restaura el tema guardado', async () => {
    localStorage.setItem('partyplanner:theme:v1', 'light');
    const { initTheme } = await import('../../src/theme.js');
    initTheme();

    expect(document.documentElement.dataset.theme).toBe('light');
  });
});
