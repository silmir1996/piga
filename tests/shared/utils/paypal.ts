/**
 * Utilidades para manejar PayPal en pruebas de Playwright
 * Incluye funciones para login condicional y manejo de popups específicos de PayPal
 */

// -----------------------------
// Selectores específicos encontrados con Playwright Inspector
// -----------------------------

// Selectores de respaldo (solo si los principales fallan)
const FALLBACK_SELECTORS = {
  email: ['input[name="email"]', 'input[id="email"]', 'input[type="email"]'],
  password: ['input[name="password"]', 'input[id="password"]', 'input[type="password"]'],
  next: ['button[name="btnNext"]', 'button[id="btnNext"]'],
  login: ['button[type="submit"]', 'button[name="btnLogin"]'],
  consent: ['[data-testid="consentButton"]', '#consentButton']
};

// -----------------------------
// Tipos de opciones
// -----------------------------

interface HandleConditionalPaypalFlowOptions {
  popupTimeout?: number;
  clearCache?: boolean;
  waitAfterFlow?: number;
  clearPayPalCache?: (page: any, context?: any) => Promise<void>;
}

// -----------------------------
// Helpers reutilizables
// -----------------------------

async function fillEmail(page: any, email: string, timeout = 2000): Promise<boolean> {
  try {
    // Intentar con el selector específico primero
    await page.getByRole('textbox', { name: 'Correo electrónico o número' }).first().fill(email);
    return true;
  } catch (e) {
    // Si falla, intentar con selectores de respaldo
    for (const selector of FALLBACK_SELECTORS.email) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 })) {
          await element.fill(email);
          return true;
        }
      } catch (e) {
        // Continuar con el siguiente selector
      }
    }
    return false;
  }
}

async function fillPassword(page: any, password: string, timeout = 2000): Promise<boolean> {
  try {
    // Intentar con el selector específico primero
    await page.getByRole('textbox', { name: 'Contraseña' }).first().fill(password);
    return true;
  } catch (e) {
    // Si falla, intentar con selectores de respaldo
    for (const selector of FALLBACK_SELECTORS.password) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 })) {
          await element.fill(password);
          return true;
        }
      } catch (e) {
        // Continuar con el siguiente selector
      }
    }
    return false;
  }
}

async function clickNext(page: any, timeout = 2000): Promise<boolean> {
  try {
    // Intentar con el selector específico primero
    await page.getByRole('button', { name: 'Siguiente' }).first().click();
    return true;
  } catch (e) {
    // Si falla, intentar con selectores de respaldo
    for (const selector of FALLBACK_SELECTORS.next) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 })) {
          await element.click();
          return true;
        }
      } catch (e) {
        // Continuar con el siguiente selector
      }
    }
    return false;
  }
}

async function clickLogin(page: any, timeout = 2000): Promise<boolean> {
  try {
    // Intentar con el selector específico primero
    await page.getByRole('button', { name: 'Iniciar sesión' }).first().click();
    return true;
  } catch (e) {
    // Si falla, intentar con selectores de respaldo
    for (const selector of FALLBACK_SELECTORS.login) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 })) {
          await element.click();
          return true;
        }
      } catch (e) {
        // Continuar con el siguiente selector
      }
    }
    return false;
  }
}

async function clickConsent(page: any, timeout = 2000): Promise<boolean> {
  try {
    // Intentar con el selector específico primero
    await page.getByTestId('consentButton').first().click();
    return true;
  } catch (e) {
    // Si falla, intentar con selectores de respaldo
    for (const selector of FALLBACK_SELECTORS.consent) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 })) {
          await element.click();
          return true;
        }
      } catch (e) {
        // Continuar con el siguiente selector
      }
    }
    return false;
  }
}

// Click helper that searches in main page and all child frames
async function clickInPageOrFrames(
  rootPage: any,
  clickFunction: (page: any) => Promise<boolean>,
  timeoutPerAttempt = 1500
): Promise<boolean> {
  const pagesToSearch = [rootPage, ...rootPage.frames()];

  for (const p of pagesToSearch) {
    const clicked = await clickFunction(p).catch(() => false);
    if (clicked) return true;
  }

  return false;
}

// Retry helper: repeatedly tries to click the specific selector across frames
async function retryClickInPageOrFrames(
  rootPage: any,
  clickFunction: (page: any) => Promise<boolean>,
  totalTimeoutMs = 15000,
  stepDelayMs = 500
): Promise<boolean> {
  const deadline = Date.now() + totalTimeoutMs;
  while (Date.now() < deadline) {
    const clicked = await clickInPageOrFrames(rootPage, clickFunction, Math.min(2000, stepDelayMs + 1000));
    if (clicked) return true;
    await rootPage.waitForTimeout(stepDelayMs);
  }
  return false;
}

/**
 * Maneja el flujo completo de PayPal de forma condicional
 * Detecta si aparece un popup de PayPal y maneja login + consentimiento según sea necesario
 * @param page - La página principal de Playwright
 * @param context - El contexto de Playwright
 * @param email - Email de PayPal
 * @param password - Contraseña de PayPal
 * @param options - Opciones de configuración
 */
export async function handleConditionalPaypalFlow(
  page: any,
  context: any,
  email: string,
  password: string,
  options: HandleConditionalPaypalFlowOptions = {}
) {
  const { 
    popupTimeout = 15000,
    clearCache = true,
    waitAfterFlow = 5000,
    clearPayPalCache
  } = options;

  // Configuración optimizada para headless vs headed
  const isHeadless = process.env.MCP_HEADLESS === 'true';
  const config = {
    popupTimeout: isHeadless ? 6000 : popupTimeout,
    emailTimeout: isHeadless ? 1500 : 2000,
    passwordTimeout: isHeadless ? 1000 : 1500,
    nextButtonTimeout: isHeadless ? 1500 : 2000,
    consentRetryTimeout: isHeadless ? 8000 : 12000,
    waitBetweenSteps: isHeadless ? 1000 : 2000
  };

  try {
    // Limpiar cache si se especifica
    if (clearCache && clearPayPalCache) {
      await clearPayPalCache(page, context);
    }

    // Intentar detectar popup de PayPal
    let paypalPage = null;
    try {
      paypalPage = await page.waitForEvent('popup', { timeout: config.popupTimeout });
      
      if (paypalPage) {
        
        // Limpiar cache en la página del popup también
        if (clearCache && clearPayPalCache) {
          await clearPayPalCache(paypalPage);
        }

        // Esperar a que la página de PayPal cargue (optimizado para headless)
        await paypalPage.waitForLoadState(isHeadless ? 'domcontentloaded' : 'networkidle');

        // PASO 1: Intentar login condicional
        try {
          if (paypalPage.isClosed()) return;
          
          // Llenar email usando selector específico
          const emailFilled = await fillEmail(paypalPage, email, config.emailTimeout);
          
          if (emailFilled) {
            // Esperar un poco después de llenar el email para que la página se estabilice
            await paypalPage.waitForTimeout(1000);
            
            // Verificar si el campo de password está visible en la misma pantalla
            const passwordFieldVisible = await paypalPage.getByRole('textbox', { name: 'Contraseña' }).first().isVisible().catch(() => false);
            
            if (passwordFieldVisible) {
              // Flujo de una sola pantalla: completar password y hacer login
              const passwordFilledSamePage = await fillPassword(paypalPage, password, config.passwordTimeout * 2);

              if (passwordFilledSamePage) {
                await clickLogin(paypalPage, config.passwordTimeout);
              }
            } else {
              // Flujo de dos pasos: primero email, luego password
              const nextClicked = await clickNext(paypalPage, config.nextButtonTimeout);

              if (nextClicked) {
                await paypalPage.waitForTimeout(config.waitBetweenSteps);

                const passwordFilledSecond = await fillPassword(paypalPage, password, config.passwordTimeout * 2);

                if (passwordFilledSecond) {
                  await clickLogin(paypalPage, config.passwordTimeout);
                }
              }
            }
          }
        } catch (loginError) {
          // Login falló, continuar
        }

        // PASO 2: Intentar manejar consent condicional
        try {
          // Manejar consentimiento final con reintentos
          await retryClickInPageOrFrames(
            paypalPage,
            clickConsent,
            config.consentRetryTimeout,
            isHeadless ? 400 : 600
          );
        } catch (consentError) {
          // Consent falló, continuar
        }

        // Esperar a que el popup se cierre completamente
        if (!paypalPage.isClosed()) {
          try {
            await paypalPage.waitForEvent('close', { timeout: 10000 });
          } catch (closeError) {
            // Popup no se cerró automáticamente, continuar
          }
        }
      }
    } catch (popupError) {
      // No apareció popup después de todos los intentos, continuar con el flujo
    }

    // Esperar un poco para que se completen las operaciones asíncronas
    await page.waitForTimeout(waitAfterFlow);
    
  } catch (error) {
    // Error en el flujo de PayPal, continuar sin fallar el test
  }
}
