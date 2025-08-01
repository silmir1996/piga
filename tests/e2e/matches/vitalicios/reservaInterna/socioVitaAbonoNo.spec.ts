import { test, expect } from '@playwright/test';
import { users } from '../../../../shared/utils/users';


test('Socio Vitalicios Abono no visualice productos de Vitalicios ', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await page.goto('');
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(users.socioVitaAbono);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(users.password);
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  });
  
  await test.step('Verify that the user does not see Vitalicios products inside vitalicios match', async () => {
    await page.getByText('Partidos').click();
    await page.getByTestId('test-automation-no-utilizar-ver-mas').click();
    await expect(page.getByText('Vitalicios')).not.toBeVisible();
    await expect(page.locator('body')).not.toContainText('Vitalicios');
    await expect(page.getByText('Abono Solidario')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Obtener Plateas' })).toBeVisible();
  });
});