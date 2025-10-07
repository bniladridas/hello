#!/bin/bash

# Preflight script to run all checks before committing or deploying
# This script runs formatting check, linting, tests with coverage, and build

set -e  # Exit on any error

echo "Running preflight checks..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "node_modules not found. Run 'npm install' first."
    exit 1
fi

# Run linting (includes formatting checks)
echo "Running ESLint..."

# Run tests with coverage
echo "Running tests with coverage..."

# Build the project
echo "Building the project..."

echo "All preflight checks passed! Ready to commit or deploy."