@echo off
REM Batch script for Windows: td = test desktop (headed)
REM Usage: td.bat [headed|headless] <test-file-path>
REM Examples:
REM   td.bat headed tests/e2e/login/loginAgip.spec.ts
REM   td.bat tests/e2e/login/loginAgip.spec.ts  (defaults to headed)

setlocal

set "mode=headed"
set "test_file="

REM Parse arguments
if "%1"=="headed" (
    set "mode=headed"
    set "test_file=%2"
) else if "%1"=="headless" (
    set "mode=headless"
    set "test_file=%2"
) else (
    set "test_file=%1"
)

if "%test_file%"=="" (
    echo Usage: td.bat [headed^|headless] ^<test-file-path^>
    echo Examples:
    echo   td.bat headed tests/e2e/login/loginAgip.spec.ts
    echo   td.bat tests/e2e/login/loginAgip.spec.ts  (defaults to headed)
    exit /b 1
)

if "%mode%"=="headed" (
    echo 🚀 Running test in headed mode: %test_file%
    npx playwright test "%test_file%" --headed
) else (
    echo 🚀 Running test in headless mode: %test_file%
    npx playwright test "%test_file%"
)
