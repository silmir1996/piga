# Playwright Test Commands - Quick Reference 🚀

## Essential Commands

| Command | Description | Example |
|---------|-------------|---------|
| `ts` | Interactive test selector | `ts` |
| `t` | Quick both-device headed | `t "path/to/test.spec.ts"` |
| `th` | Quick both-device headless | `th "path/to/test.spec.ts"` |

## Interactive Selector Flow (`ts`)

```
1. Select test file (numbered list)
2. Choose device:
   - 1 = Desktop Chrome only
   - 2 = Mobile Safari only  
   - 3 = Both devices
   - 4 = Both devices (continue even if desktop fails)
   - 5 = Back
3. Choose mode:
   - 1 = Headed (visible browser)
   - 2 = Headless (faster)
   - 3 = Back
```

## Common Use Cases

### Development & Debugging
```bash
ts  # → Select test → Desktop only → Headed
```

### Quick Testing
```bash
th "tests/e2e/matches/vitalicios/reservaInterna/4.reservaGeneralesConValidacion.spec.ts"
```

### Mobile Testing
```bash
ts  # → Select test → Mobile only → Headed
```

### Cross-Platform Testing
```bash
ts  # → Select test → Both devices → Headless
```

## Troubleshooting

### Commands not found?
```bash
source ~/.zshrc
```

### Permission denied?
```bash
chmod +x test-selector.sh
```

### View test results?
```bash
npx playwright show-report
```

## Device Options

- **Desktop Chrome**: Full browser, larger screen
- **Mobile Safari**: Mobile viewport, touch interactions  
- **Both**: Sequential execution (Desktop → Mobile)
- **Both (continue)**: Sequential execution (Desktop → Mobile, even if Desktop fails)

## Mode Options

- **Headed**: Browser visible, slower, good for debugging
- **Headless**: No browser window, faster, good for automation

---

**Pro tip**: Use `ts` for maximum flexibility, `t`/`th` for quick execution! 🎯 