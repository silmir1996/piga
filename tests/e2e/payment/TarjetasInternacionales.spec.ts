import { test, expect } from '@playwright/test';
import { executeStep, loginWithUserType } from '../../shared/utils';

test('Validar wording de tarjetas en Pagos Internacionales', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await loginWithUserType(page, 'socioTarjetasInternacionales');
  });

  await test.step('Navigate to payment page and verify counter of cuotas', async () => {
    await page.getByText('Pagos').first().click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Realizar pagos' }).click();
    await page.waitForTimeout(500);
  });

  await test.step('Validate wording of cards in International Payments', async () => {
    await expect(page.getByText('Pagar con tarjeta de crédito')).toBeVisible();
    await page.locator('.css-175oi2r > div > .css-175oi2r.r-1loqt21 > div').first().click();
    await page.locator('.css-175oi2r.r-bnwqim > .css-175oi2r.r-1otgn73').click();
    //Select Visa Crédito
    await page.locator('div').filter({ hasText: /^Visa Crédito$/ }).nth(1).click();
    await page.getByRole('img').nth(3).click();
    await expect(page.locator('div').filter({ hasText: /^1$/ }).nth(1)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ir a pagar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ir a pagar' })).toBeEnabled();
    await expect(page.getByText('Cuota Social 12/')).toBeVisible();
    await expect(page.getByText('Categoría Socio Internacional')).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Total a pagar' })).toBeVisible();
    await expect(page.locator('.css-175oi2r > div > .css-175oi2r.r-1loqt21 > div').first()).toBeVisible();
  });
  
  await test.step('Validate counter functionality and UI changes on mobile', async () => {
    //Assert that when counter is 0, the button Ir a pagar and the resume is not visible
    await page.getByRole('img').nth(2).click();
    await expect(page.locator('div').filter({ hasText: /^0$/ }).nth(1)).toBeVisible();
    //Validate that on mobile is still visible Ir a pagar button but not enabled
    await executeStep(
        page,
        async () => {
            await expect(page.getByRole('button', { name: 'Ir a pagar' })).not.toBeVisible();
        },
        async () => {
            await expect(page.getByRole('button', { name: 'Ir a pagar' })).toBeVisible();
            await expect(page.getByRole('button', { name: 'Ir a pagar' })).not.toBeEnabled();
        }
      );
    await expect(page.getByText('Cuota Social 12/')).not.toBeVisible();
    await expect(page.getByText('Categoría Socio Internacional')).not.toBeVisible();
    //Validate that Total a pagar is not visible on desktop but is visible on mobile
    await executeStep(
        page,
        async () => {
            await expect(page.getByRole('paragraph').filter({ hasText: 'Total a pagar' })).not.toBeVisible();
        },
        async () => {
            await expect(page.getByRole('paragraph').filter({ hasText: 'Total a pagar' })).toBeVisible();
        }
      );
  });

  await test.step('Validate switch behaviour', async () => {
    //Assert the switch is enabled and disabled
    await expect(page.locator('.css-175oi2r > div > .css-175oi2r.r-1loqt21 > div').first()).toBeVisible();
    await expect(page.locator('.css-175oi2r > div > .css-175oi2r.r-1loqt21 > div').first()).toHaveCSS('background-color', 'rgb(239, 176, 39)');
    await expect(page.getByText('Medio de pago')).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: /^Acuerdo de pagos$/ })).not.toBeVisible();
    //Assert that when switch is disabled, payment method is not visible and Acuerdo de pagos is visible
    await page.locator('.css-175oi2r > div > .css-175oi2r.r-1loqt21 > div').first().click();
    await expect(page.locator('.css-175oi2r > div > .css-175oi2r.r-1loqt21 > div').first()).toHaveCSS('background-color', 'rgb(218, 224, 235)');
    await expect(page.getByText('Medio de pago')).not.toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: /^Acuerdo de pagos$/ })).toBeVisible();
  });
});