import { expect, test } from '@playwright/test';

test.describe('PartyPlanner - smoke tests del shell público', () => {
  test('carga la aplicación sin errores JavaScript no controlados', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));

    await page.goto('/');
    await expect(page).toHaveTitle('PartyPlanner');
    await expect(page.locator('#signInBtn')).toBeVisible();
    await expect(page.locator('#page-perfil')).toBeVisible();
    await expect(page.locator('#userBadge')).toBeHidden();

    expect(pageErrors).toEqual([]);
  });

  test('mantiene las secciones privadas deshabilitadas sin autenticación', async ({ page }) => {
    await page.goto('/');

    const protectedRoutes = [
      '#/semestres',
      '#/horario',
      '#/notas',
      '#/malla',
      '#/calendario',
      '#/asistencia',
      '#/party',
    ];

    for (const route of protectedRoutes) {
      const tab = page.locator(`.nav-tab[data-route="${route}"]`);
      await expect(tab).toHaveAttribute('aria-disabled', 'true');
      await expect(tab).toHaveAttribute('disabled', '');
    }
  });

  test('una ruta desconocida vuelve de forma segura a Perfil', async ({ page }) => {
    await page.goto('/#/ruta-inexistente');
    await expect(page.locator('#page-perfil')).toBeVisible();
    await expect(page.locator('#page-notas')).toBeHidden();
  });

  test('incluye una política CSP base en el documento', async ({ page }) => {
    await page.goto('/');
    const csp = page.locator('meta[http-equiv="Content-Security-Policy"]');
    await expect(csp).toHaveCount(1);
    const content = await csp.getAttribute('content');
    expect(content).toContain("object-src 'none'");
    expect(content).not.toContain("script-src 'self' 'unsafe-inline'");
    expect(content).not.toContain("script-src 'self' 'unsafe-eval'");
  });
});
