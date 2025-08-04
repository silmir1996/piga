import { test, expect } from '@playwright/test';
import { executeStep, loginWithUserType } from '../../shared/utils';

test('Validar contador de cuotas y condicionalidad de botón IR A PAGAR', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await loginWithUserType(page, 'socioContadorCuotas');
  });

  await test.step('Navigate to payment page and verify counter of cuotas', async () => {
    await page.getByText('Pagos').first().click();
    await page.waitForTimeout(1500);
    await expect(page.getByText('Debés 4 cuotas')).toBeVisible();
    await page.getByRole('button', { name: 'Realizar pagos' }).click();
    await page.waitForTimeout(500);
    // Verify that the counter of cuotas is working properly
    await expect(page.getByText('Debés 4 cuotas')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^0$/ }).nth(1)).toBeVisible();
    await page.getByRole('img').nth(3).click();
    await expect(page.locator('div').filter({ hasText: /^1$/ }).nth(1)).toBeVisible();
    await expect(page.getByText('Cuota Social 04/2025Categoría')).toBeVisible();
    await expect(page.getByText('$ 19.200')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ir a pagar' })).not.toBeEnabled();
    await page.getByRole('img').nth(2).click();
    await expect(page.locator('div').filter({ hasText: /^0$/ }).nth(1)).toBeVisible();
    await expect(page.getByText('Cuota Social 04/2025Categoría')).not.toBeVisible();
    await expect(page.getByText('$ 19.200')).not.toBeVisible();
    //Select payment method and validate that the button Ir a pagar is enabled
    await page.getByRole('img').nth(4).click();
    await page.getByText('Visa Crédito').click();
    await expect(page.getByRole('button', { name: 'Ir a pagar' })).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Ir a pagar' })).toBeVisible();
    await page.getByRole('img').nth(2).click();
    await expect(page.getByRole('button', { name: 'Ir a pagar' })).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Ir a pagar' })).toBeVisible();
    await page.getByRole('img').nth(2).click();
    await page.getByRole('img').nth(3).click();

  });
});


