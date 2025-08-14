# Guía de Contribución - Framework de Testing E2E Boca Juniors 🏆

¡Gracias por tu interés en contribuir al framework de testing automatizado de Boca Juniors! Este documento te guiará a través del proceso de contribución.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Configuración del Entorno](#configuración-del-entorno)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Convenciones de Código](#convenciones-de-código)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Escribiendo Pruebas](#escribiendo-pruebas)
- [Utilidades y Helpers](#utilidades-y-helpers)
- [Reportes y Debugging](#reportes-y-debugging)
- [Revisión de Código](#revisión-de-código)

## 🤝 Código de Conducta

Al contribuir a este proyecto, te comprometes a:

- Ser respetuoso y colaborativo con otros contribuyentes
- Mantener un ambiente inclusivo y acogedor
- Seguir las mejores prácticas de testing
- Documentar adecuadamente tus cambios

## 🛠️ Configuración del Entorno

### Requisitos Previos

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **Git**
- **Playwright** (se instala automáticamente)

### Instalación

```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd mcp-playwright-boca

# Instalar dependencias
npm install

# Instalar navegadores de Playwright
npx playwright install

# Configurar variables de entorno
cp .env.example .env.hybrid
# Editar .env.hybrid con tus credenciales
```

### Scripts de Conveniencia (Opcional)

Agrega estos alias a tu `~/.zshrc`:

```bash
# Scripts de testing de Boca
alias ts="~/Documents/Paisanos/boca/mcp-playwright-boca/test-selector.sh"
alias t="~/Documents/Paisanos/boca/mcp-playwright-boca/test-both.sh"
alias th="~/Documents/Paisanos/boca/mcp-playwright-boca/test-both.sh headless"
alias tm="~/Documents/Paisanos/boca/mcp-playwright-boca/test-mobile.sh"
```

## 📁 Estructura del Proyecto

```
mcp-playwright-boca/
├── tests/
│   ├── e2e/                    # Pruebas end-to-end
│   │   ├── abono/             # Pruebas de abonos
│   │   ├── home/              # Pruebas de página principal
│   │   ├── login/             # Pruebas de autenticación
│   │   ├── matches/           # Pruebas de reservas de partidos
│   │   │   ├── confirmacionFiltro/
│   │   │   ├── confirmacionInterna/
│   │   │   ├── confirmacionWeb/
│   │   │   ├── escenariosGenerales/
│   │   │   └── vitalicios/
│   │   └── payment/           # Pruebas de pagos
│   └── shared/
│       └── utils/             # Utilidades compartidas
├── docs/                      # Documentación
├── playwright.config.ts       # Configuración de Playwright
└── package.json              # Dependencias y scripts
```

## 📝 Convenciones de Código

### Nomenclatura

- **Archivos de prueba**: `nombreDescriptivo.spec.ts`
- **Utilidades**: `kebab-case.ts`
- **Funciones**: `camelCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Tipos/Interfaces**: `PascalCase`

### Estructura de Pruebas

```typescript
import { test, expect } from '@playwright/test';
import { 
  executeStep, 
  loginWithUserType, 
  selectAndVerifySeat 
} from '../../../shared/utils';

test('Descripción clara del escenario de prueba', async ({ page }) => {
  
  await test.step('Paso 1: Descripción de la acción', async () => {
    // Implementación
  });

  await test.step('Paso 2: Descripción de la validación', async () => {
    // Implementación
  });
});
```

### Comentarios y Documentación

```typescript
/**
 * Función que maneja el flujo de selección de asientos
 * @param page - Instancia de la página de Playwright
 * @param seatId - ID del asiento a seleccionar
 * @param seatNumber - Número del asiento
 */
export async function selectAndVerifySeat(page: Page, seatId: string, seatNumber: string) {
  // Implementación
}
```

## 🔄 Proceso de Desarrollo

### 1. Crear una Rama

```bash
# Crear y cambiar a una nueva rama
git checkout -b feature/nombre-de-la-funcionalidad
# o
git checkout -b fix/nombre-del-bug
```

### 2. Desarrollo

- Escribe tus pruebas siguiendo las convenciones
- Ejecuta las pruebas localmente antes de commitear
- Mantén commits pequeños y descriptivos

### 3. Testing Local

```bash
# Ejecutar todas las pruebas
npm run test:all-devices

# Ejecutar pruebas específicas
npx playwright test "ruta/al/test.spec.ts" --headed

# Ejecutar en modo debug
npx playwright test --debug
```

### 4. Commit y Push

```bash
# Agregar cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: agregar prueba para reserva de plateas

- Agregar test para validar selección de asientos
- Implementar utilidad para verificar disponibilidad
- Documentar flujo de reserva"

# Push a la rama
git push origin feature/nombre-de-la-funcionalidad
```

## 🧪 Escribiendo Pruebas

### Principios Fundamentales

1. **Independencia**: Cada prueba debe ser independiente
2. **Reproducibilidad**: Las pruebas deben ser determinísticas
3. **Claridad**: El código debe ser fácil de entender
4. **Mantenibilidad**: Usar utilidades compartidas cuando sea posible

### Estructura Recomendada

```typescript
test('Escenario: Usuario puede reservar asiento en platea', async ({ page }) => {
  
  await test.step('Preparación: Login del usuario', async () => {
    await loginWithUserType(page, 'socioHabilitadoReservaWebPlatea');
  });

  await test.step('Acción: Navegar a reservas', async () => {
    await page.getByText('Partidos').click();
    await page.waitForTimeout(1000);
  });

  await test.step('Validación: Verificar disponibilidad', async () => {
    await expect(page.getByTestId('evento-secciones')).toBeVisible();
  });

  await test.step('Limpieza: Cancelar reserva si es necesario', async () => {
    // Implementar limpieza si es necesario
  });
});
```

### Buenas Prácticas

#### ✅ Hacer

- Usar `test.step()` para organizar la prueba
- Implementar limpieza después de cada prueba
- Usar selectores robustos (data-testid, roles, texto)
- Agregar timeouts apropiados
- Documentar casos edge

#### ❌ Evitar

- Usar selectores por posición (nth)
- Hardcodear credenciales
- Dejar pruebas sin limpiar datos
- Usar timeouts fijos sin justificación
- Escribir pruebas que dependan de otras

### Manejo de Usuarios

```typescript
// Usar usuarios predefinidos
await loginWithUserType(page, 'socioHabilitadoReservaWebPlatea');

// Evitar crear usuarios dinámicamente en las pruebas
```

### Manejo de Popups y Ventanas Emergentes

```typescript
// Usar utilidades existentes
import { handlePopup } from '../../../shared/utils';

await handlePopup(page, 'confirmar');
```

## 🛠️ Utilidades y Helpers

### Utilidades Disponibles

- **`login.ts`**: Autenticación y gestión de usuarios
- **`paypal.ts`**: Flujos específicos de PayPal
- **`popup-handler.ts`**: Manejo de ventanas emergentes
- **`flow-handler.ts`**: Flujos complejos y condicionales
- **`test-setup.ts`**: Configuración y limpieza

### Crear Nuevas Utilidades

1. **Crear el archivo** en `tests/shared/utils/`
2. **Exportar la función** desde `index.ts`
3. **Documentar** con JSDoc
4. **Agregar tests** si es necesario

```typescript
// tests/shared/utils/nueva-utilidad.ts
import { Page } from '@playwright/test';

/**
 * Descripción de la función
 * @param page - Instancia de la página
 * @param options - Opciones de configuración
 */
export async function nuevaUtilidad(page: Page, options?: any) {
  // Implementación
}

// tests/shared/utils/index.ts
export { nuevaUtilidad } from './nueva-utilidad';
```

## 📊 Reportes y Debugging

### Generar Reportes

```bash
# Ejecutar pruebas con reportes
npx playwright test --reporter=html

# Ver reportes
npx playwright show-report
```

### Debugging

```typescript
// Pausar en puntos específicos
await page.pause();

// Logs detallados
console.log('Debug info:', await page.url());

// Screenshots en fallos
await page.screenshot({ path: 'debug-screenshot.png' });
```

### Troubleshooting Común

#### Problemas de Timing
```typescript
// En lugar de waitForTimeout
await page.waitForTimeout(1000);

// Usar waitForSelector o waitForLoadState
await page.waitForSelector('[data-testid="mi-elemento"]');
await page.waitForLoadState('networkidle');
```

#### Problemas de Selectores
```typescript
// Evitar selectores frágiles
await page.locator('div').nth(3).click();

// Usar selectores robustos
await page.getByTestId('mi-boton').click();
await page.getByRole('button', { name: 'Continuar' }).click();
```

## 👀 Revisión de Código

### Checklist de Revisión

- [ ] Las pruebas siguen las convenciones de nomenclatura
- [ ] Se usan utilidades compartidas cuando es apropiado
- [ ] Los selectores son robustos y no dependen de posición
- [ ] Se implementa limpieza adecuada
- [ ] La documentación está actualizada
- [ ] Las pruebas pasan en todos los dispositivos
- [ ] No hay credenciales hardcodeadas
- [ ] Los commits son descriptivos y pequeños

### Proceso de Revisión

1. **Crear Pull Request** con descripción clara
2. **Ejecutar CI/CD** automáticamente
3. **Revisión de código** por al menos un reviewer
4. **Aprobación** y merge

### Estándares de Pull Request

- **Título descriptivo**: "feat: agregar prueba para reserva de plateas"
- **Descripción detallada**: Qué hace, por qué, cómo
- **Screenshots**: Si aplica para cambios de UI
- **Tests**: Evidencia de que las pruebas pasan

## 🚀 Comandos Útiles

### Desarrollo

```bash
# Ejecutar pruebas en modo headed
npm run test:desktop -- --headed

# Ejecutar pruebas específicas
npx playwright test "tests/e2e/matches/**/*.spec.ts"

# Generar código con Playwright
npm run codegen:staging
```

### Debugging

```bash
# Ejecutar con logs detallados
DEBUG=pw:api npx playwright test

# Ejecutar en modo debug
npx playwright test --debug

# Ver reportes
npx playwright show-report
```

### Limpieza

```bash
# Limpiar reportes
rm -rf playwright-report/
rm -rf test-results/

# Limpiar cache
npm run clean
```

## 📚 Recursos Adicionales

- [Documentación de Playwright](https://playwright.dev/)
- [Guía de Testing E2E](./docs/)
- [Referencia Rápida](./docs/quick-reference.md)
- [Guía de Comandos](./docs/playwright-test-commands-tutorial.md)

## 🤝 Contacto

Si tienes preguntas o necesitas ayuda:

1. Revisa la documentación existente
2. Busca en issues existentes
3. Crea un nuevo issue con detalles claros
4. Contacta al equipo de desarrollo

---

**¡Gracias por contribuir al framework de testing de Boca Juniors! 🏆⚽**
