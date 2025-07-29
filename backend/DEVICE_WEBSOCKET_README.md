# Device Serial Reading WebSocket API

This document describes the new WebSocket functionality for reading serial output from Arduino devices.

## New WebSocket Endpoint

### `/devices/read/{device_number}`

**Purpose**: Read serial output from a specific Arduino device in real-time.

**Authentication**: Required (email/password)
**Authorization**: User must have booked the current time slot

## How It Works

1. **Device Management**: The backend maintains serial connections to connected Arduino devices
2. **Authentication Flow**: Users must authenticate and have a valid slot booking
3. **Real-time Updates**: Serial output is broadcast to all authenticated WebSocket connections
4. **Exclusive Access**: Only one process can access a serial port at a time

## Usage Example

### JavaScript Client

```javascript
const deviceNumber = 0; // First device
const ws = new WebSocket(`ws://localhost:8000/devices/read/${deviceNumber}`);

ws.onopen = () => {
    // Send authentication credentials
    ws.send(JSON.stringify({
        email: "user@example.com",
        password: "password123"
    }));
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    switch(data.type) {
        case 'error':
            console.error('Error:', data.message);
            break;
            
        case 'connection_established':
            console.log('Connected to device:', data.device_info);
            break;
            
        case 'serial_output':
            console.log('Device output:', data.output);
            break;
    }
};
```

### Python Client

```python
import asyncio
import websockets
import json

async def read_device_serial():
    uri = "ws://localhost:8000/devices/read/0"
    
    async with websockets.connect(uri) as websocket:
        # Authenticate
        await websocket.send(json.dumps({
            "email": "user@example.com",
            "password": "password123"
        }))
        
        # Listen for serial output
        async for message in websocket:
            data = json.loads(message)
            if data['type'] == 'serial_output':
                print(f"Device {data['device_number']}: {data['output']}")

asyncio.run(read_device_serial())
```

## Message Types

### Client → Server

```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

### Server → Client

#### Error Messages
```json
{
    "type": "error",
    "message": "Error description"
}
```

#### Connection Established
```json
{
    "type": "connection_established",
    "device_number": 0,
    "device_info": {
        "model": "uno",
        "port": "/dev/ttyUSB0",
        "description": "USB Serial"
    },
    "message": "Connected to device 0 (uno on /dev/ttyUSB0)"
}
```

#### Serial Output
```json
{
    "type": "serial_output",
    "device_number": 0,
    "output": "Hello from Arduino!\nLED ON\nLED OFF\n",
    "timestamp": "2025-07-29T12:34:56.789Z"
}
```

## Error Conditions

1. **Invalid Device**: Device number doesn't exist
2. **Authentication Failed**: Invalid email/password
3. **No Slot Booked**: User hasn't booked the current time slot
4. **Device Busy**: Serial port is in use by another process

## Integration with Code Upload

When code is uploaded to a device via `/devices/upload/{device_number}`:

1. Serial reading is **automatically stopped** (prevents port conflicts)
2. Device output is **reset to empty string**
3. New code execution starts fresh
4. Serial reading can be restarted via WebSocket connection

## Testing

Run the comprehensive test suite:

```bash
cd backend
python test_websocket_device.py
```

Or test manually:

```bash
cd backend
python test_websocket_client.py
```

## Arduino Code Example

Here's example Arduino code that works well with the serial reading:

```cpp
void setup() {
    Serial.begin(9600);
    pinMode(LED_BUILTIN, OUTPUT);
    Serial.println("Device started!");
    Serial.println("Running ReRo demo code");
}

void loop() {
    digitalWrite(LED_BUILTIN, HIGH);
    Serial.println("LED ON");
    delay(1000);
    
    digitalWrite(LED_BUILTIN, LOW);
    Serial.println("LED OFF");
    delay(1000);
    
    Serial.print("Free memory: ");
    Serial.println(freeMemory()); // If you have a memory function
}
```

## Security Features

- **Authentication Required**: All connections must authenticate
- **Slot Validation**: Users can only access devices during their booked slots
- **Automatic Cleanup**: Connections are properly closed on errors
- **Resource Management**: Serial ports are properly managed to prevent conflicts

## Performance Characteristics

- **Baud Rate**: 9600 (configurable)
- **Buffer Size**: Last 10,000 characters per device
- **Update Frequency**: Real-time (sub-second latency)
- **Concurrent Connections**: Multiple users can read from same device simultaneously
- **Memory Usage**: Bounded by buffer size and connection count
