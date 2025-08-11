/**
 * Utilidades para manejar PayPal en pruebas de Playwright
 * Incluye funciones para login condicional y manejo de popups específicos de PayPal
 */

/**
 * Maneja el login de PayPal con flujos condicionales
 * Puede manejar tanto el flujo de email+password en una página como el flujo separado
 * @param paypalPage - La página de PayPal
 * @param email - Email de PayPal
 * @param password - Contraseña de PayPal
 * @param options - Opciones de configuración
 */
export async function paypalLogin(
  paypalPage: any,
  email: string,
  password: string,
  options: {
    timeout?: number;
    waitAfterLogin?: number;
  } = {}
) {
  const { timeout = 10000, waitAfterLogin = 2000 } = options;

  try {
    // Esperar a que la página de PayPal cargue
    await paypalPage.waitForLoadState('networkidle');

    // Intentar llenar el email
    const emailSelectors = [
      'input[name="email"]',
      'input[id="email"]',
      'input[type="email"]',
      '[data-testid="email"]',
      'input[placeholder*="email" i]',
      'input[placeholder*="correo" i]'
    ];

    let emailFilled = false;
    for (const selector of emailSelectors) {
      try {
        const emailInput = paypalPage.locator(selector).first();
        if (await emailInput.isVisible({ timeout: 2000 })) {
          await emailInput.fill(email);
          emailFilled = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!emailFilled) {
      // Fallback con texto visible
      try {
        await paypalPage.getByRole('textbox', { name: /correo|email/i }).first().fill(email);
        emailFilled = true;
      } catch (e) {
        throw new Error('No se pudo encontrar el campo de email en PayPal');
      }
    }

    // Verificar si hay campo de contraseña visible (flujo en una sola página)
    const passwordSelectors = [
      'input[name="password"]',
      'input[id="password"]',
      'input[type="password"]',
      '[data-testid="password"]',
      'input[placeholder*="password" i]',
      'input[placeholder*="contraseña" i]'
    ];

    let passwordVisible = false;
    for (const selector of passwordSelectors) {
      try {
        const passwordInput = paypalPage.locator(selector).first();
        if (await passwordInput.isVisible({ timeout: 1000 })) {
          passwordVisible = true;
          await passwordInput.fill(password);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!passwordVisible) {
      // Si no hay campo de contraseña visible, es flujo de dos pasos
      // Buscar y hacer click en "Next"/"Siguiente"
      const nextButtons = [
        'button[id="btnNext"]',
        'button[name="btnNext"]',
        'input[id="btnNext"]',
        'input[name="btnNext"]'
      ];

      let nextClicked = false;
      for (const selector of nextButtons) {
        try {
          const nextBtn = paypalPage.locator(selector);
          if (await nextBtn.isVisible({ timeout: 2000 })) {
            await nextBtn.click();
            nextClicked = true;
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (!nextClicked) {
        // Fallback con texto visible
        try {
          await paypalPage.getByRole('button', { name: /next|siguiente|continuar/i }).first().click();
        } catch (e) {
          throw new Error('No se pudo encontrar el botón Next en PayPal');
        }
      }

      // Esperar a que aparezca la página de contraseña
      await paypalPage.waitForTimeout(2000);

      // Llenar contraseña en la segunda página
      let passwordFilledSecondPage = false;
      for (const selector of passwordSelectors) {
        try {
          const passwordInput = paypalPage.locator(selector).first();
          if (await passwordInput.isVisible({ timeout: 3000 })) {
            await passwordInput.fill(password);
            passwordFilledSecondPage = true;
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (!passwordFilledSecondPage) {
        try {
          await paypalPage.getByRole('textbox', { name: /password|contraseña/i }).first().fill(password);
        } catch (e) {
          throw new Error('No se pudo encontrar el campo de contraseña en la segunda página de PayPal');
        }
      }
    }

    // Hacer click en "Log In"/"Iniciar sesión"
    const loginButtons = [
      'button[id="btnLogin"]',
      'button[name="btnLogin"]',
      'input[id="btnLogin"]',
      'input[name="btnLogin"]',
      'button[type="submit"]'
    ];

    let loginClicked = false;
    for (const selector of loginButtons) {
      try {
        const loginBtn = paypalPage.locator(selector);
        if (await loginBtn.isVisible({ timeout: 2000 })) {
          await loginBtn.click();
          loginClicked = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!loginClicked) {
      // Fallback con texto visible
      try {
        await paypalPage.getByRole('button', { name: /log in|login|iniciar sesión|ingresar/i }).first().click();
      } catch (e) {
        throw new Error('No se pudo encontrar el botón de login en PayPal');
      }
    }

    // Esperar después del login
    await paypalPage.waitForTimeout(waitAfterLogin);

  } catch (error) {
    throw error;
  }
}

/**
 * Maneja el login de PayPal de manera más simple con manejo condicional
 * @param paypalPage - La página de PayPal
 * @param email - Email de PayPal
 * @param password - Contraseña de PayPal
 */
export async function simplePaypalLogin(paypalPage: any, email: string, password: string) {
  try {
    await paypalPage.waitForLoadState('networkidle');
    
    // Llenar email
    await paypalPage.getByRole('textbox', { name: /correo|email/i }).first().fill(email);
    
    // Verificar si hay campo de contraseña visible
    const passwordField = paypalPage.getByRole('textbox', { name: /password|contraseña/i }).first();
    const isPasswordVisible = await passwordField.isVisible({ timeout: 1000 }).catch(() => false);
    
    if (isPasswordVisible) {
      // Flujo en una sola página: email y password juntos
      await passwordField.fill(password);
      await paypalPage.getByRole('button', { name: /log in|login|iniciar sesión|ingresar/i }).first().click();
    } else {
      // Flujo de dos pasos: primero email, luego password
      await paypalPage.getByRole('button', { name: /next|siguiente|continuar/i }).first().click();
      await paypalPage.waitForTimeout(2000);
      
      await paypalPage.getByRole('textbox', { name: /password|contraseña/i }).first().fill(password);
      await paypalPage.getByRole('button', { name: /log in|login|iniciar sesión|ingresar/i }).first().click();
    }
    
    await paypalPage.waitForTimeout(2000);
  } catch (error) {
    throw error;
  }
}

/**
 * Completa el flujo de confirmación de pago en PayPal
 * @param paypalPage - La página de PayPal después del login
 * @param options - Opciones de configuración
 */
export async function confirmPaypalPayment(
  paypalPage: any,
  options: {
    waitAfterConfirm?: number;
    timeout?: number;
    includeConsent?: boolean;
  } = {}
) {
  const { waitAfterConfirm = 3000, timeout = 10000, includeConsent = true } = options;

  try {
    // Buscar botones de confirmación de pago
    const confirmButtons = [
      'button[id="payment-submit-btn"]',
      'button[data-testid="submit-button"]',
      'input[id="confirmButtonTop"]',
      'button[name="confirm"]'
    ];

    let confirmClicked = false;
    for (const selector of confirmButtons) {
      try {
        const confirmBtn = paypalPage.locator(selector);
        if (await confirmBtn.isVisible({ timeout: 2000 })) {
          await confirmBtn.click();
          confirmClicked = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }

          if (!confirmClicked) {
      // Fallback con texto visible
      try {
        await paypalPage.getByRole('button', { name: /continue|continuar|confirm|confirmar|complete|completar/i }).first().click();
      } catch (e) {
        // Continúa si no encuentra botón de confirmación
      }
    }

    await paypalPage.waitForTimeout(waitAfterConfirm);

    // Manejar el botón de consentimiento final si está habilitado
    if (includeConsent) {
      await handlePaypalConsent(paypalPage);
    }

  } catch (error) {
    throw error;
  }
}

/**
 * Maneja específicamente el botón de consentimiento de PayPal
 * @param paypalPage - La página de PayPal
 * @param options - Opciones de configuración
 */
export async function handlePaypalConsent(
  paypalPage: any,
  options: {
    timeout?: number;
    waitAfterClick?: number;
    waitForClose?: boolean;
  } = {}
) {
  const { timeout = 10000, waitAfterClick = 2000, waitForClose = true } = options;

  try {
    // Múltiples selectores para el botón de consentimiento
    const consentSelectors = [
      '[data-testid="consentButton"]',
      'button[data-testid="consentButton"]',
      '#consentButton',
      'button[id="consentButton"]',
      '[name="consentButton"]',
      'button[name="consentButton"]',
      '.consent-button',
      '[data-test="consentButton"]',
      '[data-qa="consentButton"]'
    ];

    for (const selector of consentSelectors) {
      try {
        const button = paypalPage.locator(selector).first();
        if (await button.isVisible({ timeout: 2000 })) {
          await button.click();
          await paypalPage.waitForTimeout(waitAfterClick);
          
          // Esperar a que el popup se cierre automáticamente después del consentimiento
          if (waitForClose && !paypalPage.isClosed()) {
            try {
              await paypalPage.waitForEvent('close', { timeout: 8000 });
            } catch (e) {
              // Si no se cierra automáticamente, continuar
            }
          }
          
          return true;
        }
      } catch (e) {
        continue;
      }
    }

    // Fallback con texto visible
    try {
      const textButtons = [
        /consent/i,
        /consentir/i,
        /agree/i,
        /aceptar/i,
        /acepto/i,
        /confirm/i,
        /confirmar/i,
        /continue/i,
        /continuar/i,
        /finish/i,
        /finalizar/i,
        /complete/i,
        /completar/i
      ];

      for (const textPattern of textButtons) {
        try {
          const button = paypalPage.getByRole('button', { name: textPattern }).first();
          if (await button.isVisible({ timeout: 1000 })) {
            await button.click();
            await paypalPage.waitForTimeout(waitAfterClick);
            
            // Esperar a que el popup se cierre automáticamente después del consentimiento
            if (waitForClose && !paypalPage.isClosed()) {
              try {
                await paypalPage.waitForEvent('close', { timeout: 8000 });
              } catch (e) {
                // Si no se cierre automáticamente, continuar
              }
            }
            
            return true;
          }
        } catch (e) {
          continue;
        }
      }
    } catch (e) {
      // Continúa si no encuentra botones de texto
    }

    return false;
  } catch (error) {
    return false;
  }
}



/**
 * Maneja el flujo completo de PayPal: login + confirmación
 * @param paypalPage - La página de PayPal
 * @param email - Email de PayPal
 * @param password - Contraseña de PayPal
 * @param options - Opciones de configuración
 */
export async function completePaypalFlow(
  paypalPage: any,
  email: string,
  password: string,
  options: {
    skipConfirmation?: boolean;
    loginMethod?: 'robust' | 'simple';
    includeConsent?: boolean;
    waitAfterConfirm?: number;
    waitForClose?: boolean;
  } = {}
) {
  const { 
    skipConfirmation = false, 
    loginMethod = 'robust',
    includeConsent = true,
    waitAfterConfirm = 3000,
    waitForClose = true
  } = options;

  try {
    // Realizar login
    if (loginMethod === 'simple') {
      await simplePaypalLogin(paypalPage, email, password);
    } else {
      await paypalLogin(paypalPage, email, password);
    }

    // Confirmar pago si no se omite
    if (!skipConfirmation) {
      await confirmPaypalPayment(paypalPage, {
        includeConsent,
        waitAfterConfirm
      });
    }

    // Esperar a que el popup se cierre automáticamente si es necesario
    if (waitForClose && !paypalPage.isClosed()) {
      try {
        await paypalPage.waitForEvent('close', { timeout: 10000 });
      } catch (e) {
        // Si no se cierra automáticamente, continuar
      }
    }

  } catch (error) {
    throw error;
  }
}
