import { test, expect } from '@playwright/test';
import { executeStep, loginWithUserType, testAbonoSolidarioErrorHandling } from '../../../shared/utils';

test('Validar que se pueda hacer Reserva Filtro para socio y grupo familiar', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await loginWithUserType(page, 'socioReservaFiltroConFamiliar');
  });
  
  await test.step('Navigate to test match and verify available products', async () => {
    await page.getByText('Partidos').click();
    await page.waitForTimeout(1500);
    await page.getByTestId('evento-filtro-automation-no-utilizar-ver-mas').click();
    await expect(page.getByText('Evento Filtro Automation (No utilizar)', { exact: true })).toBeVisible();
    // Assert the right products are visible
    await expect(page.getByText('Abono SolidarioActivo01/07/25, 00:30 hsObtener Plateas')).toBeVisible();
    await expect(page.getByText('GeneralesReserva de lugarObtener Generales')).toBeVisible();
  });

await test.step('Assert checkbox behavior on reservation process', async () => {
    await page.getByRole('button', { name: 'Obtener Generales' }).click();
    await expect(page.locator('div').filter({ hasText: /^Facundo Martin Test_onSocio #208715$/ }).first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Marisa Belen Test_isSocio #204167$/ }).first()).toBeVisible();
    // Handle checkbox interaction
    await expect(page.getByRole('button', { name: 'Reservar' })).not.toBeEnabled();
    await page.locator('div').filter({ hasText: /^Facundo Martin Test_onSocio #208715$/ }).nth(2).click();
    await expect(page.getByRole('button', { name: 'Reservar' })).toBeEnabled();
    await page.locator('div').filter({ hasText: /^Marisa Belen Test_isSocio #204167$/ }).nth(2).click();
    await expect(page.getByRole('button', { name: 'Reservar' })).toBeEnabled();
    //Continuar
    await expect(page.getByRole('button', { name: 'Reservar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reservar' })).toBeEnabled();
  });

  await test.step('Complete confirmation process', async () => {
    await page.getByRole('button', { name: 'Reservar' }).click();
    await expect(page.getByRole('main')).toContainText('¡YA TENÉS TU LUGAR EN LA BOMBONERA!');
    await expect(page.getByRole('main')).toContainText('En cuestión de minutos, lo verás reflejado en tu cuenta y podrás descargar el comprobante desde el Historial.');
    await expect(page.getByRole('button', { name: 'Ver reserva' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Volver al inicio' })).toBeVisible();
    // Assert the reservation is visible
    await page.getByRole('button', { name: 'Ver reserva' }).click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Facundo Martin Test_onSocio #208715')).toBeVisible();
    await expect(page.getByText('Marisa Belen Test_isSocio #204167')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reservar' })).not.toBeEnabled();
    await page.getByRole('button', { name: 'Ir atrás' }).click();
  });

  await test.step('Test Abono Solidario error handling', async () => {
    await testAbonoSolidarioErrorHandling(
      page,
      '#path724',
      ['MARISA BELEN TEST_IS', 'FACUNDO MARTIN TEST_ON']
    );
  });
});
