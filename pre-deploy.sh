#!/bin/bash

# pre-deploy.sh - Local validation script before pushing to GitHub
# Inspired by RzLabs best practices

set -e

echo "🚀 Starting pre-deployment checks..."

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Error: Bun is not installed."
    exit 1
fi

echo "📦 Installing dependencies..."
bun install --silent

echo "🔍 Running Type Check..."
if ! bun run typecheck; then
    echo "❌ Type check failed. Please fix the errors above before deploying."
    exit 1
fi

echo "🧪 Running Tests..."
if ! bun run test; then
    echo "❌ Tests failed. Please fix the failing tests before deploying."
    exit 1
fi

echo "🏗️ Checking Build..."
if ! bun run build; then
    echo "❌ Build failed. Please check the build output."
    exit 1
fi

echo ""
echo "✅ All checks passed! You are ready to deploy."
echo ""
echo "To trigger a new release, follow these steps:"
echo "1. Update version in package.json (if needed)"
echo "2. git add ."
echo "3. git commit -m 'Release vX.X.X'"
echo "4. git tag vX.X.X"
echo "5. git push origin main --tags"
echo ""
echo "Happy hacking! - RzLabs"
