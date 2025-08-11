// Exportaciones centralizadas de todas las utilidades
export { users } from './users';
export { login, loginWithUserType } from './login';
export * from './flow-handler';
export * from './paypal';
export * from './popup-handler';
export * from './test-setup';

/**
 * Busca y hace click en el botón "Adherir a débito automático" usando múltiples estrategias
 * @param page - La página de Playwright
 * @param options - Opciones de configuración
 */
export async function clickAdherirDAButton(
  page: any,
  options: {
    timeout?: number;
    which?: 'first' | 'last' | number;
  } = {}
) {
  const { timeout = 10000, which = 'first' } = options;

  // Múltiples selectores para el botón
  const selectors = [
    'button:has-text("Adherir a débito automático")',
    '[data-testid*="adherir"]',
    'button[aria-label*="Adherir"]',
    '.adherir-button',
    'button:has-text("Adherir")',
    'button:has-text("débito automático")',
    'input[value*="Adherir"]',
    '[class*="adherir"]',
    '[id*="adherir"]'
  ];

  for (const selector of selectors) {
    try {
      const buttons = page.locator(selector);
      const count = await buttons.count();
      
      if (count > 0) {
        let targetButton;
        if (which === 'first') {
          targetButton = buttons.first();
        } else if (which === 'last') {
          targetButton = buttons.last();
        } else if (typeof which === 'number') {
          targetButton = buttons.nth(which);
        }

        if (await targetButton.isVisible({ timeout: 2000 })) {
          await targetButton.click();
          return true;
        }
      }
    } catch (e) {
      continue;
    }
  }

  // Fallback con roles
  try {
    const roleButtons = page.getByRole('button', { name: /adherir.*débito.*automático/i });
    const count = await roleButtons.count();
    
    if (count > 0) {
      let targetButton;
      if (which === 'first') {
        targetButton = roleButtons.first();
      } else if (which === 'last') {
        targetButton = roleButtons.last();
      } else if (typeof which === 'number') {
        targetButton = roleButtons.nth(which);
      }

      await targetButton.click();
      return true;
    }
  } catch (e) {
    // Continue to error handling
  }

  // Si no se encuentra, mostrar botones disponibles
  const allButtons = await page.locator('button').all();
  console.log(`❌ No se encontró botón "Adherir a débito automático". Botones disponibles (${allButtons.length}):`);
  for (let i = 0; i < Math.min(allButtons.length, 15); i++) {
    const text = await allButtons[i].textContent().catch(() => '');
    const ariaLabel = await allButtons[i].getAttribute('aria-label').catch(() => '');
    console.log(`  ${i + 1}. texto: "${text.trim()}" | aria-label: "${ariaLabel}"`);
  }

  throw new Error('No se pudo encontrar el botón "Adherir a débito automático"');
}

/**
 * Limpia completamente el cache del navegador, cookies, almacenamiento local, etc.
 * @param page - La página de Playwright
 * @param context - El contexto del navegador (opcional)
 */
export async function clearAllCache(page: any, context?: any) {
  try {
    console.log('🧹 Starting complete cache and storage cleanup...');
    
    // 1. Clear browser context cookies first
    if (context) {
      try {
        await context.clearCookies();
        console.log('✅ Context cookies cleared');
      } catch (e: any) {
        console.log('⚠️ Could not clear context cookies:', e.message);
      }
    }

    // 2. Clear all client-side storage
    await page.evaluate(() => {
      // Local Storage
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.clear();
        }
      } catch (e: any) {
        console.log('⚠️ Could not clear localStorage:', e.message);
      }
      
      // Session Storage
      try {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.clear();
        }
      } catch (e: any) {
        console.log('⚠️ Could not clear sessionStorage:', e.message);
      }
      
      // IndexedDB - improved async handling
      if (typeof indexedDB !== 'undefined') {
        try {
          indexedDB.databases().then(databases => {
            databases.forEach(db => {
              if (db.name) {
                const deleteReq = indexedDB.deleteDatabase(db.name);
                deleteReq.onerror = () => console.log('⚠️ Could not delete IndexedDB:', db.name);
              }
            });
          }).catch(e => {
            console.log('⚠️ Could not enumerate IndexedDB databases:', e.message);
          });
        } catch (e) {
          // Silently ignore IndexedDB errors in unsupported environments
        }
      }

      // Clear cache API if available
      if ('caches' in window) {
        try {
          caches.keys().then(names => {
            names.forEach(name => {
              caches.delete(name);
            });
          });
        } catch (e) {
          // Silently ignore cache API errors
        }
      }
    });
    console.log('✅ Client-side storage cleared');

    // 3. Use CDP to clear browser-level cache (Chrome/Chromium only)
    try {
      if (context && context._browser) {
        const cdpSession = await context.newCDPSession(page);
        
        // Clear network cache
        await cdpSession.send('Network.clearBrowserCache');
        console.log('✅ Network cache cleared via CDP');
        
        // Clear cookies via CDP (redundant but thorough)
        await cdpSession.send('Network.clearBrowserCookies');
        
        // Clear all storage types
        try {
          await cdpSession.send('Storage.clearDataForOrigin', {
            origin: page.url() || '*',
            storageTypes: 'all'
          });
          console.log('✅ Origin storage cleared via CDP');
        } catch (e) {
          // Try with wildcard if specific origin fails
          await cdpSession.send('Storage.clearDataForOrigin', {
            origin: '*',
            storageTypes: 'all'
          });
        }
        
        await cdpSession.detach();
      }
    } catch (e) {
      console.log('⚠️ CDP cache clearing not available (likely non-Chromium browser)');
    }

    // 4. Navigate to blank page to ensure clean slate
    await page.goto('about:blank', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000); // Increased wait time for thorough cleanup
    
    console.log('✅ Complete cache cleanup finished');

  } catch (error: any) {
    console.error('❌ Error during cache cleanup:', error.message);
    throw error; // Re-throw to let tests handle cleanup failures
  }
}

/**
 * Limpia específicamente el cache relacionado con PayPal
 * @param page - La página de Playwright
 * @param context - El contexto del navegador (opcional)
 */
export async function clearPayPalCache(page: any, context?: any) {
  try {
    // Limpiar cookies específicas de PayPal
    if (context) {
      const cookies = await context.cookies();
      const paypalCookies = cookies.filter(cookie => 
        cookie.domain.includes('paypal') || 
        cookie.name.toLowerCase().includes('paypal') ||
        cookie.domain.includes('pp')
      );
      
      for (const cookie: any of paypalCookies) {
        await context.clearCookies({
          domain: cookie.domain,
          name: cookie.name
        });
      }
    }

    // Limpiar almacenamiento local relacionado con PayPal
    await page.evaluate(() => {
      // Buscar y eliminar keys relacionadas con PayPal
      const keysToRemove = [];
      
      // Local Storage
      if (typeof localStorage !== 'undefined') {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (
            key.toLowerCase().includes('paypal') ||
            key.toLowerCase().includes('pp_') ||
            key.toLowerCase().includes('payment')
          )) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      }

      // Session Storage
      if (typeof sessionStorage !== 'undefined') {
        const sessionKeysToRemove = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && (
            key.toLowerCase().includes('paypal') ||
            key.toLowerCase().includes('pp_') ||
            key.toLowerCase().includes('payment')
          )) {
            sessionKeysToRemove.push(key);
          }
        }
        sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
      }
    });

  } catch (error: any) {
    console.log('⚠️ Error limpiando cache de PayPal:', error.message);
  }
}