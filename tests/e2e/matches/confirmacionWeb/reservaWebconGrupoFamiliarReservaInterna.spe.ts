import { test, expect } from '@playwright/test';
import { users } from '@users';


test('Socio pleno con grupo familiar Reserva Web para si mismo, y tambien para familiar habilitado para Reserva Interna + AS', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await page.goto('');
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(users.socioConfirmacionWeb);
    await page.getByRole('textbox', { name: 'Contraseña' }).fill(users.password);
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  });
  
  await test.step('Verify that the user does see confirmacion product', async () => {
    await page.getByText('Partidos').click();
    await page.waitForTimeout(500);
    await page.getByTestId('test-automation-no-utilizar-ver-mas').click();
    await page.pause();
    await expect(page.getByText('GeneralesReserva de lugarObtener Generales')).toBeVisible();
    await page.getByText('Obtener Generales').click();


    await page.pause();
    //pedir que limpien estado de reserva 
    await expect(page.getByText('Abono Solidario')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Obtener Plateas' })).not.toBeVisible();
    await page.goto('https://bocasocios-tst.bocajuniors.com.ar/matches/855/confirmation');
    await expect(page.getByText('Hubo un problema')).toBeVisible();
  });
});