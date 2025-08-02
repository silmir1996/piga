import { test, expect } from '@playwright/test';
import { users } from '@users';


test('Validar que Socio activo no visualice un producto de Vitalicios', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await page.goto('');
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(users.socioActivoCuota);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(users.password);
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  });
  
  await test.step('Verify that the user does not see vitalicios confirmacion product', async () => {
    await page.getByText('Partidos').click();
    await page.waitForTimeout(500);
    await page.getByTestId('test-automation-no-utilizar-ver-mas').click();
    await page.locator('div').filter({ hasText: /^NECESITÁS TENER LA CUOTA SOCIAL AL DÍA$/ }).getByRole('button').click();
    await expect(page.getByText('Vitalicios')).not.toBeVisible();
    await expect(page.locator('body')).not.toContainText('Vitalicios');
    await expect(page.getByText('Abono SolidarioActivo07/04/25, 00:15 hsObtener Plateas')).toBeVisible();
    await expect(page.getByText('GeneralesReserva de lugarObtener Generales')).toBeVisible();
  });
});