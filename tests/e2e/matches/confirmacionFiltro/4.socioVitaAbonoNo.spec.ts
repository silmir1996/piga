import { test, expect } from '@playwright/test';
import { loginWithUserType } from '../../../shared/utils';

test('Socio vitalicio con Abono no debe ver el producto', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await loginWithUserType(page, 'socioVitaAbono');
  });
  
  await test.step('Verify that the user does not see filtro products inside filtromatch', async () => {
    await page.getByText('Partidos').click();
    await page.waitForTimeout(500);
    await page.getByTestId('evento-filtro-automation-no-utilizar-ver-mas').click();
    await expect(page.getByText('Vitalicios')).not.toBeVisible();
    await expect(page.locator('body')).not.toContainText('Vitalicios');
    await expect(page.getByText('Obtener Generales')).not.toBeVisible();
    await expect(page.getByText('Abono Solidario')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Obtener Plateas' })).toBeVisible();
    await page.goto('https://bocasocios-tst.bocajuniors.com.ar/matches/875/confirmation');
    await expect(page.getByText('Hubo un problema')).toBeVisible();
  });
});