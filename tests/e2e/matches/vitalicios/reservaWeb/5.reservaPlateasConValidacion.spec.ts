import { test, expect } from '@playwright/test';
import { users } from '@users';


test('Socio vitalicio Reserva Web Platea + valida no permitir sacar Abono solidario ni Reserva Web Populares', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await page.goto('');
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(users.reservaWebPlateasVitalicio);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(users.password);
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  });

  await test.step('Navigate to test match and verify available products', async () => {
    await page.getByText('Partidos').click();
    await page.waitForTimeout(1000);
    await page.getByTestId('test-automation-no-utilizar-ver-mas').click();
    await expect(page.getByText('TEST AUTOMATION (No utilizar)', { exact: true })).toBeVisible();
    
    // Assert the right products are visible
    await expect(page.getByText('PlateasVitaliciosObtener Plateas')).toBeVisible();
    await expect(page.getByText('Abono SolidarioActivo07/04/25, 00:15 hsObtener Plateas')).toBeVisible();
    await expect(page.getByText('GeneralesVitaliciosObtener Generales')).toBeVisible();
  });

  await test.step('Complete Plateas reservation process', async () => {
    
    await page.getByRole('button', { name: 'Obtener Plateas' }).first().click();
    await expect(page.getByRole('main')).toContainText('Vicente Gabriel Test_toSocio #17351');
    
    // Handle checkbox interaction
    await page.getByRole('checkbox').isVisible();
    await page.getByRole('checkbox').click();
    await expect(page.getByRole('checkbox')).toBeChecked();

    // Assert dropdown has same sector available as stadium map
    await expect(page.getByText('Sector').nth(1)).toBeVisible();
    await expect(page.locator('.css-175oi2r.r-bnwqim > .css-175oi2r.r-1otgn73')).toBeVisible();

    // Dropdown and sector validation
    await page.locator('.css-175oi2r.r-bnwqim > .css-175oi2r.r-1otgn73').click();
    await expect(page.getByRole('button', { name: 'Continuar' })).toBeDisabled();
    
    // Assert section H is green (not selected) before clicking
    await expect(page.locator('.stadium-map [id^=seccion-H] *:not([id^=text])')).toHaveCSS('fill', 'rgb(45, 133, 80)');
    await page.getByText('Seccion H').click();
    // Assert section H is yellow (selected) after clicking
    await expect(page.locator('.stadium-map [id^=seccion-H] *:not([id^=text])')).toHaveCSS('fill', 'rgb(239, 176, 39)');
    await expect(page.getByRole('button', { name: 'Continuar' })).toBeEnabled();
    await page.getByRole('button', { name: 'Continuar' }).click();
    
    // Confirm Seat
    await page.getByRole('button', { name: 'Buscar asiento disponible' }).click();
    await expect(page.getByText('Sector H | Fila 4, Asiento')).toBeVisible;
    await page.getByRole('button', { name: 'Reservar ubicación' }).click();
    await expect(page.getByText('¿Querés confirmar esta ubicación?')).toBeVisible();
    await expect(page.getByRole('main')).toContainText('Estás a punto de confirmar la reserva en el Sector H. Una vez confirmada, no podrás cambiar la ubicación.');
    await expect(page.getByRole('button', { name: 'Volver' })).toBeVisible();
    await page.getByRole('button', { name: 'Sí, confirmar reserva' }).click();
  });

  await test.step('Verify reservation success and details', async () => {
    await expect(page.getByRole('main')).toContainText('¡YA TENÉS TU LUGAR EN LA BOMBONERA!');
    await expect(page.getByRole('main')).toContainText('En cuestión de minutos, lo verás reflejado en tu cuenta y podrás descargar el comprobante desde el Historial.');
    await expect(page.getByRole('button', { name: 'Ver reserva' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Volver al inicio' })).toBeVisible();
    
    // Assert the reservation is visible
    await page.getByRole('button', { name: 'Ver reserva' }).click();
    await expect(page.getByText('Ya reservaste')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancelar reserva' })).toBeVisible();
    await page.getByRole('button', { name: 'Ir atrás' }).click();
  });

  await test.step('Verify generales are unavailable after reservation', async () => {
    await page.getByRole('button', { name: 'Obtener generales' }).first().click();
    await expect(page.getByRole('img').nth(1)).toBeVisible();
    await expect(page.getByText('Por el momento no podés')).toBeVisible();
    await expect(page.getByText('Es probable que ya cuentes')).toBeVisible();
    await expect(page.getByRole('button', { name: 'VOLVER AL PARTIDO' })).toBeVisible();
    await page.getByRole('button', { name: 'VOLVER AL PARTIDO' }).click();
  });

  await test.step('Test Abono Solidario error handling', async () => {
    await page.getByRole('button', { name: 'Obtener Plateas' }).nth(1).click();
    await page.locator('#path709').click();
    await page.getByRole('button', { name: 'Buscar asiento disponible' }).click();
    await page.getByRole('button', { name: 'Agregar platea' }).nth(1).click();
    await page.locator('.css-175oi2r.r-bnwqim > .css-175oi2r.r-1otgn73').click();
    await page.locator('div').filter({ hasText: /^VICENTE GABRIEL TEST_TO$/ }).nth(1).click();
    
    await expect(page.getByText('Ocurrió un error')).toBeVisible();
    await expect(page.getByText('El evento no tiene la venta')).toBeVisible();
    
    // Clean up the reservation
    await page.getByRole('button', { name: 'Eliminar' }).click();
    await expect(page.getByText('¿QUERÉS ELIMINAR LA RESERVA?')).toBeVisible();
    await expect(page.getByText('Una vez que elimines la')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Volver' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sí, eliminar reserva' })).toBeVisible();
    await page.getByRole('button', { name: 'Sí, eliminar reserva' }).click();
    await expect(page.locator('div').filter({ hasText: /^Aún no agregaste entradas\.Acá verás las entradas que agregues\.$/ }).nth(2)).toBeVisible();
    await page.getByRole('button', { name: 'Ir atrás' }).click();
    await page.getByRole('button', { name: 'Ir atrás' }).click();
  });

  await test.step('Cancel the reservation', async () => {
    await page.getByRole('button', { name: 'Obtener Plateas' }).first().click();
    await expect(page.getByText('Ya reservaste')).toBeVisible();
    await page.getByRole('button', { name: 'Cancelar reserva', exact: true }).click();
    await expect(page.getByText('¿QUERÉS CANCELAR LA RESERVA?')).toBeVisible();
    await expect(page.getByText('Una vez que confirmes la cancelación, podrás intentar reservar nuevamente si aún quedan lugares disponibles.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'SÍ, CANCELAR RESERVA' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'VOLVER' })).toBeVisible();
    
    await page.getByRole('button', { name: 'VOLVER', exact: true }).click();
    await page.getByRole('button', { name: 'Cancelar reserva', exact: true }).click();
    await expect(page.getByText('¿QUERÉS CANCELAR LA RESERVA?')).toBeVisible();
    await page.getByRole('button', { name: 'SÍ, CANCELAR RESERVA', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Continuar' })).not.toBeEnabled();
  });
}); 