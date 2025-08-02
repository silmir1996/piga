# Handling Different Flows Between Mobile and Desktop

## The Problem

You have specific tests where the **navigation flow itself is different** between mobile and desktop, not just timing or element behavior. For example:

- **Desktop**: Sidebar menu → Submenu → Action
- **Mobile**: Hamburger menu → Modal → Action

## Solution: Flow Handler Utilities

### 1. **executeStep()** - Single Step with Different Flows

Use when you need different actions for a single step:

```typescript
import { executeStep } from '../../../shared/utils';

await executeStep(
  page,
  // Desktop flow
  async () => {
    await page.getByText('Partidos').click();
  },
  // Mobile flow - different navigation
  async () => {
    await page.click('[data-testid="mobile-menu-toggle"]');
    await page.click('[data-testid="mobile-partidos-link"]');
  }
);
```

### 2. **executeFlow()** - Multiple Steps with Different Flows

Use when you have a sequence of steps that differ between devices:

```typescript
import { executeFlow } from '../../../shared/utils';

await executeFlow(page, [
  {
    desktop: async () => {
      // Desktop: Direct navigation
      await page.getByText('Partidos').click();
      await page.getByText('Vitalicios').click();
    },
    mobile: async () => {
      // Mobile: Hamburger menu navigation
      await page.click('[data-testid="hamburger-menu"]');
      await page.click('[data-testid="mobile-partidos"]');
      await page.click('[data-testid="mobile-vitalicios"]');
    }
  },
  {
    desktop: async () => {
      // Desktop: Direct button click
      await page.getByRole('button', { name: 'Continuar' }).click();
    },
    mobile: async () => {
      // Mobile: Scroll first, then click
      await page.getByRole('button', { name: 'Continuar' }).scrollIntoViewIfNeeded();
      await page.getByRole('button', { name: 'Continuar' }).click();
    }
  }
]);
```

### 3. **clickConditionally()** - Different Selectors

Use when elements have different selectors on mobile vs desktop:

```typescript
import { clickConditionally } from '../../../shared/utils';

await clickConditionally(
  page,
  // Desktop selector
  '[data-testid="desktop-event-button"]',
  // Mobile selector
  '[data-testid="mobile-event-button"]',
  { waitForNavigation: true }
);
```

### 4. **navigateWithDevicePattern()** - Standard Navigation Patterns

Use for common navigation patterns like hamburger vs sidebar:

```typescript
import { navigateWithDevicePattern } from '../../../shared/utils';

await navigateWithDevicePattern(page, {
  desktop: {
    menuSelector: '.sidebar-menu',
    submenuSelector: '.sidebar-submenu'
  },
  mobile: {
    hamburgerSelector: '.hamburger-menu',
    menuItemSelector: '.mobile-menu-item'
  }
});
```

## Real-World Examples

### Example 1: Different Menu Navigation

```typescript
// Before: Only works on desktop
await page.getByText('Partidos').click();

// After: Works on both devices
await executeStep(
  page,
  // Desktop: Direct click
  async () => {
    await page.getByText('Partidos').click();
  },
  // Mobile: Hamburger menu first
  async () => {
    await page.click('[data-testid="mobile-menu"]');
    await page.click('[data-testid="mobile-partidos"]');
  }
);
```

### Example 2: Different Form Interactions

```typescript
// Before: Only works on desktop
await page.selectOption('select[name="category"]', 'vitalicios');

// After: Works on both devices
await executeStep(
  page,
  // Desktop: Dropdown select
  async () => {
    await page.selectOption('select[name="category"]', 'vitalicios');
  },
  // Mobile: Modal picker
  async () => {
    await page.click('[data-testid="category-field"]');
    await page.click('[data-testid="modal-vitalicios-option"]');
  }
);
```

### Example 3: Different URL Patterns

```typescript
// Before: Only works on desktop
await page.goto('/matches/875/confirmation');

// After: Works on both devices
await executeStep(
  page,
  // Desktop: Direct URL
  async () => {
    await page.goto('/matches/875/confirmation');
  },
  // Mobile: Different URL or additional steps
  async () => {
    await page.goto('/mobile/matches/875/confirmation');
    // OR if mobile needs additional setup
    // await page.click('[data-testid="mobile-confirm"]');
  }
);
```

## Migration Strategy

### Step 1: Identify Different Flows

Look for these patterns in your tests:
- Different navigation paths
- Different element selectors
- Different interaction patterns
- Different URL structures

### Step 2: Replace with Flow Handlers

```typescript
// Identify the problematic step
await page.getByText('Partidos').click(); // This might fail on mobile

// Replace with conditional execution
await executeStep(
  page,
  async () => { /* desktop flow */ },
  async () => { /* mobile flow */ }
);
```

### Step 3: Test Both Devices

```bash
# Test on desktop
npx playwright test --project="Desktop Chrome"

# Test on mobile
npx playwright test --project="Mobile Safari"

# Test on both
npx playwright test
```

## Best Practices

### 1. Keep Common Logic Shared

```typescript
// Good: Common expectations
await expect(page.getByText('Success')).toBeVisible();

// Good: Common setup
await loginWithUserType(page, 'socioAdherenteNo');

// Good: Different flows only where needed
await executeStep(page, desktopFlow, mobileFlow);
```

### 2. Use Descriptive Comments

```typescript
await executeStep(
  page,
  // Desktop: Direct sidebar navigation
  async () => {
    await page.click('.sidebar-menu');
  },
  // Mobile: Hamburger menu navigation
  async () => {
    await page.click('.hamburger-toggle');
    await page.click('.mobile-menu');
  }
);
```

### 3. Debug Device Detection

```typescript
import { logDeviceConfig } from '../../../shared/utils';

test('My test', async ({ page }) => {
  logDeviceConfig(page); // Logs: [Flow Handler] Device: Mobile, Viewport: 375x667
  // ... rest of test
});
```

### 4. Handle Edge Cases

```typescript
await executeStep(
  page,
  // Desktop: Standard flow
  async () => {
    await page.click('.desktop-button');
  },
  // Mobile: Handle potential overlay or modal
  async () => {
    try {
      await page.click('.mobile-button');
    } catch {
      // Mobile might have overlay, try alternative
      await page.click('.mobile-button-overlay');
    }
  }
);
```

## When to Use Each Approach

- **`executeStep()`**: Single actions that differ between devices
- **`executeFlow()`**: Multiple sequential steps that differ
- **`clickConditionally()`**: Same action, different selectors
- **`navigateWithDevicePattern()`**: Standard navigation patterns

This approach allows you to handle different flows without duplicating your entire test code, keeping it maintainable and readable. 