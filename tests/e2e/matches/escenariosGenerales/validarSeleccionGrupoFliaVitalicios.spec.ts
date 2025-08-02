import { test, expect } from '@playwright/test';
import { users } from '@users';


test('Socio con grupo familiar puede seleccionar libremente el grupo familiar', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(users.vitaliciosGrupoFamiliar);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(users.password);
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  });
  
  await test.step('Verify that vitalicios product exist and accessible', async () => {
    await page.getByText('Partidos').click();
    await page.waitForTimeout(1000);
    await page.getByTestId('test-automation-no-utilizar-ver-mas').click();
    await page.getByRole('button', { name: 'Obtener Generales' }).click(); 
    // Assert user is being autoselected
    await expect(page.locator('div').filter({ hasText: /^Alberto Test_zSocio #7789$/ }).nth(1).locator('[role="checkbox"]')).toHaveAttribute('aria-checked', 'true');  
    await page.getByRole('checkbox').nth(2).click();

    // Assert selected state through aria-checked attribute (correct for custom checkboxes)
    await expect(page.locator('div').filter({ hasText: /^Marcelo Test_varroSocio #17511$/ }).nth(2).locator('[role="checkbox"]')).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('div').filter({ hasText: /^Seleccionar todo el grupo familiar$/ }).first().locator('[role="checkbox"]')).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('div').filter({ hasText: /^Alberto Test_zSocio #7789$/ }).nth(1).locator('[role="checkbox"]')).toHaveAttribute('aria-checked', 'true');  

    await page.getByRole('checkbox').nth(1).click();
    await expect(page.locator('div').filter({ hasText: /^Seleccionar todo el grupo familiar$/ }).first().locator('[role="checkbox"]')).toHaveAttribute('aria-checked', 'false');
    await expect(page.locator('div').filter({ hasText: /^Alberto Test_zSocio #7789$/ }).nth(1).locator('[role="checkbox"]')).toHaveAttribute('aria-checked', 'false');
    await expect(page.locator('div').filter({ hasText: /^Marcelo Test_varroSocio #17511$/ }).nth(2).locator('[role="checkbox"]')).toHaveAttribute('aria-checked', 'true');
    await expect(page.getByRole('button', { name: 'Continuar' })).toBeEnabled();

    await page.getByRole('checkbox').nth(2).click();
    await expect(page.locator('div').filter({ hasText: /^Seleccionar todo el grupo familiar$/ }).first().locator('[role="checkbox"]')).toHaveAttribute('aria-checked', 'false');
    await expect(page.locator('div').filter({ hasText: /^Alberto Test_zSocio #7789$/ }).nth(1).locator('[role="checkbox"]')).toHaveAttribute('aria-checked', 'false');
    await expect(page.locator('div').filter({ hasText: /^Marcelo Test_varroSocio #17511$/ }).nth(2).locator('[role="checkbox"]')).toHaveAttribute('aria-checked', 'false');
    await expect(page.getByRole('button', { name: 'Continuar' })).not.toBeEnabled();

    await page.getByText('Seleccionar todo el grupo').click();
    await expect(page.locator('div').filter({ hasText: /^Seleccionar todo el grupo familiar$/ }).first().locator('[role="checkbox"]')).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('div').filter({ hasText: /^Alberto Test_zSocio #7789$/ }).nth(1).locator('[role="checkbox"]')).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('div').filter({ hasText: /^Marcelo Test_varroSocio #17511$/ }).nth(2).locator('[role="checkbox"]')).toHaveAttribute('aria-checked', 'true');
    await expect(page.getByRole('button', { name: 'Continuar' })).toBeEnabled();
  });
});