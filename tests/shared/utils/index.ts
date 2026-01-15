// Exportaciones centralizadas de todas las utilidades
export { users } from './users';
export { login, loginWithUserType } from './login';
export * from './flow-handler';
export * from './paypal';
export * from './popup-handler';
export * from './test-setup';
export * from './element-utils';

/**
 * Registra los botones disponibles para debug
 */
async function logAvailableButtons(page: any): Promise<void> {
  const allButtons = await page.locator('button').all();
  console.log(`❌ No se encontró botón "Adherir a débito automático". Botones disponibles (${allButtons.length}):`);
  
  const maxButtonsToShow = 15;
  for (let i = 0; i < Math.min(allButtons.length, maxButtonsToShow); i++) {
    const text = await allButtons[i].textContent().catch(() => '');
    const ariaLabel = await allButtons[i].getAttribute('aria-label').catch(() => '');
    console.log(`  ${i + 1}. texto: "${text.trim()}" | aria-label: "${ariaLabel}"`);
  }
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
      const paypalCookies = cookies.filter((cookie: any) => 
        cookie.domain.includes('paypal') || 
        cookie.name.toLowerCase().includes('paypal') ||
        cookie.domain.includes('pp')
      );
      
      for (const cookie of paypalCookies) {
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