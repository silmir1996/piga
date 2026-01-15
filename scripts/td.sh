#!/bin/bash

# Shortcut command: td = test desktop (headed)
# Usage: td [headed|headless] <test-file-path>
# Examples:
#   td headed tests/e2e/login/loginAgip.spec.ts
#   td tests/e2e/login/loginAgip.spec.ts  (defaults to headed)

mode="headed"
test_file=""

# Parse arguments
if [ "$1" == "headed" ] || [ "$1" == "headless" ]; then
    mode="$1"
    test_file="$2"
else
    test_file="$1"
fi

if [ -z "$test_file" ]; then
    echo "Usage: td [headed|headless] <test-file-path>"
    echo "Examples:"
    echo "  td headed tests/e2e/login/loginAgip.spec.ts"
    echo "  td tests/e2e/login/loginAgip.spec.ts  (defaults to headed)"
    exit 1
fi

if [ "$mode" == "headed" ]; then
    echo "🚀 Running test in headed mode: $test_file"
    npx playwright test "$test_file" --headed
else
    echo "🚀 Running test in headless mode: $test_file"
    npx playwright test "$test_file"
fi
