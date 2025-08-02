import { test, expect } from '@playwright/test';
import { loginWithUserType } from '../../../shared/utils';

test('Validar que Socio habilitado para Reserva Filtro no visualice a familiar que no aplica', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await loginWithUserType(page, 'socioReservaFiltroSinFamiliar');
    await page.waitForTimeout(500);
  });
  
  await test.step('Verify that the user has family group', async () => {
    await page.getByText('Mi cuenta').click();
    await page.getByText('Grupo familiar').click();
    await expect(page.getByText('GABRIEL OSCAR', { exact: true })).toBeVisible();
    await expect(page.getByText('Gestionás la cuenta de GABRIEL OSCAR')).toBeVisible();
  });

  await test.step('Verify that the family member does not see confirmacion product but owner does', async () => {
    await page.getByText('Partidos').click();
    await page.waitForTimeout(500);
    await page.getByTestId('evento-filtro-automation-no-utilizar-ver-mas').click();
    await page.getByRole('button', { name: 'Obtener Generales' }).click();
    await expect(page.getByText('Gabriel Oscar')).not.toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Lautaro Test_ioSocio #211872$/ }).nth(2)).toBeVisible();
  });
});