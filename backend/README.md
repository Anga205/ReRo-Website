# Slot Booking API

A FastAPI-based WebSocket application for real-time slot booking with 1-hour time slots from 3 AM to 3 PM.

## Features

- **Real-time Updates**: WebSocket-based communication for instant slot updates
- **Modular Architecture**: Clean, functional code structure with separate modules
- **Duplicate Prevention**: Prevents double-booking of the same slot
- **Live Broadcasting**: All connected clients receive updates when slots are booked/cancelled
- **Health Monitoring**: Built-in health check and status endpoints

## Architecture

The application follows a modular, functional programming approach with the following structure:

```
backend/
├── main.py                 # Application entry point and WebSocket endpoint
├── config.py              # Configuration settings and constants
├── models.py              # Data models and response creators
├── state.py               # Global state management
├── slot_manager.py        # Slot business logic functions
├── websocket_manager.py   # WebSocket connection management
├── websocket_handlers.py  # WebSocket message processing
├── routes.py              # HTTP route handlers
├── requirements.txt       # Python dependencies
├── run_server.sh          # Server startup script
├── test_client.py         # WebSocket test client
└── README.md              # This documentation
```

## Installation

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the Server**:
   ```bash
   python main.py
   ```
   
   Or use the provided script:
   ```bash
   chmod +x run_server.sh
   ./run_server.sh
   ```

## API Endpoints

### HTTP Routes

#### `GET /`
**Description**: Root endpoint providing basic API information

**Response**:
```json
{
  "message": "Slot Booking API is running",
  "websocket_endpoint": "/slot-booking",
  "active_connections": 0,
  "booked_slots": []
}
```

#### `GET /health`
**Description**: Health check endpoint with system status

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-07-28T10:30:00.123456",
  "active_connections": 2,
  "total_slots": 12,
  "booked_slots_count": 3,
  "available_slots_count": 9
}
```

### WebSocket Endpoint

#### `WS /slot-booking`
**Description**: Main WebSocket endpoint for real-time slot booking

**Connection Flow**:
1. Client connects to WebSocket
2. Server automatically sends current slot status
3. Client can send booking/cancellation requests
4. Server broadcasts updates to all connected clients

## WebSocket Message Types

### Client → Server Messages

#### Book a Slot
```json
{
  "type": "book_slot",
  "slot_id": 9
}
```

#### Cancel a Slot
```json
{
  "type": "cancel_slot",
  "slot_id": 9
}
```

#### Get Current Slots
```json
{
  "type": "get_slots"
}
```

### Server → Client Messages

#### Initial Slots Data / Updates
```json
{
  "type": "slots_update",
  "data": {
    "slots": [
      {
        "id": 3,
        "start_time": "03:00",
        "end_time": "04:00",
        "is_booked": false
      },
      // ... more slots
    ],
    "available_slots": [3, 4, 5, 7, 8, 10, 11, 12, 13, 14],
    "booked_slots": [6, 9]
  },
  "timestamp": "2025-07-28T10:30:00.123456"
}
```

#### Booking Response
```json
{
  "type": "booking_response",
  "success": true,
  "message": "Slot 9 booked successfully",
  "slot_id": 9
}
```

#### Cancellation Response
```json
{
  "type": "cancellation_response",
  "success": true,
  "message": "Slot 9 booking cancelled successfully",
  "slot_id": 9
}
```

#### Error Response
```json
{
  "type": "error",
  "message": "Missing slot_id in booking request"
}
```

## Slot System

- **Time Range**: 3 AM to 3 PM (12 slots total)
- **Slot Duration**: 1 hour each
- **Slot IDs**: 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
- **Format**: 24-hour format (e.g., "09:00" to "10:00")

### Available Slots
| Slot ID | Time Range |
|---------|------------|
| 3       | 03:00-04:00 |
| 4       | 04:00-05:00 |
| 5       | 05:00-06:00 |
| 6       | 06:00-07:00 |
| 7       | 07:00-08:00 |
| 8       | 08:00-09:00 |
| 9       | 09:00-10:00 |
| 10      | 10:00-11:00 |
| 11      | 11:00-12:00 |
| 12      | 12:00-13:00 |
| 13      | 13:00-14:00 |
| 14      | 14:00-15:00 |

## Testing

### Using the Test Client

Run the included test client to simulate WebSocket interactions:

```bash
python test_client.py
```

This will:
1. Connect to the WebSocket
2. Receive initial slot data
3. Book a test slot (slot 9)
4. Request current slots
5. Listen for real-time broadcasts

### Manual Testing

You can test the API using any WebSocket client:

1. **Connect**: `ws://localhost:8000/slot-booking`
2. **Send messages**: Use the JSON message formats described above
3. **Monitor**: Watch for real-time updates when other clients make changes

## Configuration

### Environment Variables

The application can be configured through `config.py`:

- **SLOT_CONFIG**: Slot timing configuration
- **SERVER_CONFIG**: Server host, port, and logging settings
- **CORS_CONFIG**: Cross-origin resource sharing settings
- **API_CONFIG**: API metadata and documentation

### Default Settings

- **Host**: 0.0.0.0 (all interfaces)
- **Port**: 8000
- **Log Level**: INFO
- **CORS**: Enabled for all origins (development setting)

## Module Descriptions

### `config.py`
Contains all configuration settings, constants, and setup functions.

### `models.py`
Defines data models and response creators for consistent message formatting.

### `state.py`
Manages global application state including active connections and booked slots.

### `slot_manager.py`
Core business logic for slot operations: booking, cancelling, availability checking.

### `websocket_manager.py`
Handles WebSocket connection lifecycle and broadcasting functionality.

### `websocket_handlers.py`
Processes incoming WebSocket messages and coordinates responses.

### `routes.py`
HTTP route handlers for health checks and API information.

### `main.py`
Application entry point, FastAPI setup, and WebSocket endpoint definition.

## Error Handling

The application includes comprehensive error handling:

- **Invalid JSON**: Returns error message for malformed requests
- **Missing Parameters**: Validates required fields in requests
- **Connection Errors**: Gracefully handles disconnected clients
- **Booking Conflicts**: Prevents double-booking with clear error messages

## Development

### Code Style
- **Functional Programming**: No classes, pure functions only
- **Modular Design**: Small, focused functions with single responsibilities
- **Type Hints**: Full type annotations for better code clarity
- **Documentation**: Comprehensive docstrings for all functions

### Future Enhancements
- Database persistence for slot bookings
- User authentication and authorization
- Slot reservation with time limits
- Email notifications for bookings
- Admin interface for slot management

## Support

For issues or questions, please check the logs for detailed error information. The application uses structured logging to help with debugging.