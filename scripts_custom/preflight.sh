#!/bin/bash

# Preflight script to run all checks before committing or deploying
# This script runs formatting check, linting, tests with coverage, and build

set -e  # Exit on any error

echo "
 ____            _ _ _     _____ _               _
|  _ \ ___ _ __ | (_) |__ |  ___| | _____      __| | ___ _ __
| |_) / _ \ '_ \| | | '_ \| |_  | |/ _ \ \ /\ / /| |/ _ \ '__|
|  __/  __/ |_) | | | |_) |  _| | | (_) \ V  V / | |  __/ |
|_|   \___| .__/|_|_|_.__/|_|   |_|\___/ \_/\_/  |_|\___|_|
          |_|
"
echo "Running preflight checks..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "node_modules not found. Run 'npm install' first."
    exit 1
fi

# Run linting (includes formatting checks)
echo "Running ESLint..."
npm run lint

# Run tests with coverage
echo "Running tests with coverage..."
npm run test:coverage

# Build the project
echo "Building the project..."
npm run build

echo "All preflight checks passed! Ready to commit or deploy."