"""Simple WebSocket client for testing device serial communication."""

import asyncio
import websockets
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_device_websocket():
    """Test device WebSocket connection manually."""
    
    # Configuration
    device_number = 0  # Change this to test different devices
    uri = f"ws://localhost:8000/devices/read/{device_number}"
    
    # Test credentials (change these to your test user)
    credentials = {
        "email": "testuser@example.com",
        "password": "testpassword123"
    }
    
    try:
        print(f"Connecting to {uri}...")
        async with websockets.connect(uri) as websocket:
            print("Connected! Sending authentication...")
            
            # Send authentication
            await websocket.send(json.dumps(credentials))
            
            print("Waiting for responses...")
            
            # Listen for messages
            while True:
                try:
                    message = await asyncio.wait_for(websocket.recv(), timeout=1.0)
                    data = json.loads(message)
                    
                    print(f"Received: {data['type']}")
                    
                    if data['type'] == 'error':
                        print(f"Error: {data['message']}")
                        break
                    elif data['type'] == 'connection_established':
                        print(f"Success: {data['message']}")
                        print("Listening for serial output...")
                    elif data['type'] == 'serial_output':
                        print(f"Serial output from device {data['device_number']}:")
                        print(data['output'])
                        
                except asyncio.TimeoutError:
                    # No message received, continue listening
                    continue
                except websockets.exceptions.ConnectionClosed:
                    print("Connection closed by server")
                    break
                    
    except Exception as e:
        print(f"Error: {e}")

async def test_invalid_device():
    """Test connection to invalid device."""
    uri = "ws://localhost:8000/devices/read/999"
    
    try:
        print(f"Testing invalid device at {uri}...")
        async with websockets.connect(uri) as websocket:
            # Should get error immediately
            message = await websocket.recv()
            data = json.loads(message)
            print(f"Response: {data}")
            
    except Exception as e:
        print(f"Error: {e}")

async def main():
    """Main function to run tests."""
    print("=== Device WebSocket Test Client ===")
    print("1. Testing invalid device...")
    await test_invalid_device()
    
    print("\n2. Testing valid device connection...")
    await test_device_websocket()

if __name__ == "__main__":
    asyncio.run(main())
