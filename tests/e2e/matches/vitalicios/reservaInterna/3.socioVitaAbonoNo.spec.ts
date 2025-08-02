import { test, expect } from '@playwright/test';
import { loginWithUserType } from '../../../../shared/utils';

test('Socio vitalicio con abono no debe visualizar productos Vitalicios Reserva interna', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await loginWithUserType(page, 'socioVitaAbono');
  });
  
  await test.step('Verify that the user does not see Vitalicios products inside vitalicios match', async () => {
    await page.getByText('Partidos').click();
    await page.getByTestId('test-automation-no-utilizar-ver-mas').click();
    await expect(page.getByText('Vitalicios')).not.toBeVisible();
    await expect(page.locator('body')).not.toContainText('Vitalicios');
    await expect(page.getByText('Obtener Generales')).not.toBeVisible();
    await expect(page.getByText('Abono Solidario')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Obtener Plateas' })).toBeVisible();
  });
});