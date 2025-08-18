#!/bin/bash

# Function to run tests on both desktop and mobile
test-both() {
    mode="$1"
    test_file="$2"

    # If first arg is not a recognized mode, treat it as the test file
    if [[ "$mode" != "headed" && "$mode" != "headless" ]]; then
        test_file="$mode"
        mode="headed"  # Default to headed mode for 't' command
    fi

    if [ -z "$test_file" ]; then
        echo "Usage: test-both [headless|headed] <test-file-path>"
        echo "Examples:"
        echo "  test-both headless tests/e2e/matches/vitalicios/reservaInterna/4.reservaGeneralesConValidacion.spec.ts"
        echo "  test-both headed tests/e2e/matches/confirmacionFiltro/1.socioAdherenteNo.spec.ts"
        exit 1
    fi

    extra_flags=""
    if [[ "$mode" == "headed" ]]; then
        export MCP_HEADLESS=false
        extra_flags="--headed"
    else
        # Force headless regardless of ambient env
        export MCP_HEADLESS=true
    fi

    echo "🚀 Running ($mode) on Desktop Chrome..."
    MCP_HEADLESS="$MCP_HEADLESS" npx playwright test "$test_file" --project="Desktop Chrome" $extra_flags
    desktop_status=$?
    
    if [ $desktop_status -eq 0 ]; then
        echo "✅ Desktop Chrome passed. Running on Mobile Safari..."
        MCP_HEADLESS="$MCP_HEADLESS" npx playwright test "$test_file" --project="Mobile Safari" $extra_flags
    else
        echo "❌ Desktop Chrome failed. Skipping Mobile Safari."
        exit $desktop_status
    fi
}

# If script is called directly, run the function
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    test-both "$@"
fi