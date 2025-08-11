import { test, Page, BrowserContext } from '@playwright/test';
import { clearAllCache } from './index';

/**
 * Configuration options for test setup
 */
export interface TestSetupOptions {
  clearCacheBeforeTest?: boolean;
  clearCacheAfterTest?: boolean;
  skipInitialNavigation?: boolean;
  baseUrl?: string;
}

/**
 * Sets up proper test isolation with cache and cookie clearing
 * Call this in your test files to ensure proper cleanup
 * 
 * @param options - Configuration for test setup behavior
 * @example
 * ```typescript
 * import { setupTestIsolation } from '../shared/utils/test-setup';
 * 
 * setupTestIsolation({ 
 *   clearCacheBeforeTest: true,
 *   clearCacheAfterTest: false 
 * });
 * 
 * test('my test', async ({ page }) => {
 *   // Your test code here
 * });
 * ```
 */
export function setupTestIsolation(options: TestSetupOptions = {}) {
  const {
    clearCacheBeforeTest = true,
    clearCacheAfterTest = false,
    skipInitialNavigation = false,
    baseUrl
  } = options;

  test.beforeEach(async ({ page, context }: { page: Page; context: BrowserContext }) => {
    console.log('🚀 Setting up test isolation...');
    
    if (clearCacheBeforeTest) {
      try {
        await clearAllCache(page, context);
        console.log('✅ Pre-test cache clearing completed');
      } catch (error) {
        console.error('❌ Failed to clear cache before test:', error);
        // Don't fail the test, but log the error
      }
    }

    // Navigate to base URL if specified and not skipped
    if (!skipInitialNavigation && baseUrl) {
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    }
  });

  test.afterEach(async ({ page, context }: { page: Page; context: BrowserContext }) => {
    if (clearCacheAfterTest) {
      try {
        await clearAllCache(page, context);
        console.log('✅ Post-test cache clearing completed');
      } catch (error) {
        console.error('❌ Failed to clear cache after test:', error);
        // Don't fail the test, but log the error
      }
    }
    
    console.log('🏁 Test isolation cleanup completed');
  });
}

/**
 * Convenience function for tests that require extensive cache clearing
 * Use this for tests involving authentication, payments, or persistent state
 */
export function setupStrictTestIsolation() {
  setupTestIsolation({
    clearCacheBeforeTest: true,
    clearCacheAfterTest: true,
    skipInitialNavigation: false
  });
}

/**
 * Convenience function for tests that handle their own navigation
 * Use this when you need cache clearing but want to control navigation
 */
export function setupMinimalTestIsolation() {
  setupTestIsolation({
    clearCacheBeforeTest: true,
    clearCacheAfterTest: false,
    skipInitialNavigation: true
  });
}

/**
 * Manual cache clearing function for use within test steps
 * Use this when you need to clear cache during a test
 */
export async function clearCacheInTest(page: Page, context: BrowserContext): Promise<void> {
  try {
    await clearAllCache(page, context);
    console.log('✅ Manual cache clearing completed');
  } catch (error) {
    console.error('❌ Manual cache clearing failed:', error);
    throw error;
  }
}
