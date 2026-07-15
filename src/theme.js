const THEME_STORAGE_KEY = 'partyplanner:theme:v1';
const VALID_THEMES = new Set(['dark', 'light']);

function safeStorage(){
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function normalizeTheme(value){
  return VALID_THEMES.has(value) ? value : 'dark';
}

export function getSavedTheme(){
  return normalizeTheme(safeStorage()?.getItem(THEME_STORAGE_KEY));
}

export function applyTheme(theme){
  const next = normalizeTheme(theme);
  const root = document.documentElement;
  root.dataset.theme = next;
  root.style.colorScheme = next;

  const button = document.getElementById('themeToggle');
  const icon = button?.querySelector('[data-theme-icon]');
  const label = button?.querySelector('[data-theme-label]');
  const targetLabel = next === 'dark' ? 'Modo claro' : 'Modo oscuro';

  if (icon) icon.textContent = next === 'dark' ? '☀️' : '🌙';
  if (label) label.textContent = targetLabel;
  if (button) {
    button.setAttribute('aria-label', `Cambiar a ${targetLabel.toLowerCase()}`);
    button.title = `Cambiar a ${targetLabel.toLowerCase()}`;
    button.setAttribute('aria-pressed', String(next === 'light'));
  }

  return next;
}

export function setTheme(theme){
  const next = applyTheme(theme);
  try {
    safeStorage()?.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // El cambio visual sigue funcionando aunque el navegador bloquee storage.
  }
  return next;
}

export function toggleTheme(){
  const current = normalizeTheme(document.documentElement.dataset.theme);
  return setTheme(current === 'dark' ? 'light' : 'dark');
}

export function initTheme(){
  applyTheme(getSavedTheme());

  const button = document.getElementById('themeToggle');
  if (!button || button.dataset.boundTheme === '1') return;

  button.dataset.boundTheme = '1';
  button.addEventListener('click', toggleTheme);
}

// Evita un destello claro antes de DOMContentLoaded cuando el usuario ya eligió tema.
if (typeof document !== 'undefined') {
  applyTheme(getSavedTheme());
}

export { THEME_STORAGE_KEY };
