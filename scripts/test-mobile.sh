#!/bin/bash

# Function to run tests on mobile only
test-mobile() {
    if [ -z "$1" ]; then
        echo "Usage: test-mobile <test-file-path>"
        echo "Examples:"
        echo "  test-mobile tests/e2e/matches/vitalicios/reservaInterna/4.reservaGeneralesConValidacion.spec.ts"
        echo "  test-mobile tests/e2e/matches/confirmacionFiltro/1.socioAdherenteNo.spec.ts"
        echo ""
        echo "Or run all mobile tests:"
        echo "  test-mobile"
        exit 1
    fi

    echo "📱 Running test on Mobile Safari..."
    npx playwright test "$1" --project="Mobile Safari"
}

# If no arguments provided, run all mobile tests
if [ $# -eq 0 ]; then
    echo "📱 Running all tests on Mobile Safari..."
    npx playwright test --project="Mobile Safari"
else
    test-mobile "$@"
fi
