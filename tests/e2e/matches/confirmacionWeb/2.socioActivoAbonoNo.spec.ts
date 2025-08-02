import { test, expect } from '@playwright/test';
import { users } from '@users';


test('Socio Activo con Abono no visualice productos de confirmacion', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await page.goto('');
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(users.socioActivoAbono);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(users.password);
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  });
  
  await test.step('Verify that the user does not see confirmacion product', async () => {
    await page.getByText('Partidos').click();
    await page.getByTestId('test-automation-no-utilizar-ver-mas').click();
    await expect(page.getByText('Vitalicios')).not.toBeVisible();
    await expect(page.locator('body')).not.toContainText('Vitalicios');
    await expect(page.getByText('Obtener Generales')).not.toBeVisible();
    await expect(page.getByText('Abono Solidario')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Obtener Plateas' })).toBeVisible();
    await page.goto('https://bocasocios-tst.bocajuniors.com.ar/matches/855/confirmation');
    await expect(page.getByText('Hubo un problema')).toBeVisible();
    await page.getByRole('button', { name: 'Volver al inicio' }).click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Partidos')).toBeVisible();
  });
});