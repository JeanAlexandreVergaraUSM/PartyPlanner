import { beforeEach, describe, expect, it, vi } from 'vitest';

function buildRouterDom() {
  document.body.innerHTML = `
    <div id="pfActions"></div>
    <button class="tab nav-tab" data-route="#/perfil"></button>
    <button class="tab nav-tab" data-route="#/notas"></button>
    <section id="page-perfil" class="page"></section>
    <section id="page-semestres" class="page"></section>
    <section id="page-horario" class="page"></section>
    <section id="page-notas" class="page"></section>
    <section id="page-malla" class="page"></section>
    <section id="page-calendario" class="page"></section>
    <section id="page-progreso" class="page"></section>
    <section id="page-asistencia" class="page"></section>
    <section id="page-party" class="page"></section>
    <section id="page-ayuda" class="page"></section>
  `;
}

describe('router', () => {
  beforeEach(() => {
    vi.resetModules();
    buildRouterDom();
    window.location.hash = '';
  });

  it('muestra Perfil como ruta segura por defecto', async () => {
    const { initRouter } = await import('../../src/router.js');
    initRouter();

    expect(document.getElementById('page-perfil').classList.contains('hidden')).toBe(false);
    expect(document.getElementById('page-notas').classList.contains('hidden')).toBe(true);
  });

  it('activa la página solicitada y emite route:change', async () => {
    const { initRouter, setActiveTab } = await import('../../src/router.js');
    initRouter();

    const listener = vi.fn();
    document.addEventListener('route:change', listener, { once: true });
    setActiveTab('#/notas');

    expect(document.getElementById('page-notas').classList.contains('hidden')).toBe(false);
    expect(document.getElementById('page-perfil').classList.contains('hidden')).toBe(true);
    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0][0].detail.route).toBe('#/notas');
  });

  it('normaliza rutas desconocidas hacia Perfil', async () => {
    const { initRouter, setActiveTab } = await import('../../src/router.js');
    initRouter();
    setActiveTab('#/ruta-inventada');

    expect(document.getElementById('page-perfil').classList.contains('hidden')).toBe(false);
    expect(document.getElementById('pfActions').classList.contains('hidden')).toBe(false);
  });
});
