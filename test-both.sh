#!/bin/bash

# Wrapper to call the real script in scripts/
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

exec "$SCRIPT_DIR/scripts/test-both.sh" "$@"


