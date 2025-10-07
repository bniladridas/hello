#!/bin/bash

# Master script to run all checks and builds
# This script runs linting, testing, building, and any other checks

set -e  # Exit on any error

clear
echo "🚀 Running all checks and builds..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules not found. Run 'npm install' first."
    exit 1
fi

# Run linting
echo "🔍 Running ESLint..."
npm run lint

# Run tests with coverage
echo "🧪 Running tests with coverage..."
npm run test:coverage

# Build the project
echo "🏗️ Building the project..."
npm run build

# Run preflight (which includes some of the above, but for completeness)
echo "✈️ Running preflight checks..."
npm run preflight

echo "✅ All checks and builds passed!"