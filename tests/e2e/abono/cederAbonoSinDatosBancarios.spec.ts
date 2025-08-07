import { test, expect } from '@playwright/test';
import { executeStep, loginWithUserType } from '../../shared/utils';

test('Ceder abono y recuperarlo', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await loginWithUserType(page, 'socioActivoAbonoSinDatosBancarios');
  });

  await test.step('Navigate to ceder abono page', async () => {
    await page.getByText('Partidos').first().click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Ceder' }).click();
  });       

  await test.step('Verify Ceder abono page and proper style', async () => {
    await page.getByText('Partidos').first().click();
    await page.waitForTimeout(500);
    await expect(page.getByRole('button', { name: 'Ceder', exact: true })).toHaveCSS('background-color', 'rgb(239, 176, 39)');
    await expect(page.getByRole('button', { name: 'Ceder', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Comprar' })).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(page.getByRole('button', { name: 'Comprar' })).toBeVisible();
    await expect(page.getByText('Evento Filtro Automation (No utilizar)Martes 09/12/2025, 16:45 hsPodés ceder')).toBeVisible();
    await page.locator('div').filter({ hasText: /^Podés ceder hastaJueves 06\/11\/2025, 02:00 hsCeder ubicación$/ }).getByRole('button').click();
  });       

  await test.step('Verify warning is displayed and redirection to cargar datos bancarios page', async () => {
    //Assert modal
    await expect(page.getByText('Necesitás cargar tus datos bancarios para gestionar los reintegros')).toBeVisible();
    await expect(page.getByText('Es necesario que cargues tus datos bancarios para gestionar los reintegros en caso de que cedas tu ubicación y esta se venda.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cargar datos bancarios' }).nth(1)).toBeVisible();
    await page.getByRole('button', { name: 'Omitir por ahora' }).click();
    //Assert redirection to cargar datos bancarios page
    await page.getByRole('checkbox').click();
    await page.getByRole('button', { name: 'Cargar datos bancarios' }).click();
    await expect(page.getByText('Mis datos bancarios')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cargar datos bancarios' })).toBeVisible();
    await expect(page.getByText('Aún no cargaste tus datos bancarios')).toBeVisible();
    await expect(page.getByText('Los reintegros al ceder y vender tu ubicación por Abono Solidario se realizarán a esta cuenta.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Datos bancarios' })).toBeVisible();
    await page.getByRole('button', { name: 'Cargar datos bancarios' }).click();
    await expect(page.getByText('Cargá tus datos bancarios')).toBeVisible();
  });   
}); 
 