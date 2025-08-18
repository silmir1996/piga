import { test, expect } from '@playwright/test';
import { executeStep, loginWithUserType } from '../../shared/utils';

test('Adherir DA con deuda en tarjeta', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await loginWithUserType(page, 'socioDAConDeudaTarjeta');
  });

  await test.step('Navigate to payment page and verify there is no debt', async () => {
    await page.getByText('Pagos').first().click();
    await page.waitForTimeout(1500);
    await expect(page.getByText('Debés 3 cuotas')).toBeVisible();
  })
  
  await test.step('Try to adherir DA with debt in card and verify error message', async () => {
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Adherir a débito automático' }).click();
    await page.waitForTimeout(500);
    await page.locator('.css-175oi2r.r-bnwqim > .css-175oi2r.r-1otgn73').click();
    await page.locator('div').filter({ hasText: /^Tarjeta de crédito$/ }).nth(1).click();
    await page.locator('.css-175oi2r > .css-175oi2r.r-117bsoe > .css-175oi2r.r-bnwqim > .css-175oi2r.r-1otgn73').click();
    await page.getByText('Visa Crédito').click();
    await page.getByRole('textbox', { name: 'Número de tarjeta' }).click();
    await page.getByRole('textbox', { name: 'Número de tarjeta' }).click();
    await page.getByRole('textbox', { name: 'Número de tarjeta' }).fill('4507990000004905');
    await page.getByRole('button', { name: 'Adherir a débito automático' }).click();
    await expect(page.getByText('Para poder adherirte tenés que tener tu cuota social al día')).toBeVisible();
    await page.getByRole('button').nth(3).click();
  })
}); 