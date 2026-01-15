import { expect, test } from '@playwright/test';
import { loginWithUserType } from '@shared/utils/login';
import {
  waitForElementVisible,
  selectCheckboxByOldestDate,
  selectCUITFromCombobox,
  verifyCUITOnPage,
  validateConfirmationData,
  clickCompensarSaldoWithRetry
} from '@shared/utils/element-utils';
import { domains } from '@shared/utils/domains';



test('[LOGIN-AGIP-001] Realizar compensacion de saldo', async ({ page }) => {
  // Variable para almacenar el período seleccionado
  let selectedPeriod: string | undefined;

  await test.step('Enter credentials and navigate to Nueva Cuenta Corriente', async () => {
    await loginWithUserType(page, 'userAgip');
  });

  await test.step('Seleccionar a DirectTV y acceder a Nueva Cuenta Corriente', async () => {
    const expectedCUIT = '30685889397';
    await selectCUITFromCombobox(page, expectedCUIT);
    await page.getByRole('link', { name: 'Nueva Cuenta Corriente' }).click();
    await verifyCUITOnPage(page, expectedCUIT);
  });

  await test.step('Verificar que se ingresó correctamente y navegar a Operaciones', async () => {
    await waitForElementVisible(page, page.getByText('DIRECTV ARGENTINA S.R.L.', { exact: false }), 60000);
    await page.getByRole('button', { name: 'Operaciones' }).click();
    await clickCompensarSaldoWithRetry(page);
  });

  await test.step('Seleccionar la factura más antiguo, e ingresar dominio', async () => {
    await page.locator('.v-input--selection-controls__ripple').first().click();
    await page.getByText('¿Desea compensar una deuda de').click();
    const domainInput = page.getByRole('textbox', { name: 'Partida/Patente' });
    await domainInput.click();
    await domainInput.fill(domains.domain);
    await page.waitForTimeout(5000);
    await page.getByRole('button', { name: 'Continuar' }).click();
  });
    
  await test.step('Seleccionar el concepto más antiguo, y continuar', async () => {
    const selectedRow = await selectCheckboxByOldestDate(page, {
      dateColumnHeader: 'Fecha Vto',
      rowSelector: 'tr',
      sortByColumn: true,
      timeout: 30000
    });
    
    selectedPeriod = selectedRow.periodText || selectedRow.dateText;
    console.log(`Selected period: ${selectedPeriod}`);
    await page.getByRole('button', { name: 'Continuar' }).click();
  });

  await test.step('Validar datos y confirmar la operación', async () => {
    await validateConfirmationData(page, domains.domain, selectedPeriod);
    await waitForElementVisible(page, page.getByText('Confirmar', { exact: false }), 60000);
    await expect(page.getByRole('button', { name: 'Confirmar' })).toBeEnabled();
  });
});
