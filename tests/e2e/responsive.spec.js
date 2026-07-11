import { expect, test } from '@playwright/test';

test.describe('PartyPlanner - responsive smoke', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('la pantalla de perfil sigue siendo utilizable en móvil', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#signInBtn')).toBeVisible();
    await expect(page.locator('#page-perfil')).toBeVisible();

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 2);
  });
});
