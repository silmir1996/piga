# Framework de Testing E2E 🏆

## Descripción

Este framework de testing automatizado está construido con **Playwright** y está diseñado específicamente para realizar pruebas end-to-end (E2E). El framework incluye pruebas automatizadas para diferentes flujos de usuario, incluyendo reservas de partidos, pagos, autenticación y más.

## Características Principales

- ✅ **Multi-dispositivo**: Soporte para Desktop Chrome y Mobile Browser
- ✅ **Multi-ambiente**: Configuración para desarrollo, staging y producción
- ✅ **Gestión de usuarios**: Sistema de usuarios predefinidos para diferentes escenarios
- ✅ **Utilidades robustas**: Funciones helper para manejo de popups, PayPal, y flujos complejos
- ✅ **Reportes detallados**: Generación automática de reportes HTML, JSON y JUnit
- ✅ **Scripts de conveniencia**: Comandos rápidos para ejecución de pruebas
- ✅ **Integración con MCP**: Soporte para Model Context Protocol

## Estructura del Proyecto

```
mcp-playwright-main/
├── tests/
│   ├── e2e/                    # Pruebas end-to-end
│   │   │   ├── escenariosGenerales/
│   │   │   └── vitalicios/
│   └── shared/
│       └── utils/             # Utilidades compartidas, usuarios, credenciales
│           ├── flow-handler.ts
│           ├── login.ts
│           ├── paypal.ts
│           ├── popup-handler.ts
│           ├── test-setup.ts
│           └── users.ts
├── docs/                      # Documentación
├── playwright.config.ts       # Configuración de Playwright
├── package.json              # Dependencias y scripts
└── README.md                 # Este archivo
```

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **Git**

## Guía de Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd mcp-playwright-main
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Instalar Navegadores de Playwright

```bash
npx playwright install
```

### 4. Configurar Variables de Entorno

Crea un archivo `.env.hybrid` en la raíz del proyecto con las siguientes variables:

```env
# URLs de los ambientes
BASE_URL_STAGING= ///
BASE_URL_DEV= ///

# Configuración de ejecución
MCP_HEADLESS=false

### 5. Configurar Scripts de Conveniencia (Opcional)

#### Para macOS/Linux (Zsh/Bash):

Agrega las siguientes líneas a tu archivo `~/.zshrc` o `~/.bashrc`:

```bash
# Scripts de testing
alias ts="~/Documents/MCPs/mcp-playwright-main/scripts/test-selector.sh"
alias t="~/Documents/MCPs/mcp-playwright-main/test-both.sh"
alias th="~/Documents/MCPs/mcp-playwright-main/test-both.sh headless"
alias tm="~/Documents/MCPs/mcp-playwright-main/scripts/test-mobile.sh"
alias td="~/Documents/MCPs/mcp-playwright-main/scripts/td.sh"
```

Luego recarga tu terminal:

```bash
source ~/.zshrc
```

#### Para Windows:

**Opción 1: Usar el script .bat directamente (MÁS FÁCIL - No requiere configuración)**

Simplemente ejecuta desde la raíz del proyecto:

```cmd
scripts\td.bat headed tests/e2e/login/loginAgip.spec.ts
```

O desde cualquier ubicación (ajusta la ruta):

```cmd
C:\Users\Quick\piga\scripts\td.bat headed tests/e2e/login/loginAgip.spec.ts
```

**Opción 2: Configurar alias en PowerShell (Requiere configuración una vez)**

Abre PowerShell y ejecuta:

```powershell
# Editar el perfil de PowerShell
notepad $PROFILE
```

Si el archivo no existe, créalo con:

```powershell
New-Item -Path $PROFILE -Type File -Force
```

Agrega estas líneas (ajusta la ruta según tu ubicación del proyecto):

```powershell
# Scripts de testing
function td {
    param([string]$ModeOrFile, [string]$TestFile)
    $scriptPath = Join-Path $PSScriptRoot "scripts\td.ps1"
    if (-not $scriptPath) {
        $scriptPath = "C:\Users\Quick\piga\scripts\td.ps1"  # Ajusta esta ruta
    }
    & $scriptPath $ModeOrFile $TestFile
}
```

Guarda y cierra. Luego recarga PowerShell:

```powershell
. $PROFILE
```

Ahora podrás usar: `td headed tests/e2e/login/loginAgip.spec.ts`

## Uso del Framework

### Comandos Básicos

#### Ejecutar Todas las Pruebas
```bash
npm run test:all-devices
```

#### Ejecutar Pruebas en Desktop
```bash
npm run test:desktop
```

#### Ejecutar Pruebas en Mobile
```bash
npm run test:mobile
```

#### Ejecutar Pruebas Específicas
```bash
npx playwright test "tests/e2e/matches/vitalicios/reservaWeb/1.socioAdherenteNo.spec.ts" --headed
```

### Comandos de Conveniencia

#### Selector Interactivo
```bash
ts
```
Este comando te permite:
1. Seleccionar un archivo de prueba específico
2. Elegir el dispositivo (Desktop, Mobile, o ambos)
3. Elegir el modo (Headed o Headless)

#### Ejecución Rápida
```bash
# Ejecutar en ambos dispositivos con navegador visible
t "ruta/al/test.spec.ts"

# Ejecutar en ambos dispositivos en modo headless
th "ruta/al/test.spec.ts"

# Ejecutar solo en mobile
tm "ruta/al/test.spec.ts"
```

### Generación de Código

Para utilizar funcionalidad click and record de Playwright (cuando se pausa un test en modo --headed se activa por defecto):

```bash
# Generar código para ambiente local
npm run codegen:local

# Generar código para ambiente de staging
npm run codegen:staging

# Generar código para ambiente de desarrollo
npm run codegen:dev
```

## Estructura de las Pruebas

### Ejemplo de Test

```typescript
import { test, expect } from '@playwright/test';
import { 
  executeStep, 
  loginWithUserType, 
  handlePopup, 
  clickAdherirDAButton 
} from '../../../shared/utils';

test('Mi prueba de ejemplo', async ({ page, context }) => {
  
  await test.step('Limpiar cache y cookies', async () => {
    await clearAllCache(page, context);
  });

  await test.step('Iniciar sesión', async () => {
    await loginWithUserType(page, 'socioActivo');
  });

  await test.step('Realizar acción específica', async () => {
    await page.getByText('Pagos').first().click();
    await clickAdherirDAButton(page, { which: 'first' });
  });
});
```

### Utilidades Disponibles

El framework incluye varias utilidades en `tests/shared/utils/`:

- **`login.ts`**: Funciones para autenticación
- **`paypal.ts`**: Manejo específico de flujos de PayPal
- **`popup-handler.ts`**: Gestión de ventanas emergentes
- **`flow-handler.ts`**: Manejo de flujos complejos
- **`users.ts`**: Definición de usuarios de prueba
- **`test-setup.ts`**: Configuración de pruebas

## Configuración de Playwright

El archivo `playwright.config.ts` incluye:

- **Multi-proyecto**: Configuración para Desktop Chrome y Mobile Safari
- **Reportes**: HTML, JSON y JUnit
- **Timeouts**: Configuración de timeouts para acciones
- **Screenshots y Videos**: Captura automática en fallos
- **Paralelización**: Ejecución paralela de pruebas

## Reportes y Resultados

### Ver Reportes
```bash
npx playwright show-report
```

### Ubicación de Reportes
- **HTML**: `playwright-report/`
- **JSON**: `test-results.json`
- **JUnit**: `test-results.xml`
- **Screenshots**: `test-results/`

## Troubleshooting

### Problemas Comunes

#### Comandos no encontrados
```bash
source ~/.zshrc
```

#### Permisos denegados
```bash
chmod +x test-selector.sh
chmod +x test-both.sh
```

#### Navegadores no instalados
```bash
npx playwright install
```

#### Cache de PayPal
```bash
# Limpiar cache específico de PayPal
await clearPayPalCache(page, context);
```

### Debugging

#### Modo Debug
```bash
# Ejecutar con navegador visible
npx playwright test --headed

# Pausar en puntos específicos
await page.pause();
```

#### Logs Detallados
```bash
DEBUG=pw:api npx playwright test
```

## Contribución

### Agregar Nuevas Pruebas

1. Crea un nuevo archivo `.spec.ts` en el directorio apropiado
2. Importa las utilidades necesarias
3. Usa la estructura de `test.step()` para organizar la prueba
4. Agrega el comando correspondiente en `package.json` si es necesario

### Agregar Nuevas Utilidades

1. Crea la función en el archivo apropiado en `tests/shared/utils/`
2. Exporta la función desde `tests/shared/utils/index.ts`
3. Documenta la función con JSDoc

## Documentación Adicional

- [Guía de Comandos de Playwright](./docs/playwright-test-commands-tutorial.md)
- [Guía de Limpieza de Cache](./docs/cache-clearing-guide.md)
- [Guía de Diferentes Flujos](./docs/different-flows-guide.md)
- [Referencia Rápida](./docs/quick-reference.md)

---

**¡Disfruta testing! 🏆⚽**
