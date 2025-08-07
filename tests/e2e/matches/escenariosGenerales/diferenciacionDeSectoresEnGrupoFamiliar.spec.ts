import { test, expect } from '@playwright/test';
import { executeStep, loginWithUserType, selectAndVerifySeat } from '../../../shared/utils';


test('Al realizar reserva con socio familiar que aplica para otro producto, diferencia las secciones/productos', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await loginWithUserType(page, 'socioHabilitadoReservaWebPlateaConFamiliar');
  });
  
  await test.step('Verify that vitalicios product exist and accessible', async () => {
    await page.getByText('Partidos').click();
    await page.waitForTimeout(1000);
    await page.getByTestId('evento-secciones-no-tocar-ver-mas').click();
    await page.getByRole('button', { name: 'Obtener Plateas' }).click();
  });

  await test.step('Assert that owner is being autoselected (desktop) and section LV is visible and available', async () => {
    // Use the specific name that matches the checked element
    await executeStep(
        page,
        async () => {
          await expect(page.locator('div').filter({ hasText: /^Nelida Mirna Test_etSocio #16723Sector$/ }).getByRole('checkbox')).toHaveAttribute('aria-checked', 'true'); 
          //Assert section LV is green (available)
          await expect(page.locator('.stadium-map [id^=seccion-LV] path').first()).toHaveCSS('fill', 'rgb(45, 133, 80)');
          await page.locator('.stadium-map [id^=seccion-LV]').click();
          // Assert section LV is yellow (selected) after clicking
          await expect(page.locator('.stadium-map [id^=seccion-LV] path').first()).toHaveCSS('fill', 'rgb(239, 176, 39)');
          //Assert continue button is enabled
          await expect(page.getByRole('button', { name: 'Continuar' })).toBeEnabled();
          //Assert same section is displayed in dropdown
          await page.locator('div').filter({ hasText: /^Nelida Mirna Test_etSocio #16723Sector$/ }).getByRole('img').nth(1).click();
          await expect(page.getByText('Seccion LV')).toBeVisible();
          await expect(page.locator('div').filter({ hasText: /^SectorSeccion LV$/ }).getByRole('img').nth(1)).toBeVisible();
        },
        async () => {
          await page.getByRole('checkbox').first().click();
        }
      );
    //Click continue
    await page.getByRole('button', { name: 'Continuar' }).click();
  });

  await test.step('Verify that the seat is available, select it and verify it turns yellow and go back', async () => {
    await executeStep(
      page,
      async () => {
        //Function to select and verify seat
        await selectAndVerifySeat(page, '8119771', '177');
        await page.locator('div').filter({ hasText: /^Ubicación seleccionada$/ }).getByRole('button').click();
        //Click back once
        await page.getByRole('button', { name: 'Ir atrás' }).click();
      },
      async () => {
        //Do same map Flow as line 34
        await page.locator('#path913').click();
        await page.waitForTimeout(1000);
        await page.getByRole('button', { name: 'Ir atrás' }).click();
        await page.getByRole('img').nth(3).click();
        await page.waitForTimeout(500);
        await page.locator('.css-175oi2r.r-1otgn73.r-1r0uh6').click();
        //Function to select and verify seat
        await selectAndVerifySeat(page, '8119771', '177');
        await page.locator('div').filter({ hasText: /^Ubicación seleccionada$/ }).getByRole('button').click();
        //Click back twice
        await page.getByRole('button', { name: 'Ir atrás' }).click();
        await page.getByRole('button', { name: 'Ir atrás' }).click();
        await page.waitForTimeout(1000);
      }
    );
  });

  await test.step('Verify that the other familiy member has other sections visible and available', async () => {
    //Select Pablo Hugo and verify checkbox is checked
    await page.getByRole('checkbox').nth(1).click();
    await page.waitForTimeout(1000);
    await expect(page.locator('div').filter({ hasText: /^Pablo Hugo Test_itzSocio #13274Sector$/ }).getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');  
    //Assert other sections are green (available)
    await expect(page.locator('.stadium-map [id^=seccion-LV] *:not([id^=text])').first()).toHaveCSS('fill', 'rgb(45, 133, 80)');
    await expect(page.locator('.stadium-map [id^=seccion-G] *:not([id^=text])').first()).toHaveCSS('fill', 'rgb(45, 133, 80)');
    await expect(page.locator('.stadium-map [id^=seccion-H] *:not([id^=text])').first()).toHaveCSS('fill', 'rgb(45, 133, 80)');
    await expect(page.locator('.stadium-map [id^=seccion-K] *:not([id^=text])').first()).toHaveCSS('fill', 'rgb(45, 133, 80)');
    //Select same section as owner
    await page.locator('.stadium-map [id^=seccion-LV]').click();
    // Assert section LV is yellow (selected) after clicking
    await expect(page.locator('.stadium-map [id^=seccion-LV] path').first()).toHaveCSS('fill', 'rgb(239, 176, 39)');
    //Assert continue button is enabled
    await expect(page.getByRole('button', { name: 'Continuar' })).toBeEnabled();
    //Assert same sections are displayed in dropdown
    await page.locator('div').filter({ hasText: /^Pablo Hugo Test_itzSocio #13274Sector$/ }).getByRole('img').nth(1).click();
    await expect(page.getByText('Seccion LV')).toBeVisible();
    await expect(page.getByText('Seccion G')).toBeVisible();
    await expect(page.getByText('Seccion H')).toBeVisible();
    await expect(page.getByText('Seccion K')).toBeVisible();
    //select same section as owner
    await page.getByText('Seccion LV').click();
    //Click continue
    await page.getByRole('button', { name: 'Continuar' }).click();
  });

  await test.step('Verify that previous seat is not available and continue reservation verifying reservation is made', async () => {
    //Assert seat is green (available)
    await expect(page.locator('div').filter({ hasText: /^177$/ }).nth(2)).toHaveCSS('background-color', 'rgb(233, 237, 245)');
    //Click to select the seat and verify it turns yellow
    await page.getByText('Buscar asiento disponible').click();
    await page.getByRole('button', { name: 'Reservar ubicación' }).click();
    await page.getByRole('button', { name: 'Sí, confirmar reserva' }).click();
    await page.getByRole('button', { name: 'Ver reserva' }).click();
  });

  await test.step('Make reservation for owner and verify reservation is made', async ({}) => { 
    await page.locator('div').filter({ hasText: /^Nelida Mirna Test_etSocio #16723Sector$/ }).getByRole('img').nth(1).click();
    await page.getByText('Seccion LV').click();
    await page.getByRole('button', { name: 'Continuar' }).click();
    await page.locator('[id="8119771"]').getByText('177').click();
    await page.getByRole('button', { name: 'Reservar ubicación' }).click();
    await page.getByRole('button', { name: 'Sí, confirmar reserva' }).click();
    await page.getByRole('button', { name: 'Ver reserva' }).click();
  });
  
  await test.step('Cancel reservation for both members and verify is cancelled', async ({}) => { 
    await expect(page.getByText('Ya reservaste').first()).toBeVisible();
    await expect(page.getByText('Ya reservaste').nth(1)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continuar' })).not.toBeEnabled();
    await page.getByRole('button', { name: 'Cancelar reserva' }).first().click();
    await page.getByRole('button', { name: 'SÍ, CANCELAR RESERVA' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Cancelar reserva' }).click();
    await page.getByRole('button', { name: 'SÍ, CANCELAR RESERVA' }).click();
    await expect(page.locator('div').filter({ hasText: /^Nelida Mirna Test_etSocio #16723Sector$/ }).getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');  
    await expect(page.getByRole('button', { name: 'Continuar' })).not.toBeEnabled();
  });
});