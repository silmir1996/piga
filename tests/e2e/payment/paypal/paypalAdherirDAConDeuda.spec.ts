import { test, expect } from '@playwright/test';
import { executeStep, loginWithUserType } from '../../../shared/utils';

test('Adherir DA con deuda en tarjeta', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await loginWithUserType(page, 'socioDAConDeudaPaypal');
  });

  await test.step('Navigate to payment page and verify there is no debt', async () => {
    await page.getByText('Pagos').first().click();
    await page.waitForTimeout(1500);
  })    

  await test.step('Adherir DA with debt in paypal', async () => {
    await expect(page.getByText('Debés 11 cuotas')).toBeVisible();
    await page.getByRole('button', { name: 'Adherir a débito automático' }).click();
    await expect(page.getByText('Necesitás tener la cuota')).toBeVisible();
    await expect(page.getByText('Para adherirte al débito')).toBeVisible();
    await page.getByRole('button', { name: 'Pagar cuota' }).click();
    //Assert redirection to payment page
    await expect(page.getByRole('heading', { name: 'Detalle de pago' })).toBeVisible();
    await expect(page.getByText('Debés 11 cuotas')).toBeVisible();
    await expect(page.getByText('Pagar con tarjeta de crédito')).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: /^Acuerdo de pagos$/ })).toBeVisible();
  });
});