# Slot Booking API

A FastAPI-based WebSocket application for real-time slot booking with SQLite persistence and 1-hour time slots from 3 AM to 3 PM.

## Features

- **Real-time Updates**: WebSocket-based communication for instant slot updates
- **SQLite Database**: Persistent storage with automatic initialization
- **Modular Architecture**: Clean, functional code structure with separate modules
- **Duplicate Prevention**: Database-level constraints prevent double-booking
- **Live Broadcasting**: All connected clients receive updates when slots are booked/cancelled
- **Health Monitoring**: Built-in health check and status endpoints
- **Statistics**: Detailed database and connection statistics

## Architecture

The application follows a modular, functional programming approach with the following structure:

```
backend/
├── main.py                   # Application entry point and initialization
├── config.py                # Configuration settings and constants
├── models.py                # Data models and response creators
├── database.py              # SQLite database management
├── slot_manager.py          # Slot business logic functions
├── websocket_manager.py     # WebSocket connection management
├── websocket_endpoints.py   # WebSocket endpoint definitions
├── websocket_handlers.py    # WebSocket message processing
├── routes.py                # HTTP route handlers
├── requirements.txt         # Python dependencies
├── dev.sh                   # Development helper script
├── run_server.sh            # Server startup script
├── test_client.py           # WebSocket test client
├── data/                    # Database directory (auto-created)
│   └── rero.db             # SQLite database file
└── README.md               # This documentation
```

## Database Schema

The application uses SQLite with the following table structure:

### `slots` Table
```sql
CREATE TABLE slots (
    id INTEGER PRIMARY KEY,           -- Slot ID (3-14 for 3AM-3PM)
    start_time TEXT NOT NULL,         -- Start time (e.g., "09:00")
    end_time TEXT NOT NULL,           -- End time (e.g., "10:00")
    is_booked BOOLEAN DEFAULT FALSE,  -- Booking status
    booked_at DATETIME DEFAULT NULL,  -- When the slot was booked
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
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
   
   Or use the development script:
   ```bash
   chmod +x dev.sh
   ./dev.sh dev  # Development mode with auto-reload
   ./dev.sh start  # Production mode
   ```

The database (`data/rero.db`) will be automatically created and initialized on first run.

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
**Description**: Health check endpoint with system status and database info

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-07-28T10:30:00.123456",
  "active_connections": 2,
  "total_slots": 12,
  "booked_slots_count": 3,
  "available_slots_count": 9,
  "database": {
    "total_slots": 12,
    "booked_slots": 3,
    "available_slots": 9,
    "database_path": "data/rero.db"
  }
}
```

#### `GET /slots`
**Description**: Get all slots with their current status

**Response**:
```json
{
  "slots": [
    {
      "id": 3,
      "start_time": "03:00",
      "end_time": "04:00",
      "is_booked": false,
      "booked_at": null
    }
    // ... more slots
  ],
  "available_slots": [3, 4, 5, 7, 8, 10, 11, 12, 13, 14],
  "booked_slots": [6, 9]
}
```

#### `GET /stats`
**Description**: Get detailed system statistics

**Response**:
```json
{
  "database": {
    "total_slots": 12,
    "booked_slots": 3,
    "available_slots": 9,
    "database_path": "data/rero.db"
  },
  "websocket": {
    "active_connections": 2
  },
  "slots": {
    "total": 12,
    "booked": 3,
    "available": 9
  }
}
```

### WebSocket Endpoint

#### `WS /slot-booking`
**Description**: Main WebSocket endpoint for real-time slot booking

**Connection Flow**:
1. Client connects to WebSocket
2. Server automatically sends current slot status from database
3. Client can send booking/cancellation requests
4. Server updates database and broadcasts changes to all connected clients

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
        "is_booked": false,
        "booked_at": null
      }
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
- **Persistence**: All bookings are stored in SQLite database

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

## Database Management

### Automatic Initialization
- Database directory (`data/`) is created automatically if it doesn't exist
- Database file (`data/rero.db`) is created on first run
- Slots table is initialized with all 12 time slots
- If database exists, existing data is preserved and loaded

### Data Persistence
- All slot bookings are immediately saved to SQLite
- Booking timestamps are recorded
- Database transactions ensure data consistency
- No data loss on server restart

## Testing

### Using the Test Client

Run the included test client to simulate WebSocket interactions:

```bash
python test_client.py
```

This will:
1. Connect to the WebSocket
2. Receive initial slot data from database
3. Book a test slot (slot 9)
4. Request current slots
5. Listen for real-time broadcasts

### Development Helper

Use the development script for various tasks:

```bash
./dev.sh install    # Install dependencies
./dev.sh dev        # Start with auto-reload
./dev.sh start      # Start production server
./dev.sh test       # Run test client
./dev.sh check      # Check code syntax
./dev.sh clean      # Clean Python cache
```

### Manual Testing

You can test the API using any WebSocket client:

1. **Connect**: `ws://localhost:8000/slot-booking`
2. **Send messages**: Use the JSON message formats described above
3. **Monitor**: Watch for real-time updates when other clients make changes
4. **Persistence**: Restart the server and verify bookings are preserved

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
- **Database**: SQLite with automatic initialization

## Module Descriptions

### `main.py`
Application entry point with FastAPI setup and database initialization.

### `config.py`
Contains all configuration settings, constants, and setup functions.

### `models.py`
Defines data models and response creators for consistent message formatting.

### `database.py`
Handles SQLite database operations, initialization, and slot management.

### `slot_manager.py`
Core business logic for slot operations using database persistence.

### `websocket_manager.py`
Handles WebSocket connection lifecycle and broadcasting functionality.

### `websocket_endpoints.py`
WebSocket endpoint definitions separated from main application.

### `websocket_handlers.py`
Processes incoming WebSocket messages and coordinates responses.

### `routes.py`
HTTP route handlers for health checks, statistics, and API information.

## Error Handling

The application includes comprehensive error handling:

- **Database Errors**: Graceful handling of SQLite connection issues
- **Invalid JSON**: Returns error message for malformed requests
- **Missing Parameters**: Validates required fields in requests
- **Connection Errors**: Gracefully handles disconnected clients
- **Booking Conflicts**: Database constraints prevent double-booking
- **Transaction Safety**: All database operations are properly committed

## Performance Considerations

- **SQLite Performance**: Fast local database operations
- **Connection Pooling**: Efficient database connection management
- **Memory Usage**: Active connections stored in memory for real-time updates
- **Broadcast Efficiency**: Optimized message broadcasting to all clients

## Development

### Code Style
- **Functional Programming**: No classes, pure functions only
- **Modular Design**: Small, focused functions with single responsibilities
- **Type Hints**: Full type annotations for better code clarity
- **Documentation**: Comprehensive docstrings for all functions
- **Database Isolation**: Clean separation between business logic and data access

### Future Enhancements
- **User Authentication**: Add user accounts and session management
- **Slot Reservations**: Time-limited reservations before booking
- **Email Notifications**: Automatic booking confirmations
- **Admin Interface**: Web-based administration panel
- **Database Migration**: Support for schema updates
- **Backup System**: Automated database backups
- **Rate Limiting**: Prevent spam booking attempts
- **Audit Logging**: Track all booking/cancellation events

## Backup and Recovery

### Database Backup
```bash
# Create backup
cp data/rero.db data/rero_backup_$(date +%Y%m%d_%H%M%S).db

# Restore from backup
cp data/rero_backup_YYYYMMDD_HHMMSS.db data/rero.db
```

### Reset Database
```bash
# Remove database to reset all bookings
rm data/rero.db
# Restart server to reinitialize
python main.py
```

## Support

For issues or questions:
1. Check the logs for detailed error information
2. Verify database file permissions and disk space
3. Ensure SQLite is available (included with Python)
4. Review the comprehensive error messages in the application logs

The application uses structured logging to help with debugging and monitoring.