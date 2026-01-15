# PowerShell script for Windows: td = test desktop (headed)
# Usage: td [headed|headless] <test-file-path>
# Examples:
#   td headed tests/e2e/login/loginAgip.spec.ts
#   td tests/e2e/login/loginAgip.spec.ts  (defaults to headed)

param(
    [Parameter(Position=0)]
    [string]$ModeOrFile,
    
    [Parameter(Position=1)]
    [string]$TestFile
)

$mode = "headed"
$file = ""

# Parse arguments
if ($ModeOrFile -eq "headed" -or $ModeOrFile -eq "headless") {
    $mode = $ModeOrFile
    $file = $TestFile
} else {
    $file = $ModeOrFile
}

if ([string]::IsNullOrEmpty($file)) {
    Write-Host "Usage: td [headed|headless] <test-file-path>"
    Write-Host "Examples:"
    Write-Host "  td headed tests/e2e/login/loginAgip.spec.ts"
    Write-Host "  td tests/e2e/login/loginAgip.spec.ts  (defaults to headed)"
    exit 1
}

if ($mode -eq "headed") {
    Write-Host "🚀 Running test in headed mode: $file"
    npx playwright test $file --headed
} else {
    Write-Host "🚀 Running test in headless mode: $file"
    npx playwright test $file
}
