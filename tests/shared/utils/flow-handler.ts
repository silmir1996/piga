import { Page, expect } from '@playwright/test';

export interface FlowStep {
  desktop: () => Promise<void>;
  mobile: () => Promise<void>;
}

export interface FlowConfig {
  isMobile: boolean;
  viewport: { width: number; height: number };
}

/**
 * Get flow configuration based on current browser context
 */
export function getFlowConfig(page: Page): FlowConfig {
  const viewport = page.viewportSize() || { width: 1280, height: 720 };
  const isMobile = viewport.width < 768;
  
  return {
    isMobile,
    viewport
  };
}

/**
 * Execute different flows for desktop and mobile
 * Use this when the navigation path is completely different between devices
 */
export async function executeFlow(
  page: Page,
  flowSteps: FlowStep[]
): Promise<void> {
  const config = getFlowConfig(page);
  
  for (const step of flowSteps) {
    if (config.isMobile) {
      await step.mobile();
    } else {
      await step.desktop();
    }
  }
}

/**
 * Execute a single step with different flows
 */
export async function executeStep(
  page: Page,
  desktopAction: () => Promise<void>,
  mobileAction: () => Promise<void>
): Promise<void> {
  const config = getFlowConfig(page);
  
  if (config.isMobile) {
    await mobileAction();
  } else {
    await desktopAction();
  }
}

/**
 * Conditional element selection based on device
 * Useful when elements have different selectors on mobile vs desktop
 */
export async function selectElementConditionally(
  page: Page,
  desktopSelector: string,
  mobileSelector: string
) {
  const config = getFlowConfig(page);
  const selector = config.isMobile ? mobileSelector : desktopSelector;
  
  return page.locator(selector);
}

/**
 * Conditional click with different selectors
 */
export async function clickConditionally(
  page: Page,
  desktopSelector: string,
  mobileSelector: string,
  options?: { waitForNavigation?: boolean }
) {
  const config = getFlowConfig(page);
  const selector = config.isMobile ? mobileSelector : desktopSelector;
  
  if (options?.waitForNavigation) {
    await Promise.all([
      page.waitForLoadState('networkidle'),
      page.click(selector)
    ]);
  } else {
    await page.click(selector);
  }
}

/**
 * Handle different navigation patterns
 * Example: Desktop has sidebar menu, mobile has hamburger menu
 */
export async function navigateWithDevicePattern(
  page: Page,
  navigationConfig: {
    desktop: {
      menuSelector: string;
      submenuSelector: string;
    };
    mobile: {
      hamburgerSelector: string;
      menuItemSelector: string;
    };
  }
) {
  const config = getFlowConfig(page);
  
  if (config.isMobile) {
    // Mobile flow: hamburger menu -> menu item
    await page.click(navigationConfig.mobile.hamburgerSelector);
    await page.click(navigationConfig.mobile.menuItemSelector);
  } else {
    // Desktop flow: sidebar menu -> submenu
    await page.click(navigationConfig.desktop.menuSelector);
    await page.click(navigationConfig.desktop.submenuSelector);
  }
}

/**
 * Handle different form interactions
 * Example: Desktop has dropdown, mobile has modal picker
 */
export async function interactWithFormConditionally(
  page: Page,
  formConfig: {
    desktop: {
      fieldSelector: string;
      value: string;
    };
    mobile: {
      fieldSelector: string;
      value: string;
      modalSelector?: string;
    };
  }
) {
  const config = getFlowConfig(page);
  
  if (config.isMobile) {
    // Mobile might need to open a modal first
    if (formConfig.mobile.modalSelector) {
      await page.click(formConfig.mobile.modalSelector);
    }
    await page.fill(formConfig.mobile.fieldSelector, formConfig.mobile.value);
  } else {
    // Desktop direct field interaction
    await page.fill(formConfig.desktop.fieldSelector, formConfig.desktop.value);
  }
}

/**
 * Handle different scroll behaviors
 * Mobile often needs explicit scrolling before interaction
 */
export async function scrollAndClickConditionally(
  page: Page,
  selector: string,
  options?: {
    mobileScrollFirst?: boolean;
    desktopScrollFirst?: boolean;
  }
) {
  const config = getFlowConfig(page);
  
  if (config.isMobile && options?.mobileScrollFirst) {
    await page.locator(selector).scrollIntoViewIfNeeded();
  } else if (!config.isMobile && options?.desktopScrollFirst) {
    await page.locator(selector).scrollIntoViewIfNeeded();
  }
  
  await page.click(selector);
}

/**
 * Execute conditional assertions based on device
 * Use when you need different assertions for mobile vs desktop
 */
export async function assertConditionally(
  page: Page,
  desktopAssertions: () => Promise<void>,
  mobileAssertions: () => Promise<void>
): Promise<void> {
  const config = getFlowConfig(page);
  
  if (config.isMobile) {
    await mobileAssertions();
  } else {
    await desktopAssertions();
  }
}

/**
 * Debug helper to log current device configuration
 */
export function logDeviceConfig(page: Page): void {
  const config = getFlowConfig(page);
  console.log(`[Flow Handler] Device: ${config.isMobile ? 'Mobile' : 'Desktop'}, Viewport: ${config.viewport.width}x${config.viewport.height}`);
}

/**
 * Select a seat and verify its color changes from green (available) to yellow (selected)
 * @param page - Playwright page object
 * @param seatId - The seat element ID (e.g., "8119771")
 * @param seatNumber - The seat number text to click (e.g., "177")
 * @param waitTime - Optional wait time after clicking (default: 500ms)
 */
export async function selectAndVerifySeat(
  page: Page,
  seatId: string,
  seatNumber: string,
  waitTime: number = 500
): Promise<void> {
  const seatSelector = `[id="${seatId}"]`;
  const seatDivSelector = `${seatSelector} div`;
  
  // Assert seat is available (green background)
  await expect(page.locator(seatDivSelector)).toHaveCSS('background-color', 'rgb(45, 133, 80)');
  
  // Click to select the seat
  await page.locator(seatSelector).getByText(seatNumber).click();
  
  // Wait for the color change
  await page.waitForTimeout(waitTime);
  
  // Assert seat is yellow (selected)
  await expect(page.locator(seatDivSelector)).toHaveCSS('background-color', 'rgb(239, 176, 39)');
} 

/**
 * Test Abono Solidario error handling for specific members
 * @param page - Playwright page object
 * @param seatLocator - The seat locator to click (e.g., "#path709")
 * @param memberNames - Array of member names to test error handling for
 */
export async function testAbonoSolidarioErrorHandling(
  page: Page,
  seatLocator: string,
  memberNames: string[]
): Promise<void> {
  await page.getByRole('button', { name: 'Obtener Plateas' }).click();
  await page.locator(seatLocator).click();
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

  // Test error handling for each member
  for (const memberName of memberNames) {
    await page.locator('.css-175oi2r.r-bnwqim > .css-175oi2r.r-1otgn73').click();
    await page.getByText(memberName).click();
    await expect(page.getByText('Ocurrió un error')).toBeVisible();
    await expect(page.getByText('El evento no tiene la venta')).toBeVisible();
  }
  
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
      // Mobile cleanup if needed
    }
  );
  
  await page.getByRole('button', { name: 'Ir atrás' }).click();
  await page.getByRole('button', { name: 'Ir atrás' }).click();
} 