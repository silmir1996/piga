import { Page } from '@playwright/test';

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