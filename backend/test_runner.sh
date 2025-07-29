#!/bin/bash

# Test script for the ReRo WebSocket device functionality

echo "=== ReRo Device WebSocket Test Script ==="
echo

# Check if Python virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

echo
echo "=== Starting Backend Server ==="
echo "The server will start on http://localhost:8000"
echo "WebSocket endpoint will be available at ws://localhost:8000/devices/read/{device_number}"
echo
echo "Press Ctrl+C to stop the server and run tests..."
echo

# Start the server
python main.py &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Function to cleanup
cleanup() {
    echo
    echo "Stopping server..."
    kill $SERVER_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on exit
trap cleanup INT TERM

# Wait for user to stop server
echo "Server is running. Press Ctrl+C to stop and run tests..."
wait $SERVER_PID

# Run tests after server stops
echo
echo "=== Running Tests ==="
python test_websocket_device.py

echo
echo "=== Test Manual Client (Optional) ==="
echo "You can also run: python test_websocket_client.py"
echo "Make sure to start the server first in another terminal."
