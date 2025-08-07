import { test, expect } from '@playwright/test';
import { loginWithUserType } from '../../../shared/utils';

test('Socio pleno con abono no debe visualizar producto', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await loginWithUserType(page, 'socioActivoAbono');
  });
  
  await test.step('Verify that the user does not see confirmacion product', async () => {
    await page.getByText('Partidos').click();
    await expect(page.getByText('Vitalicios')).not.toBeVisible();
    await expect(page.locator('body')).not.toContainText('Vitalicios');
    await page.waitForTimeout(500);
    await page.getByTestId('evento-filtro-automation-no-utilizar-ver-mas').click();
    await expect(page.getByText('Obtener Generales')).not.toBeVisible();
    await expect(page.getByText('Abono SolidarioActivo01/07/25, 00:30 hsObtener Plateas')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Obtener Plateas' })).toBeVisible();
    await page.goto('https://bocasocios-tst.bocajuniors.com.ar/matches/875/confirmation');
    await expect(page.getByText('Hubo un problema')).toBeVisible();
    await page.getByRole('button', { name: 'Volver al inicio' }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Partidos')).toBeVisible();
  });
});