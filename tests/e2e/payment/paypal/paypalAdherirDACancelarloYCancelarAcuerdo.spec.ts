import { test, expect } from '@playwright/test';
import { executeStep, loginWithUserType, handlePopup, paypalLogin, handlePaypalConsent, clickAdherirDAButton, clearAllCache, clearPayPalCache, users } from '../../../shared/utils';

test('Adherir DA cancelarlo y cancelar acuerdo', async ({ page, context }) => {
  
  await test.step('Clear all cache and cookies', async () => {
    // Clear all cache to ensure fresh start
    await clearAllCache(page, context); 
    // Specifically clear PayPal cache
    await clearPayPalCache(page, context);
  });

  await test.step('Login to the application', async () => {
    await loginWithUserType(page, 'socioDAconPaypalSinDeuda');
  });

  await test.step('Navigate to payment page and verify there is no debt', async () => {
    await page.getByText('Pagos').first().click();
    await page.waitForTimeout(1500);
  });

  await test.step('Initiate DA payment', async () => {
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    await page.pause();
    // Use the robust utility function to find and click the button
    await clickAdherirDAButton(page, { which: 'first' });

    await page.waitForTimeout(500);
    await page.locator('.css-175oi2r.r-bnwqim > .css-175oi2r.r-1otgn73').click();
    await page.waitForTimeout(500);
    await page.locator('div').filter({ hasText: /^PayPal$/ }).nth(1).click();
    
    // Wait a bit to see what appears after selecting PayPal
    await page.waitForTimeout(2000);
    
    // Look for any clickable elements that might contain "pagar", "continuar", "siguiente", etc.
    const actionWords = ['pagar', 'continuar', 'siguiente', 'confirmar', 'adherir', 'débito', 'automático'];
    for (const word of actionWords) {
      try {
        const elements = await page.locator(`button:has-text("${word}")`).all();
      } catch (e) {
        // Continue
      }
    }
    
    // Try to find the final submit button to trigger PayPal
    const submitSelectors = [
      'button:has-text("Adherir a débito automático")',
      'button:has-text("Continuar")',
      'button:has-text("Confirmar")',
      'button:has-text("Pagar")',
      'button[type="submit"]',
      '.submit-button',
      '.continue-button',
      '.pay-button'
    ];
    
    let submitFound = false;
    for (const selector of submitSelectors) {
      try {
        const buttons = await page.locator(selector).all();
        for (let i = 0; i < buttons.length; i++) {
          if (await buttons[i].isVisible({ timeout: 1000 })) {
            const text = await buttons[i].textContent().catch(() => '');
            await buttons[i].click();
            submitFound = true;
            break;
          }
        }
      } catch (e) {
        continue;
      }
    }
  });

  await test.step('Handle PayPal popup and complete flow', async () => {
    // Clear PayPal cache again before login to ensure fresh session
      await clearPayPalCache(page, context);
    
      // The popup should open after the previous step, so we wait for it
      const paypalPage = await page.waitForEvent('popup', { timeout: 15000 });
      // Clear cache in the popup page too
      await clearPayPalCache(paypalPage);
      
      // Use the robust PayPal login function that handles both scenarios
      await paypalLogin(paypalPage, users.paypalEmail, users.paypalPassword);
      
      // Handle consent button and wait for popup to close
      await handlePaypalConsent(paypalPage);
      
      // Wait for the popup to be completely closed before continuing
      if (!paypalPage.isClosed()) {
        try {
          await paypalPage.waitForEvent('close', { timeout: 5000 });
        } catch (e) {
          // Continue if popup doesn't close automatically
        }
      }
  }); 

  await test.step('Verify successful DA registration', async () => {
    // Wait for page to load after popup closes
    await page.waitForTimeout(2000);
    // Verify success message
    await expect(page.getByRole('heading', { name: '¡Te adheriste al Débito autom' })).toBeVisible();
    await page.getByRole('button', { name: 'Volver a pagos' }).click();
  });

  await page.pause();
});
