#!/usr/bin/env python3
"""Simple WebSocket test for device serial reading."""

import asyncio
import websockets
import json
import signal
import sys

async def test_device_websocket():
    """Test connecting to device WebSocket endpoint."""
    
    device_number = 1  # Arduino Mega
    uri = f"ws://localhost:8000/devices/read/{device_number}"
    
    print(f"Connecting to {uri}...")
    
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected! Sending authentication...")
            
            # Send authentication
            auth_msg = {
                "email": "test@example.com",
                "password": "testpassword123"
            }
            await websocket.send(json.dumps(auth_msg))
            print("Authentication sent.")
            
            # Listen for messages for 10 seconds
            timeout_duration = 10
            print(f"Listening for messages for {timeout_duration} seconds...")
            
            try:
                while True:
                    try:
                        # Wait for message with timeout
                        message = await asyncio.wait_for(websocket.recv(), timeout=2.0)
                        data = json.loads(message)
                        
                        print(f"Received: {data['type']}")
                        if data['type'] == 'serial_output':
                            print(f"Serial data: {data.get('output', '')[:100]}...")
                        elif data['type'] == 'connection_established':
                            print(f"Connection established: {data.get('message', '')}")
                        elif data['type'] == 'error':
                            print(f"Error: {data.get('message', '')}")
                            break
                            
                    except asyncio.TimeoutError:
                        print("No message received in 2 seconds, continuing...")
                        continue
                        
            except KeyboardInterrupt:
                print("\nTest interrupted by user")
                
    except websockets.exceptions.ConnectionClosed:
        print("WebSocket connection closed")
    except Exception as e:
        print(f"Error: {e}")

def signal_handler(sig, frame):
    print('\nTest interrupted')
    sys.exit(0)

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)
    print("Starting WebSocket test...")
    print("Press Ctrl+C to stop")
    
    try:
        asyncio.run(test_device_websocket())
    except KeyboardInterrupt:
        print("\nTest stopped")
