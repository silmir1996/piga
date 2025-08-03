#!/bin/bash

# Function to find all test files
find_test_files() {
    find tests/e2e -name "*.spec.ts" | sort
}

# Function to run selected test on desktop only
run_test_desktop() {
    local test_file="$1"
    local mode="$2"
    echo "🚀 Running: $test_file"
    echo "🖥️  Desktop Chrome ($mode)..."
    if [[ "$mode" == "headed" ]]; then
        npx playwright test "$test_file" --project="Desktop Chrome" --headed
    else
        npx playwright test "$test_file" --project="Desktop Chrome"
    fi
}

# Function to run selected test on mobile only
run_test_mobile() {
    local test_file="$1"
    local mode="$2"
    echo "🚀 Running: $test_file"
    echo "📱 Mobile Safari ($mode)..."
    if [[ "$mode" == "headed" ]]; then
        npx playwright test "$test_file" --project="Mobile Safari" --headed
    else
        npx playwright test "$test_file" --project="Mobile Safari"
    fi
}

# Function to run selected test on both devices
run_test_both() {
    local test_file="$1"
    local mode="$2"
    echo "🚀 Running: $test_file"
    echo "🖥️  Desktop Chrome ($mode)..."
    if [[ "$mode" == "headed" ]]; then
        npx playwright test "$test_file" --project="Desktop Chrome" --headed
    else
        npx playwright test "$test_file" --project="Desktop Chrome"
    fi
    
    if [ $? -eq 0 ]; then
        echo "📱 Mobile Safari ($mode)..."
        if [[ "$mode" == "headed" ]]; then
            npx playwright test "$test_file" --project="Mobile Safari" --headed
        else
            npx playwright test "$test_file" --project="Mobile Safari"
        fi
    else
        echo "❌ Desktop failed, skipping mobile"
        exit 1
    fi
}

# Function to run selected test on both devices (continue even if desktop fails)
run_test_both_continue() {
    local test_file="$1"
    local mode="$2"
    echo "🚀 Running: $test_file"
    echo "🖥️  Desktop Chrome ($mode)..."
    if [[ "$mode" == "headed" ]]; then
        npx playwright test "$test_file" --project="Desktop Chrome" --headed
    else
        npx playwright test "$test_file" --project="Desktop Chrome"
    fi
    
    local desktop_exit_code=$?
    
    echo "📱 Mobile Safari ($mode)..."
    if [[ "$mode" == "headed" ]]; then
        npx playwright test "$test_file" --project="Mobile Safari" --headed
    else
        npx playwright test "$test_file" --project="Mobile Safari"
    fi
    
    local mobile_exit_code=$?
    
    # Show summary of results
    echo ""
    echo "📊 Test Results Summary:"
    if [ $desktop_exit_code -eq 0 ]; then
        echo "✅ Desktop Chrome: PASSED"
    else
        echo "❌ Desktop Chrome: FAILED"
    fi
    
    if [ $mobile_exit_code -eq 0 ]; then
        echo "✅ Mobile Safari: PASSED"
    else
        echo "❌ Mobile Safari: FAILED"
    fi
    
    # Exit with error if both failed, success if at least one passed
    if [ $desktop_exit_code -ne 0 ] && [ $mobile_exit_code -ne 0 ]; then
        echo "❌ Both tests failed"
        exit 1
    else
        echo "✅ At least one test passed"
        exit 0
    fi
}

# Function to select mode (headed/headless)
select_mode() {
    local test_file="$1"
    local device_choice="$2"
    echo ""
    echo "🎯 Select execution mode:"
    echo "1. 👁️  Headed (browser visible)"
    echo "2. 🚀 Headless (faster, no browser window)"
    echo "3. ↩️  Back to device selection"
    echo ""
    echo "Enter your choice (1-3):"
    read -r mode_choice
    
    case $mode_choice in
        1)
            case $device_choice in
                1)
                    run_test_desktop "$test_file" "headed"
                    ;;
                2)
                    run_test_mobile "$test_file" "headed"
                    ;;
                3)
                    run_test_both "$test_file" "headed"
                    ;;
                4)
                    run_test_both_continue "$test_file" "headed"
                    ;;
            esac
            ;;
        2)
            case $device_choice in
                1)
                    run_test_desktop "$test_file" "headless"
                    ;;
                2)
                    run_test_mobile "$test_file" "headless"
                    ;;
                3)
                    run_test_both "$test_file" "headless"
                    ;;
                4)
                    run_test_both_continue "$test_file" "headless"
                    ;;
            esac
            ;;
        3)
            select_device "$test_file"
            ;;
        *)
            echo "❌ Invalid choice. Please try again."
            select_mode "$test_file" "$device_choice"
            ;;
    esac
}

# Function to select device
select_device() {
    local test_file="$1"
    echo ""
    echo "📱 Select device to run the test on:"
    echo "1. 🖥️  Desktop Chrome only"
    echo "2. 📱 Mobile Safari only"
    echo "3. 🔄 Both devices (Desktop + Mobile)"
    echo "4. 🔄 Both devices (Desktop + Mobile, continue even if desktop fails)"
    echo "5. ↩️  Back to test selection"
    echo ""
    echo "Enter your choice (1-5):"
    read -r device_choice
    
    case $device_choice in
        1|2|3|4)
            select_mode "$test_file" "$device_choice"
            ;;
        5)
            select_test_file
            ;;
        *)
            echo "❌ Invalid choice. Please try again."
            select_device "$test_file"
            ;;
    esac
}

# Interactive file selector
select_test_file() {
    echo "🔍 Available test files:"
    echo ""
    
    # Create array of test files (zsh compatible)
    test_files=($(find_test_files))
    
    # Show numbered list
    for i in "${!test_files[@]}"; do
        echo "$((i+1)). ${test_files[$i]}"
    done
    
    echo ""
    echo "Enter the number of the test file to run (or 'q' to quit):"
    read -r selection
    
    if [[ "$selection" == "q" ]]; then
        echo "👋 Goodbye!"
        exit 0
    fi
    
    # Validate selection
    if [[ "$selection" =~ ^[0-9]+$ ]] && [ "$selection" -ge 1 ] && [ "$selection" -le "${#test_files[@]}" ]; then
        local selected_file="${test_files[$((selection-1))]}"
        select_device "$selected_file"
    else
        echo "❌ Invalid selection. Please try again."
        select_test_file
    fi
}

# Main execution
if [ -z "$1" ]; then
    select_test_file
else
    # If file is provided as argument, ask for device selection
    select_device "$1"
fi 