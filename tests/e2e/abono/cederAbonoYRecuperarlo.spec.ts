import { test, expect } from '@playwright/test';
import { executeStep, loginWithUserType } from '../../shared/utils';

test('Ceder abono y recuperarlo', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await loginWithUserType(page, 'socioVitaAbono');
  });

  await test.step('Navigate to ceder abono page', async () => {
    await page.getByText('Partidos').first().click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Ceder' }).click();
  });       

  await test.step('Verify Ceder abono page and proper style', async () => {
    await page.getByText('Partidos').first().click();
    await expect(page.getByRole('button', { name: 'Ceder', exact: true })).toHaveCSS('background-color', 'rgb(239, 176, 39)');
    await expect(page.getByRole('button', { name: 'Ceder', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Comprar' })).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(page.getByRole('button', { name: 'Comprar' })).toBeVisible();
    await expect(page.getByText('Evento Filtro Automation (No utilizar)Martes 09/12/2025, 16:45 hsPodés ceder')).toBeVisible();
    await page.locator('div').filter({ hasText: /^Podés ceder hastaJueves 06\/11\/2025, 02:00 hsCeder ubicación$/ }).getByRole('button').click();
    await expect(page.getByText('Cedé tu ubicación')).toBeVisible();
    await expect(page.getByText('En caso de no poder asistir al partido, podés ceder el abono. Si se vende, te reintegramos el 100% del valor de el abono por este partido.')).toBeVisible();
  });       

  await test.step('Verify proper Procedimiento de Abono functionality and redirection', async () => {
    //Assert proper Procedimiento de Abono functionality and redirection
    await page.getByRole('checkbox').click();
    await expect(page.getByRole('checkbox')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ceder ubicación' }).first()).not.toBeEnabled();
    await page.getByRole('checkbox').click();
    await expect(page.getByRole('button', { name: 'Ceder ubicación' }).first()).toBeEnabled();
    await page.getByRole('paragraph').filter({ hasText: 'Procedimiento de Abono' }).click();
    await expect(page.getByRole('heading', { name: 'Centro de ayuda' })).toBeVisible();
    await page.getByRole('button', { name: 'Ir atrás' }).click();
    await page.getByRole('button', { name: 'Ceder ubicación' }).first().click();
  });

  await test.step('Initiate Ceder abono process and assert proper toast is visible', async () => {
    //Assert Ceder abono modal is visible
    await expect(page.getByText('¿Querés ceder el abono #19821 para este partido?')).toBeVisible();
    await expect(page.getByText('Sección PPN | Fila 3, Asiento 48Abono de Francisco Victor Test_gnoPodrás recuperarlo en caso de que te arrepientas mientras no sea comprada por otra persona.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible();
    //Assert Ceder abono modal is working and toast is visible
    await expect(page.getByRole('button', { name: 'Sí, ceder' })).toBeVisible();
    await page.getByRole('button', { name: 'Sí, ceder' }).click();
    await expect(page.getByText('Cediste tu ubicación').nth(1)).toBeVisible();
    await expect(page.getByText('Te reintegraremos su valor en caso de que otra persona la compre.')).toBeVisible();
  });

  await test.step('Initiate Recover abono process and assert toast is visible', async () => {
    await expect(page.locator('div').filter({ hasText: /^Cediste tu ubicación$/ }).nth(2)).toBeVisible();
    await page.getByRole('button', { name: 'Recuperar ubicación' }).click();
    await expect(page.getByText('¿Querés recuperar el abono #19821 para este partido?')).toBeVisible();
    await expect(page.getByText('Sección PPN | Fila 3, Asiento 48Abono de Francisco Victor Test_gnoTodavía estás a tiempo de recuperar el abono si querés asistir a este partido.')).toBeVisible();
    await page.getByRole('button', { name: 'Sí, recuperar' }).click();
    await expect(page.getByText('Recuperaste tu ubicación')).toBeVisible();
    await expect(page.getByText('Ya recuperaste el abono y podés usarlo para este partido.')).toBeVisible();
    await page.getByRole('button').nth(4).click();
  });
}); 
 
