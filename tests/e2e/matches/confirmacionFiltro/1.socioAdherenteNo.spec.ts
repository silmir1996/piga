import { test, expect } from '@playwright/test';
import { users } from '@users';


test('Socio adherente validar que visualice producto de abono solidario solamente', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(users.socioAdherenteNo);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(users.password);
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  });
  
  await test.step('Verify that the user does not see confirmacion products', async () => {
    await page.getByText('Partidos').click();
    await expect(page.getByText('Vitalicios')).not.toBeVisible();
    await expect(page.locator('body')).not.toContainText('TEST AUTOMATION (No utilizar)');
    await page.getByTestId('evento-filtro-automation-no-utilizar-ver-mas').click();
    await page.locator('div').filter({ hasText: /^NECESITÁS TENER LA CUOTA SOCIAL AL DÍA$/ }).getByRole('button').click();
    await expect(page.getByText('Abono SolidarioAdherente01/07/25, 00:00 hsObtener Plateas')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Obtener Generales' })).not.toBeVisible();
    await page.goto("https://bocasocios-tst.bocajuniors.com.ar/matches/875/confirmation");
    await expect(page.getByText('Hubo un problema')).toBeVisible();
    await page.getByRole('button', { name: 'Volver al inicio' }).click();
    await expect(page.getByText('Partidos')).toBeVisible();
  });
});