import { test, expect } from '@playwright/test';
import { users } from '@users';


test('Validar que se pueda hacer Reserva Filtro para socio y grupo familiar', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await page.goto('');
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(users.socioConfirmacionWeb);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(users.password);
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  });
  
  await test.step('Verify that the user does see confirmacion product', async () => {
    await page.getByText('Partidos').click();
    await page.waitForTimeout(500);
    await page.getByTestId('evento-filtro-automation-no-utilizar-ver-mas').click();
    await page.pause();
  });
});