#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: ./test-both.sh <test-file-path>"
    echo "Example: ./test-both.sh tests/e2e/matches/vitalicios/reservaInterna/4.reservaGeneralesConValidacion.spec.ts"
    exit 1
fi

echo "Running test on Desktop Chrome..."
npx playwright test "$1" --project="Desktop Chrome"

if [ $? -eq 0 ]; then
    echo "Desktop Chrome test passed. Running on Mobile Safari..."
    npx playwright test "$1" --project="Mobile Safari"
else
    echo "Desktop Chrome test failed. Skipping Mobile Safari."
    exit 1
fi 