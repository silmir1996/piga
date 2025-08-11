# Cache and Cookie Clearing Guide

This guide explains the cache and cookie clearing improvements made to ensure proper test isolation.

## Issues Fixed

### 1. **Incorrect Playwright Configuration**
- **Problem**: `contextOptions.clearCookies` and `contextOptions.clearCache` are not valid Playwright options
- **Solution**: Replaced with proper browser launch arguments for cache control

### 2. **Missing Test Isolation**
- **Problem**: Tests were sharing state between runs
- **Solution**: Added comprehensive cache clearing utilities and test setup hooks

### 3. **Incomplete Cache Clearing**
- **Problem**: Previous cache clearing was incomplete and had poor error handling
- **Solution**: Enhanced cache clearing with multi-layer approach and proper error handling

## New Configuration

### Playwright Config Changes
```typescript
// Chrome/Chromium browsers now use launch arguments for cache control
launchOptions: {
  args: [
    '--disable-cache',
    '--disable-application-cache',
    '--disable-offline-load-stale-cache',
    '--disk-cache-size=0',
    // ... other optimization flags
  ]
}
```

### Enhanced Cache Clearing Utilities

#### `clearAllCache(page, context)`
Comprehensive cache clearing that handles:
- Browser context cookies
- Local storage
- Session storage
- IndexedDB
- Cache API
- Network cache (via CDP for Chrome)
- Origin storage (via CDP for Chrome)

#### `clearPayPalCache(page, context)`
Specialized PayPal cache clearing for payment tests.

## Usage Patterns

### 1. **Automatic Test Isolation**
For most tests, use the setup functions:

```typescript
import { setupStrictTestIsolation } from '../../../shared/utils';

// Clears cache before AND after each test (recommended for payment/auth tests)
setupStrictTestIsolation();

// OR for lighter cleanup (clears cache before each test only)
setupTestIsolation({ clearCacheBeforeTest: true });
```

### 2. **Manual Cache Clearing**
Within test steps when needed:

```typescript
import { clearCacheInTest } from '../../../shared/utils';

test('my test', async ({ page, context }) => {
  // ... some test steps
  
  await clearCacheInTest(page, context);
  
  // ... continue test with clean state
});
```

### 3. **PayPal-Specific Tests**
For PayPal tests, use the existing pattern:

```typescript
await clearAllCache(page, context);
await clearPayPalCache(page, context);
```

## Test Categories and Recommendations

### **Payment Tests**
- Use `setupStrictTestIsolation()` 
- Clears cache before and after each test
- Essential for preventing payment state leakage

### **Authentication Tests**
- Use `setupStrictTestIsolation()` or `setupTestIsolation({ clearCacheBeforeTest: true })`
- Prevents session state interference

### **General UI Tests**
- Use `setupTestIsolation({ clearCacheBeforeTest: true })`
- Basic cleanup sufficient for most cases

### **Performance Tests**
- Use `setupMinimalTestIsolation()` 
- Minimal cleanup to avoid affecting performance measurements

## Applying to Existing Tests

### Quick Migration
Add this to any test file that needs better isolation:

```typescript
import { setupStrictTestIsolation } from '../../../shared/utils';

setupStrictTestIsolation();

// Your existing tests remain unchanged
test('my test', async ({ page }) => {
  // ...
});
```

### Examples Applied

1. **PayPal Tests**: Already updated with `setupStrictTestIsolation()`
2. **Other Payment Tests**: Should use `setupStrictTestIsolation()`
3. **Auth Tests**: Should use `setupTestIsolation({ clearCacheBeforeTest: true })`
4. **General Tests**: Can use basic `setupTestIsolation()`

## Verification

To verify cache clearing is working:

1. **Check Console Output**: Cache clearing operations now log their progress
2. **Test Isolation**: Tests should not affect each other's state
3. **Consistent Results**: Tests should pass consistently across runs

## Troubleshooting

### If Tests Still Share State
1. Verify you're using the setup functions
2. Check if tests are running in parallel (may need to adjust workers)
3. Consider using `setupStrictTestIsolation()` for more thorough cleanup

### If Cache Clearing Fails
- Check browser compatibility (CDP features require Chrome/Chromium)
- Review console logs for specific error messages
- Fallback mechanisms are in place, tests should still run

### Performance Impact
- Cache clearing adds ~1-2 seconds per test
- Use lighter cleanup (`setupTestIsolation()`) for non-critical tests
- Consider disabling for performance-sensitive tests

## Migration Checklist

- [ ] Update Playwright config (✅ Done)
- [ ] Add test setup to payment tests (✅ Started with PayPal)
- [ ] Add test setup to authentication tests
- [ ] Add test setup to other critical tests
- [ ] Test the changes with existing test suite
- [ ] Monitor for any performance or reliability issues
