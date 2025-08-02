import { test, expect } from '@playwright/test';
import { 
  loginWithUserType,
  executeFlow,
  executeStep,
  clickConditionally,
  navigateWithDevicePattern,
  assertConditionally,
  logDeviceConfig
} from '../../../../shared/utils';

test('Socio adherente validar que visualice producto de abono solidario solamente - Flow Example', async ({ page }) => {
  
  await test.step('Login to the application', async () => {
    await loginWithUserType(page, 'socioAdherenteNo');
    logDeviceConfig(page); // Debug: see which device we're on
  });
  
  await test.step('Verify that the user does not see confirmacion products', async () => {
    
    // Example 1: Different navigation patterns
    // Desktop: Direct click on "Partidos"
    // Mobile: Might need to open hamburger menu first, then click "Partidos"
    await executeStep(
      page,
      // Desktop flow
      async () => {
        await page.getByText('Partidos').click();
      },
      // Mobile flow - different navigation
      async () => {
        // Mobile might have a hamburger menu or different navigation
        await page.getByText('Partidos').click();
        // OR if mobile has different navigation:
        // await page.click('[data-testid="mobile-menu-toggle"]');
        // await page.click('[data-testid="mobile-partidos-link"]');
      }
    );

    // Example 2: Different element selectors
    // Desktop and mobile might have different test IDs or selectors
    await clickConditionally(
      page,
      // Desktop selector
      '[data-testid="evento-filtro-automation-no-utilizar-ver-mas"]',
      // Mobile selector (if different)
      '[data-testid="mobile-evento-filtro-automation-no-utilizar-ver-mas"]',
      { waitForNavigation: true }
    );

    // Example 3: Complex flow with multiple steps
    await executeFlow(page, [
      {
        desktop: async () => {
          // Desktop flow: Direct button click
          await page.locator('div').filter({ hasText: /^NECESITÁS TENER LA CUOTA SOCIAL AL DÍA$/ }).getByRole('button').click();
        },
        mobile: async () => {
          // Mobile flow: Might need to scroll first, then click
          await page.locator('div').filter({ hasText: /^NECESITÁS TENER LA CUOTA SOCIAL AL DÍA$/ }).scrollIntoViewIfNeeded();
          await page.locator('div').filter({ hasText: /^NECESITÁS TENER LA CUOTA SOCIAL AL DÍA$/ }).getByRole('button').click();
        }
      }
    ]);

    // Example 4: Navigation with device patterns
    // If you have different navigation patterns (hamburger vs sidebar)
    await navigateWithDevicePattern(page, {
      desktop: {
        menuSelector: '.desktop-menu',
        submenuSelector: '.desktop-submenu'
      },
      mobile: {
        hamburgerSelector: '.mobile-hamburger',
        menuItemSelector: '.mobile-menu-item'
      }
    });

    // Common expectations (same for both devices)
    await expect(page.getByText('Vitalicios')).not.toBeVisible();
    await expect(page.locator('body')).not.toContainText('TEST AUTOMATION (No utilizar)');
    
    // Conditional assertions - different expectations for mobile vs desktop
    await assertConditionally(
      page,
      // Desktop assertions
      async () => {
        await expect(page.getByText('Abono SolidarioAdherente01/07/25, 00:00 hsObtener Plateas')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Obtener Generales' })).not.toBeVisible();
        await expect(page.locator('.desktop-specific-element')).toBeVisible();
      },
      // Mobile assertions
      async () => {
        await expect(page.getByText('Abono SolidarioAdherente01/07/25, 00:00 hsObtener Plateas')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Obtener Generales' })).not.toBeVisible();
        await expect(page.locator('.mobile-specific-element')).toBeVisible();
        // Mobile might have different layout or additional elements
        await expect(page.locator('.mobile-layout-indicator')).toBeVisible();
      }
    );

    // Example 5: Different URL navigation patterns
    await executeStep(
      page,
      // Desktop: Direct navigation
      async () => {
        await page.goto("https://bocasocios-tst.bocajuniors.com.ar/matches/875/confirmation");
      },
      // Mobile: Might need different URL or additional steps
      async () => {
        await page.goto("https://bocasocios-tst.bocajuniors.com.ar/matches/875/confirmation");
        // OR if mobile needs different handling:
        // await page.goto("https://bocasocios-tst.bocajuniors.com.ar/mobile/matches/875/confirmation");
      }
    );

    await expect(page.getByText('Hubo un problema')).toBeVisible();
    
    await executeStep(
      page,
      // Desktop: Direct button click
      async () => {
        await page.getByRole('button', { name: 'Volver al inicio' }).click();
      },
      // Mobile: Might need different button selector or additional steps
      async () => {
        await page.getByRole('button', { name: 'Volver al inicio' }).click();
        // OR if mobile has different button:
        // await page.click('[data-testid="mobile-volver-button"]');
      }
    );

    await expect(page.getByText('Partidos')).toBeVisible();
  });
}); 