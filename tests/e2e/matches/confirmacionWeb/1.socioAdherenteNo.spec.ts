import { test, expect } from '@playwright/test';
import { loginWithUserType } from '../../../shared/utils';

test('Socio adherente no visualice productos de confirmacion ', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await loginWithUserType(page, 'socioAdherenteNo');
  });
  
  await test.step('Verify that the user does not see confirmacion products', async () => {
    await page.getByText('Partidos').click();
    await expect(page.getByText('Vitalicios')).not.toBeVisible();
    await expect(page.getByTestId('test-automation-no-utilizar-ver-mas')).not.toBeVisible();
    await expect(page.locator('body')).not.toContainText('TEST AUTOMATION (No utilizar)');
    await page.goto("https://bocasocios-tst.bocajuniors.com.ar/matches/855/assist?backUrl=/home");
    await expect(page.getByText('Página no encontrada')).toBeVisible();
    await page.getByRole('button', { name: 'Volver al inicio' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Inicio')).toBeVisible();
  });
});