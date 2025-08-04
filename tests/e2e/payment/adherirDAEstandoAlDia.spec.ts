import { test, expect } from '@playwright/test';
import { executeStep, loginWithUserType } from '../../shared/utils';

test('Adherir DA estando al día y desadherirlo', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await loginWithUserType(page, 'socioDAEstandoAlDia');
  });

  await test.step('Navigate to payment page and verify there is no debt', async () => {
    await page.getByText('Pagos').first().click();
    await page.waitForTimeout(1500);
    await expect(page.getByText('Estás al día')).toBeVisible();
  })
  await test.step('Complete DA subscription flow', async () => {
    await page.getByRole('button', { name: 'Adherir a débito automático' }).click();
    await page.locator('.css-175oi2r.r-bnwqim > .css-175oi2r.r-1otgn73').click();
    await page.locator('div').filter({ hasText: /^Tarjeta de crédito$/ }).nth(1).click();
    await page.locator('.css-175oi2r > .css-175oi2r.r-117bsoe > .css-175oi2r.r-bnwqim > .css-175oi2r.r-1otgn73').click();
    await page.getByText('Visa Crédito').click();
    await page.getByRole('textbox', { name: 'Número de tarjeta' }).click();
    await page.getByRole('textbox', { name: 'Número de tarjeta' }).click();
    await page.getByRole('textbox', { name: 'Número de tarjeta' }).fill('4507990000004905');
    await page.getByRole('button', { name: 'Adherir a débito automático' }).click();
    await expect(page.getByRole('heading', { name: '¡Te adheriste al Débito autom' })).toBeVisible();
    await expect(page.getByText('Ahora disfrutá del tiempo que')).toBeVisible();
    await page.getByRole('button', { name: 'Volver a pagos' }).click();
  })

  await test.step('Complete DA unsubscription flow', async () => {
    await page.getByRole('button', { name: 'Dar de baja débito automático' }).click();
    await expect(page.getByText('¿Querés dar de baja tu débito automático?')).toBeVisible();
    await expect(page.getByText('Pasarás a pagar de forma manual tu cuota social todos los meses.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible();
    await page.getByRole('button', { name: 'Sí, dar de baja' }).click();
    await page.waitForTimeout(3000);
    await expect(page.getByText('Diste de baja tu débito automático')).toBeVisible();
    await expect(page.getByText('Ahora vas a pagar tu cuota de forma manual todos los meses.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Adherir a débito automático' })).toBeVisible();
  })
}); 