# Playwright Test Commands Tutorial 🚀

This tutorial covers all the new commands and features for running Playwright tests efficiently across different devices and modes.

## Table of Contents
- [Quick Start](#quick-start)
- [Available Commands](#available-commands)
- [Interactive Test Selector](#interactive-test-selector)
- [Device Selection](#device-selection)
- [Execution Modes](#execution-modes)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Quick Start

After setting up your environment, you can use these commands:

```bash
# Interactive test selector (recommended)
ts

# Quick test execution
t "path/to/test.spec.ts"

# Headless test execution
th "path/to/test.spec.ts"
```

## Available Commands

### 1. Interactive Test Selector (`ts`)
The most powerful and user-friendly way to run tests.

```bash
ts
```

**Features:**
- Lists all available test files with numbers
- Choose device (Desktop, Mobile, or Both)
- Choose execution mode (Headed or Headless)
- Navigate back if you make a mistake

### 2. Quick Test Execution (`t`)
Run a specific test on both devices in headed mode.

```bash
t "tests/e2e/matches/vitalicios/reservaInterna/4.reservaGeneralesConValidacion.spec.ts"
```

### 3. Headless Test Execution (`th`)
Run a specific test on both devices in headless mode (faster).

```bash
th "tests/e2e/matches/vitalicios/reservaInterna/4.reservaGeneralesConValidacion.spec.ts"
```

## Interactive Test Selector

The `ts` command provides a step-by-step interface:

### Step 1: Select Test File
```
🔍 Available test files:

1. tests/e2e/matches/confirmacionFiltro/1.socioAdherenteNo.spec.ts
2. tests/e2e/matches/confirmacionFiltro/2.socioActivoAbonoNo.spec.ts
...
35. tests/e2e/payment/TarjetasInternacionales.spec.ts

Enter the number of the test file to run (or 'q' to quit):
```

### Step 2: Select Device
```
📱 Select device to run the test on:
1. 🖥️  Desktop Chrome only
2. 📱 Mobile Safari only
3. 🔄 Both devices (Desktop + Mobile)
4. 🔄 Both devices (Desktop + Mobile, continue even if desktop fails)
5. ↩️  Back to test selection

Enter your choice (1-5):
```

### Step 3: Select Execution Mode
```
🎯 Select execution mode:
1. 👁️  Headed (browser visible)
2. 🚀 Headless (faster, no browser window)
3. ↩️  Back to device selection

Enter your choice (1-3):
```

## Device Selection

### Desktop Chrome Only
- **Use case**: Testing desktop-specific features
- **Command**: Select option 1 in device selection
- **Best for**: Desktop UI testing, larger screen interactions

### Mobile Safari Only
- **Use case**: Testing mobile-specific features
- **Command**: Select option 2 in device selection
- **Best for**: Mobile responsiveness, touch interactions

### Both Devices (Sequential)
- **Use case**: Cross-platform testing
- **Command**: Select option 3 in device selection
- **Behavior**: Runs Desktop first, then Mobile (only if Desktop passes)

### Both Devices (Continue on Failure)
- **Use case**: Cross-platform testing with fallback
- **Command**: Select option 4 in device selection
- **Behavior**: Runs Desktop first, then Mobile (regardless of Desktop result)
- **Exit code**: Success if at least one test passes, failure if both fail

## Execution Modes

### Headed Mode
- **Browser**: Visible browser window
- **Use case**: Debugging, watching test execution
- **Speed**: Slower (visual rendering)
- **Best for**: Development and debugging

### Headless Mode
- **Browser**: No visible window
- **Use case**: Fast execution, CI/CD
- **Speed**: Faster (no visual rendering)
- **Best for**: Quick testing and automation

## Examples

### Example 1: Quick Mobile Test
```bash
ts
# Select: 23 (reservaGeneralesConValidacion)
# Select: 2 (Mobile Safari only)
# Select: 1 (Headed mode)
```

### Example 2: Fast Cross-Platform Test
```bash
ts
# Select: 28 (reservaWeb test)
# Select: 3 (Both devices)
# Select: 2 (Headless mode)
```

### Example 3: Desktop Debugging
```bash
ts
# Select: 15 (any test)
# Select: 1 (Desktop Chrome only)
# Select: 1 (Headed mode)
```

### Example 4: Direct Commands
```bash
# Run specific test on both devices (headed)
t "tests/e2e/matches/vitalicios/reservaInterna/4.reservaGeneralesConValidacion.spec.ts"

# Run specific test on both devices (headless)
th "tests/e2e/matches/vitalicios/reservaInterna/4.reservaGeneralesConValidacion.spec.ts"
```

## Workflow Recommendations

### For Development
1. Use `ts` for interactive selection
2. Choose headed mode to see what's happening
3. Select specific device for focused testing

### For Quick Testing
1. Use `th` for fast headless execution
2. Use `t` for headed execution when you need to see the browser

### For Debugging
1. Use `ts` → select specific device → headed mode
2. Watch the browser to identify issues
3. Use Playwright's built-in debugging features

### For CI/CD
1. Use headless mode for speed
2. Run on both devices for comprehensive testing
3. Use direct Playwright commands for automation

## Troubleshooting

### Command Not Found
If `ts`, `t`, or `th` commands are not found:

```bash
# Reload shell configuration
source ~/.zshrc

# Or restart your terminal
```

### Permission Denied
If you get permission errors:

```bash
# Make script executable
chmod +x test-selector.sh
```

### Test Failures
Common issues and solutions:

1. **Timeout Errors**: Network issues or slow loading
   - Try running in headed mode to see what's happening
   - Check your internet connection

2. **Element Not Found**: Page structure changes
   - Update your selectors in the test files
   - Check if the application has been updated

3. **Mobile Safari Issues**: Mobile-specific problems
   - Test on Desktop first to isolate the issue
   - Check mobile-specific selectors

### Getting Help
- Use `npx playwright show-report` to view detailed test reports
- Check the test-results folder for screenshots and videos
- Use headed mode to watch test execution in real-time

## Advanced Usage

### Custom Test Paths
You can run the selector with a specific test:

```bash
./test-selector.sh "tests/e2e/matches/vitalicios/reservaInterna/4.reservaGeneralesConValidacion.spec.ts"
```

### Environment Variables
The tests use `.env.hybrid` for configuration. Make sure it's properly set up.

### Parallel Execution
For running multiple tests in parallel, use Playwright's built-in parallel execution:

```bash
npx playwright test --workers=3
```

## Summary

You now have a powerful set of tools for Playwright testing:

- **`ts`**: Interactive selector (most flexible)
- **`t`**: Quick both-device headed execution
- **`th`**: Quick both-device headless execution
- **Device selection**: Desktop, Mobile, or Both
- **Mode selection**: Headed or Headless
- **Navigation**: Go back at any step

These commands make testing across different devices and modes much more efficient and user-friendly! 🎯 