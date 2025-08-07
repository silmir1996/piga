import { test, expect } from '@playwright/test';
import { loginWithUserType } from '../../../shared/utils';

test('Socio que no pertenece al Filtro pero si gestiona a un familiar que aplica, no debe visualizar el producto', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await loginWithUserType(page, 'socioReservaFiltroNoConFamiliarSi');
  });
  
  await test.step('Verify that the user does not see confirmacion product', async () => {
    await page.getByText('Partidos').click();
    await page.waitForTimeout(500);
    await page.getByTestId('evento-filtro-automation-no-utilizar-ver-mas').click();
    await expect(page.getByText('NECESITÁS TENER LA CUOTA SOCIAL AL DÍA', { exact: true })).toBeVisible();
    await page.locator('div').filter({ hasText: /^NECESITÁS TENER LA CUOTA SOCIAL AL DÍA$/ }).getByRole('button').click();
    await expect(page.getByRole('button', { name: 'Obtener Generales' })).not.toBeVisible();
    await expect(page.getByText('Abono SolidarioActivo01/07/25, 00:30 hsObtener Plateas')).toBeVisible();
    await expect(page.getByText('Evento Filtro Automation (No utilizar)')).toBeVisible();
  });
});
