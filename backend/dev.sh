#!/bin/bash

# Development script for the Slot Booking API

set -e

echo "🚀 Slot Booking API Development Helper"
echo "======================================"

# Function to show usage
show_usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  install     Install dependencies"
    echo "  dev         Start development server with auto-reload"
    echo "  start       Start production server"
    echo "  test        Run test client"
    echo "  check       Check code for errors"
    echo "  clean       Clean Python cache files"
    echo "  help        Show this help message"
    echo ""
}

# Install dependencies
install_deps() {
    echo "📦 Installing dependencies..."
    pip install -r requirements.txt
    echo "✅ Dependencies installed successfully!"
}

# Start development server
start_dev() {
    echo "🔄 Starting development server with auto-reload..."
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload --log-level info
}

# Start production server
start_prod() {
    echo "🚀 Starting production server..."
    python main.py
}

# Run test client
run_test() {
    echo "🧪 Running test client..."
    python test_client.py
}

# Check code
check_code() {
    echo "🔍 Checking code..."
    python -m py_compile *.py
    echo "✅ Code check completed!"
}

# Clean cache
clean_cache() {
    echo "🧹 Cleaning Python cache files..."
    find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
    find . -name "*.pyc" -delete 2>/dev/null || true
    echo "✅ Cache cleaned!"
}

# Main script logic
case "${1:-help}" in
    install)
        install_deps
        ;;
    dev)
        install_deps
        start_dev
        ;;
    start)
        start_prod
        ;;
    test)
        run_test
        ;;
    check)
        check_code
        ;;
    clean)
        clean_cache
        ;;
    help|*)
        show_usage
        ;;
esac
