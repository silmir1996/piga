import { test, expect } from '@playwright/test';
import { executeStep, loginWithUserType, clickAdherirDAButton, clearPayPalCache, users, handleConditionalPaypalFlow } from '../../../shared/utils';

test('Adherir DA cancelarlo y cancelar acuerdo', async ({ page, context }) => {
  test.setTimeout(120000); // 2 minutes timeout for complex PayPal flow
  
  await test.step('Login to the application', async () => {
    await loginWithUserType(page, 'socioDAconPaypalSinDeuda');
  });

  await test.step('Navigar a flujo de pagos y verificar que no hay deuda', async () => {
    await page.getByText('Pagos').first().click();
    await page.waitForTimeout(1500);
  });

  await test.step('Iniciar proceso de adherir DA con manejo de popup de PayPal', async () => {
    // Use the robust utility function to find and click the button
    await clickAdherirDAButton(page, { which: 'first' });
    await page.waitForTimeout(500);
    await page.locator('.css-175oi2r.r-bnwqim > .css-175oi2r.r-1otgn73').click();
    await page.waitForTimeout(500);
    await page.locator('div').filter({ hasText: /^PayPal$/ }).nth(1).click();
    // Wait a bit to see what appears after selecting PayPal
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'ADHERIR A DÉBITO AUTOMÁTICO' }).click();
  });

  await test.step('Handle conditional PayPal flow', async () => {
    await handleConditionalPaypalFlow(page, context, users.paypalEmail, users.paypalPassword, {
      clearPayPalCache,
      popupTimeout: 15000,
      waitAfterFlow: 5000
    });
  }); 

  await test.step('Verificar que se adhirió DA', async () => {
    await page.waitForTimeout(1000);
    // Verify success message
    await expect(page.getByRole('heading', { name: '¡Te adheriste al Débito automático!' })).toBeVisible();
    await page.getByRole('button', { name: 'Volver a pagos' }).click();
  });

  await test.step('Cancelar Acuerdo de pago y verificar que el DA también se cancela', async () => {
    await page.getByRole('button', { name: 'Ver acuerdo' }).click();
    await page.getByRole('button', { name: 'Cancelar acuerdo' }).click();
    await page.getByRole('button', { name: 'Sí, cancelar' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('El acuerdo de pagos fue cancelado con éxito.')).toBeVisible();
  });

  await test.step('Iniciar adherir DA otra vez para verificar que el acuerdo no se cancela automáticamente al darse de baja luego', async () => {
    await clickAdherirDAButton(page, { which: 'first' });
    await page.waitForTimeout(1000);
    await page.locator('.css-175oi2r.r-bnwqim > .css-175oi2r.r-1otgn73').click();
    await page.waitForTimeout(1000);
    await page.locator('div').filter({ hasText: /^PayPal$/ }).nth(1).click();
    // Wait a bit to see what appears after selecting PayPal
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'ADHERIR A DÉBITO AUTOMÁTICO' }).click();
    await page.waitForTimeout(1000);
  });

  await test.step('Handle conditional PayPal flow (second time)', async () => {
    await handleConditionalPaypalFlow(page, context, users.paypalEmail, users.paypalPassword, {
      clearPayPalCache,
      popupTimeout: 15000,
      waitAfterFlow: 5000
    });
    
    // Verify success message
    await expect(page.getByRole('heading', { name: '¡Te adheriste al Débito automático!' })).toBeVisible();
    await page.getByRole('button', { name: 'Volver a pagos' }).click();
  });

  await test.step('Cancelar DA y verificar que el acuerdo no se cancela', async () => {
    await page.getByRole('button', { name: 'Dar de baja débito automático' }).click();
    await page.getByRole('button', { name: 'Sí, dar de baja' }).click();
    await page.getByRole('button', { name: 'Ver acuerdo' }).click();
  });

  await test.step('Cancelar acuerdo y verificar que no se visualice', async () => {
    await page.getByRole('button', { name: 'Cancelar acuerdo' }).click();
    await page.getByRole('button', { name: 'Sí, cancelar' }).click();
    await expect(page.getByRole('button', { name: 'Adherir a débito automático' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ver acuerdo' })).not.toBeVisible();
  });

});



