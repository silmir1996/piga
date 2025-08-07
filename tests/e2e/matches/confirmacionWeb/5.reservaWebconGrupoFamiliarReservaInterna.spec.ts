import { test, expect } from '@playwright/test';
import { executeStep, loginWithUserType } from '../../../shared/utils';

test('Socio pleno con grupo familiar Reserva Web para si mismo, y tambien para familiar habilitado para Reserva Interna + AS', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await loginWithUserType(page, 'socioConfirmacionWeb');
  });
  
  await test.step('Navigate to test match and verify available products', async () => {
    await page.getByText('Partidos').click();
    await page.waitForTimeout(1500);
    await page.getByTestId('test-automation-no-utilizar-ver-mas').click();
    await expect(page.getByText('TEST AUTOMATION (No utilizar)', { exact: true })).toBeVisible();
    // Assert the right products are visible
    await expect(page.getByText('Abono SolidarioActivo07/04/25, 00:15 hsObtener Plateas')).toBeVisible();
    await expect(page.getByText('GeneralesReserva de lugarObtener Generales')).toBeVisible();
  });


await test.step('Assert checkbox behavior on reservation process', async () => {
    await page.getByRole('button', { name: 'Obtener Generales' }).click();
    await expect(page.locator('div').filter({ hasText: /^Hector Anibal Test_adaSocio #169113$/ }).first()).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Marcelo Fernando Test_adaSocio #169100$/ }).first()).toBeVisible();
    // Handle checkbox interaction
    await expect(page.getByRole('button', { name: 'Reservar' })).not.toBeEnabled();
    await page.locator('div').filter({ hasText: /^Hector Anibal Test_adaSocio #169113$/ }).nth(2).click();
    await expect(page.getByRole('button', { name: 'Reservar' })).toBeEnabled();
    await page.locator('div').filter({ hasText: /^Marcelo Fernando Test_adaSocio #169100$/ }).nth(2).click();
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
    await expect(page.getByText('Hector Anibal Test_adaSocio #169113Ya reservaste')).toBeVisible();
    await expect(page.getByText('Marcelo Fernando Test_adaSocio #169100Ya reservaste')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reservar' })).not.toBeEnabled();
    await page.getByRole('button', { name: 'Ir atrás' }).click();
  });


  await test.step('Test Abono Solidario error handling', async () => {
    await page.getByRole('button', { name: 'Obtener Plateas' }).click();
    await page.locator('#path709').click();
    await page.getByRole('button', { name: 'Buscar asiento disponible' }).click();
    await executeStep(
      page,
      async () => {
        await page.getByRole('button', { name: 'Agregar platea' }).nth(1).click();
      },
      async () => {
        await page.getByRole('button', { name: 'Agregar platea' }).click();
        await page.locator('div').filter({ hasText: /^\$ 0$/ }).getByRole('button').click();
      }
    );

    // Assert error message for Hector Anibal Test_adaSocio #169113
    await page.locator('.css-175oi2r.r-bnwqim > .css-175oi2r.r-1otgn73').click();
    await page.getByText('HECTOR ANIBAL TEST_ADA').click();
    await expect(page.getByText('Ocurrió un error')).toBeVisible();
    await expect(page.getByText('El evento no tiene la venta')).toBeVisible();

    // Assert error message for Marcelo Fernando Test_adaSocio #169100
    await page.locator('.css-175oi2r.r-bnwqim > .css-175oi2r.r-1otgn73').click();
    await page.getByText('MARCELO FERNANDO TEST_ADA').click();
    await expect(page.getByText('Ocurrió un error')).toBeVisible();
    await expect(page.getByText('El evento no tiene la venta')).toBeVisible();
    
    // Clean up the reservation
    await page.getByRole('button', { name: 'Eliminar' }).click();
    await expect(page.getByText('¿QUERÉS ELIMINAR LA RESERVA?')).toBeVisible();
    await expect(page.getByText('Una vez que elimines la')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Volver' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sí, eliminar reserva' })).toBeVisible();
    await page.getByRole('button', { name: 'Sí, eliminar reserva' }).click();
    await executeStep(
      page,
      async () => {
        await expect(page.locator('div').filter({ hasText: /^Aún no agregaste entradas\.Acá verás las entradas que agregues\.$/ }).nth(2)).toBeVisible();
      },
      async () => {
      }
    );
    await page.getByRole('button', { name: 'Ir atrás' }).click();
    await page.getByRole('button', { name: 'Ir atrás' }).click();
  });
});
