/**
 * Utilidades para manejar popups y ventanas múltiples en Playwright
 */

/**
 * Maneja ventanas emergentes (popups) en Playwright
 * @param page - La página principal de Playwright
 * @param triggerAction - Función que ejecuta la acción que abre el popup
 * @param options - Opciones de configuración
 * @returns La nueva página del popup
 */
export async function handlePopup(
  page: any,
  triggerAction: () => Promise<void>,
  options: {
    waitForLoadState?: 'load' | 'domcontentloaded' | 'networkidle';
    timeout?: number;
    retries?: number;
  } = {}
) {
  const { waitForLoadState = 'networkidle', timeout = 30000, retries = 2 } = options;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Configurar listener para la nueva ventana ANTES de ejecutar la acción
      const popupPromise = page.waitForEvent('popup', { timeout });
      
      // Ejecutar la acción que abre el popup
      await triggerAction();
      
      // Esperar a que se abra la ventana y cargar completamente
      const popupPage = await popupPromise;
      await popupPage.waitForLoadState(waitForLoadState);
      
      return popupPage;
    } catch (error) {
      if (attempt === retries) {
        // Si es el último intento, lanzar el error
        throw error;
      }
    }
  }
}

/**
 * Maneja múltiples ventanas abiertas durante un test
 * @param page - La página principalgetByRole('button', { name: 'Adherir a débito automático' })
 * @returns Objeto con métodos para manejar las ventanas
 */
export function createWindowManager(page: any) {
  const windows: any[] = [page];
  
  return {
    async openPopup(triggerAction: () => Promise<void>, options?: any) {
      const popup = await handlePopup(page, triggerAction, options);
      windows.push(popup);
      return popup;
    },
    
    async switchToWindow(index: number) {
      if (windows[index]) {
        await windows[index].bringToFront();
        return windows[index];
      }
      throw new Error(`Window at index ${index} does not exist`);
    },
    
    async closeAllPopups() {
      for (let i = 1; i < windows.length; i++) {
        if (!windows[i].isClosed()) {
          await windows[i].close();
        }
      }
      windows.length = 1; // Mantener solo la ventana principal
    },
    
    getWindowCount() {
      return windows.length;
    }
  };
}
