#!/usr/bin/env python3

import asyncio
import websockets
import json

async def test_device_websocket():
    uri = "ws://localhost:8000/devices/read/1"  # Device 1 (Arduino Mega)
    
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected to WebSocket")
            
            # Send authentication
            auth_message = {
                "email": "test@example.com",
                "password": "testpassword123"
            }
            await websocket.send(json.dumps(auth_message))
            print("Sent authentication")
            
            # Listen for messages
            async for message in websocket:
                data = json.loads(message)
                print(f"Received: {data}")
                
                if data.get("type") == "error":
                    print(f"Error: {data.get('message')}")
                    break
                elif data.get("type") == "connection_established":
                    print(f"Connected to: {data.get('message')}")
                elif data.get("type") == "serial_output":
                    print(f"Serial: {data.get('output', '').strip()}")
                    
    except Exception as e:
        print(f"WebSocket error: {e}")

if __name__ == "__main__":
    asyncio.run(test_device_websocket())
