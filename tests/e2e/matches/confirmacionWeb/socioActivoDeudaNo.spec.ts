import { test, expect } from '@playwright/test';
import { users } from '@users';


test('Socio activo con deuda no visualice productos de confirmacion', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await page.goto('');
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(users.socioActivoCuota);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(users.password);
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  });
  
  await test.step('Verify that the user does not see confirmacion product and is redirected to the account page', async () => {
    await page.getByText('Partidos').click();
    await page.waitForTimeout(500);
    await page.getByTestId('test-automation-no-utilizar-ver-mas').click();

    await expect(page.getByText('NECESITÁS TENER LA CUOTA SOCIAL AL DÍA', { exact: true })).toBeVisible();
    await expect(page.getByText('Necesitás pagar la cuota')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pagar cuota' })).toBeVisible();
    await page.getByRole('button', { name: 'Pagar cuota' }).click();
    await expect(page.getByRole('heading', { name: 'Gestioná tu cuenta' }).getByRole('paragraph')).toBeVisible();
    await page.getByText('Partidos').click();
    await page.getByTestId('test-automation-no-utilizar-ver-mas').click();

    await page.locator('div').filter({ hasText: /^NECESITÁS TENER LA CUOTA SOCIAL AL DÍA$/ }).getByRole('button').click();
    await expect(page.getByText('Debés la cuota del 01/2025')).toBeVisible();
    await expect(page.getByText('Necesitás tener la cuota social al día para poder ingresar al estadio.', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Obtener Generales' }).click();
    await expect(page.getByRole('heading', { name: 'Reservá tu lugar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reservar' })).not.toBeEnabled();
    await expect(page.getByText('Debe cuota')).toBeVisible();
  });
});