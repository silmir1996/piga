import { test, expect } from '@playwright/test';
import { users } from '../../../../shared/utils/users';


test('Socio adherente no visualice productos de Vitalicios ', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await page.goto('');
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(users.socioAdherenteNo);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(users.password);
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  });
  
  await test.step('Verify that the user does not see Vitalicios products', async () => {
    await page.getByText('Partidos').click();
    await expect(page.getByText('Vitalicios')).not.toBeVisible();
    await expect(page.getByTestId('test-automation-no-utilizar-ver-mas')).not.toBeVisible();
    await expect(page.locator('body')).not.toContainText('TEST AUTOMATION (No utilizar)');
    await page.goto("https://bocasocios-tst.bocajuniors.com.ar/matches/855/assist?backUrl=/home");
    await expect(page.getByText('Página no encontrada')).toBeVisible();
  });
});