import { test, expect } from '@playwright/test';
import { loginWithUserType } from '../../../shared/utils';

test('Validar que se pueda hacer Reserva Filtro para socio y grupo familiar', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await loginWithUserType(page, 'socioConfirmacionWeb');
  });
  
  await test.step('Verify that the user does see confirmacion product', async () => {
    await page.getByText('Partidos').click();
    await page.waitForTimeout(500);
    await page.getByTestId('evento-filtro-automation-no-utilizar-ver-mas').click();
    await page.pause();
  });
});