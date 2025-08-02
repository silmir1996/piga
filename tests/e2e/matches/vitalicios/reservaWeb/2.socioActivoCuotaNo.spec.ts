import { test, expect } from '@playwright/test';
import { loginWithUserType } from '../../../../shared/utils';

test('Socio activo cuota no visualice productos de Vitalicios ', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await loginWithUserType(page, 'socioActivoCuota');
  });
  
  await test.step('Verify that the user does not see Vitalicios products inside vitalicios match', async () => {
    await page.getByText('Partidos').click();
    await page.waitForTimeout(500);
    await page.getByTestId('test-automation-no-utilizar-ver-mas').click();
    await page.locator('div').filter({ hasText: /^NECESITÁS TENER LA CUOTA SOCIAL AL DÍA$/ }).getByRole('button').click();
    await expect(page.getByText('Vitalicios')).not.toBeVisible();
    await expect(page.locator('body')).not.toContainText('Vitalicios');
    await expect(page.getByText('Abono SolidarioActivo07/04/25, 00:15 hsObtener Plateas')).toBeVisible();
    await expect(page.getByText('GeneralesReserva de lugarObtener Generales')).toBeVisible();
  });
});