import { test, expect } from '@playwright/test';
import { loginWithUserType } from '../../../shared/utils';

test('Socio pleno con grupo familiar Reserva Interna para si mismo, y tambien para familiar habilitado para Reserva Web + AS', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await loginWithUserType(page, 'socioConfirmacionWeb'); //cambiar
  });
  
  await test.step('Verify that the user does see confirmacion product', async () => {
    await page.getByText('Partidos').click();
    await page.waitForTimeout(500);
    await page.getByTestId('test-automation-no-utilizar-ver-mas').click();
    await page.pause();
  });
});