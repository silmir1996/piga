#!/bin/bash

# Function to run tests on both desktop and mobile
test-both() {
    if [ -z "$1" ]; then
        echo "Usage: test-both <test-file-path>"
        echo "Examples:"
        echo "  test-both tests/e2e/matches/vitalicios/reservaInterna/4.reservaGeneralesConValidacion.spec.ts"
        echo "  test-both tests/e2e/matches/confirmacionFiltro/1.socioAdherenteNo.spec.ts"
        exit 1
    fi

    echo "🚀 Running test on Desktop Chrome..."
    npx playwright test "$1" --project="Desktop Chrome"
    
    if [ $? -eq 0 ]; then
        echo "✅ Desktop Chrome passed. Running on Mobile Safari..."
        npx playwright test "$1" --project="Mobile Safari"
    else
        echo "❌ Desktop Chrome failed. Skipping Mobile Safari."
        exit 1
    fi
}

# If script is called directly, run the function
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    test-both "$@"
fi 