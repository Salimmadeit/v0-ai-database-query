#!/bin/bash

# QueryLens Installation Script
# This script sets up the development environment for QueryLens

set -e  # Exit on error

echo "🚀 QueryLens Installation"
echo "=========================="
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed."
    echo "📦 Installing pnpm globally..."
    npm install -g pnpm@9.15.4
    echo "✅ pnpm installed successfully!"
else
    echo "✅ pnpm is already installed: $(pnpm --version)"
fi

echo ""
echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "⚙️  Setting up environment variables..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
    echo "⚠️  Please update .env.local with your Kinde credentials"
else
    echo "ℹ️  .env.local already exists, skipping..."
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your Kinde Auth credentials"
echo "   - Visit https://kinde.com to create an account"
echo "   - See KINDE_SETUP.md for detailed instructions"
echo ""
echo "2. Start the development server:"
echo "   pnpm dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For more information, see:"
echo "   - README.md for project overview"
echo "   - KINDE_SETUP.md for authentication setup"
echo ""
