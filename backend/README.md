# ReRo Website Backend - Slot Booking API

A FastAPI-based WebSocket application for real-time slot booking with SQLite persistence, PESU authentication integration, and modular architecture. The system provides 1-hour time slots from 3 AM to 3 PM with user-specific booking management.

## 🔥 Key Features

- **🔐 PESU Authentication**: Secure user authentication using PESU credentials
- **⚡ Real-time Updates**: WebSocket-based communication for instant slot updates
- **💾 SQLite Database**: Persistent storage with user-specific booking tracking
- **🏗️ Modular Architecture**: Clean, organized code structure for maintainability
- **🚀 Performance Optimized**: In-memory authentication caching (30 minutes)
- **🔒 User-specific Bookings**: Each booking tied to user's SRN
- **📡 Live Broadcasting**: All connected clients receive real-time updates
- **📊 Health Monitoring**: Built-in health check and statistics endpoints
- **🛡️ Security**: Proper authentication and authorization for all operations

## 📁 Project Structure

The application follows a modular architecture with organized modules:

```
backend/
├── main.py                    # 🚀 Main FastAPI application (only file in root)
├── requirements.txt           # 📋 Python dependencies (updated)
├── ARCHITECTURE.md           # 📖 Detailed architecture documentation
├── venv/                     # 🐍 Virtual environment
├── data/                     # 💾 Database directory (auto-created)
│   └── rero.db              # SQLite database file
├── auth/                     # 🔐 Authentication module
│   ├── __init__.py
│   └── pesu_auth.py         # PESU API integration & caching
├── core/                     # ⚙️ Core application modules
│   ├── __init__.py
│   ├── config.py            # Configuration settings
│   ├── models.py            # Data models and Pydantic schemas
│   ├── slot_manager.py      # Slot management logic
│   └── state.py             # Global state management
├── database/                 # 💾 Database operations
│   ├── __init__.py
│   └── operations.py        # Database CRUD operations
├── routes/                   # 🛣️ HTTP route handlers
│   ├── __init__.py
│   ├── auth.py              # Authentication routes
│   └── main.py              # Main API routes
└── websocket/               # 🔌 WebSocket functionality
    ├── __init__.py
    ├── endpoints.py         # WebSocket endpoint definitions
    ├── handlers.py          # WebSocket message handlers
    └── manager.py           # WebSocket connection management
```

## 🔐 Authentication System

### PESU Integration
The system integrates with PESU's authentication API to validate user credentials. Users must provide their PESU username (SRN/PRN) and password to perform any booking operations.

### Authentication Caching
- Successful logins are cached in memory for **30 minutes**
- Reduces external API calls for better performance
- Automatic cleanup of expired cache entries
- Secure credential hashing for cache keys

### User-Specific Operations
- Each booking is tied to the user's SRN
- Users can only cancel their own bookings
- Personal booking history available via API

## 💾 Database Schema

The application uses SQLite with the following enhanced table structure:

### `slots` Table
```sql
CREATE TABLE slots (
    id INTEGER PRIMARY KEY,           -- Slot ID (3-14 for 3AM-3PM)
    start_time TEXT NOT NULL,         -- Start time (e.g., "09:00")
    end_time TEXT NOT NULL,           -- End time (e.g., "10:00")
    is_booked BOOLEAN DEFAULT FALSE,  -- Booking status
    booked_by TEXT DEFAULT NULL,      -- 🆕 User's SRN who booked the slot
    booked_at DATETIME DEFAULT NULL,  -- When the slot was booked
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Key Database Features
- **User Tracking**: Each booking records the user's SRN
- **Automatic Migration**: Existing databases are automatically updated
- **Data Integrity**: Database constraints prevent conflicts
- **Audit Trail**: Booking timestamps for tracking

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Internet connection (for PESU API authentication)

### Quick Start

1. **Clone and Navigate**:
   ```bash
   cd backend
   ```

2. **Create Virtual Environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the Server**:
   ```bash
   python main.py
   ```

The database will be automatically created and initialized on first run.

### Dependencies
- `fastapi==0.104.1` - Modern web framework
- `uvicorn==0.24.0` - ASGI server
- `httpx==0.25.2` - HTTP client for PESU API
- `pydantic==2.5.0` - Data validation
- `websockets==12.0` - WebSocket support
- `python-json-logger==2.0.7` - Structured logging

## 🛣️ API Endpoints

### Authentication Routes

#### `POST /auth/login`
**Description**: Authenticate PESU users and get profile information

**Request Body**:
```json
{
  "username": "PES1234567890",
  "password": "your_password"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "name": "John Doe",
    "srn": "PES1234567890",
    "prn": "PES1234567890",
    "program": "Bachelor of Technology",
    "branch": "Computer Science and Engineering",
    "campus": "RR"
  }
}
```

**Error Response** (401):
```json
{
  "detail": "Invalid credentials"
}
```

### Main API Routes

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
      "booked_by": null,
      "booked_at": null
    }
    // ... more slots
  ],
  "available_slots": [3, 4, 5, 7, 8, 10, 11, 12, 13, 14],
  "booked_slots": [6, 9]
}
```

#### `POST /book-slot`
**Description**: Book a slot with authentication

**Request Body**:
```json
{
  "slot_id": 5,
  "username": "PES1234567890",
  "password": "your_password"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Slot 5 booked successfully",
  "slot_id": 5
}
```

**Error Response** (401/400):
```json
{
  "detail": "Invalid credentials" // or "Slot 5 is not available"
}
```

#### `POST /cancel-slot`
**Description**: Cancel a slot booking (only your own bookings)

**Request Body**:
```json
{
  "slot_id": 5,
  "username": "PES1234567890",
  "password": "your_password"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Slot 5 booking cancelled successfully",
  "slot_id": 5
}
```

#### `POST /my-bookings`
**Description**: Get all bookings for the authenticated user

**Request Body**:
```json
{
  "username": "PES1234567890",
  "password": "your_password"
}
```

**Response**:
```json
{
  "success": true,
  "bookings": [
    {
      "id": 5,
      "start_time": "05:00",
      "end_time": "06:00",
      "booked_at": "2025-07-28 10:15:30"
    }
  ],
  "total_bookings": 1
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

### 🔌 WebSocket Endpoint

#### `WS /slot-booking`
**Description**: Main WebSocket endpoint for real-time slot booking with authentication

**Connection Flow**:
1. Client connects to WebSocket
2. Server automatically sends current slot status from database
3. Client can send booking/cancellation requests with credentials
4. Server validates authentication before processing
5. Server updates database and broadcasts changes to all connected clients

## 📡 WebSocket Message Protocol

### Client → Server Messages

#### Book a Slot
```json
{
  "type": "book_slot",
  "slot_id": 9,
  "username": "PES1234567890",
  "password": "your_password"
}
```

#### Cancel a Slot
```json
{
  "type": "cancel_slot",
  "slot_id": 9,
  "username": "PES1234567890",
  "password": "your_password"
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
        "booked_by": null,
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

#### Authentication Error Response
```json
{
  "type": "booking_response",
  "success": false,
  "message": "Authentication failed. Invalid credentials.",
  "slot_id": 9
}
```

#### General Error Response
```json
{
  "type": "error",
  "message": "Missing slot_id, username, or password in booking request"
}
```

## ⏰ Slot System

- **Time Range**: 3 AM to 3 PM (12 slots total)
- **Slot Duration**: 1 hour each
- **Slot IDs**: 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
- **Format**: 24-hour format (e.g., "09:00" to "10:00")
- **Persistence**: All bookings stored in SQLite with user tracking
- **User Management**: Each booking tied to specific user's SRN

### Available Time Slots
| Slot ID | Time Range | Example Usage |
|---------|------------|---------------|
| 3       | 03:00-04:00 | Early morning |
| 4       | 04:00-05:00 | Early morning |
| 5       | 05:00-06:00 | Dawn |
| 6       | 06:00-07:00 | Early morning |
| 7       | 07:00-08:00 | Morning |
| 8       | 08:00-09:00 | Morning |
| 9       | 09:00-10:00 | Mid-morning |
| 10      | 10:00-11:00 | Late morning |
| 11      | 11:00-12:00 | Late morning |
| 12      | 12:00-13:00 | Noon |
| 13      | 13:00-14:00 | Afternoon |
| 14      | 14:00-15:00 | Afternoon |

## 🔧 Configuration & Environment

### Configuration Options

The application can be configured through `core/config.py`:

- **SLOT_CONFIG**: Slot timing and duration settings
- **SERVER_CONFIG**: Server host, port, and logging settings  
- **CORS_CONFIG**: Cross-origin resource sharing settings
- **API_CONFIG**: API metadata and documentation

### Environment Variables (Optional)

```bash
# Override PESU authentication URL (default: uses official PESU API)
export PESU_AUTH_URL="https://pesu-auth.onrender.com/authenticate"

# Override authentication cache duration (default: 30 minutes)
export CACHE_DURATION_MINUTES=30

# Server configuration
export HOST="0.0.0.0"
export PORT=8000
export LOG_LEVEL="info"
```

### Default Settings

- **Host**: 0.0.0.0 (all interfaces)
- **Port**: 8000
- **Log Level**: INFO
- **CORS**: Enabled for all origins (development setting)
- **Database**: SQLite with automatic initialization
- **Cache Duration**: 30 minutes for authentication
- **PESU API**: Official PESU authentication endpoint

## 💾 Database Management

### Automatic Initialization
- Database directory (`data/`) is created automatically if it doesn't exist
- Database file (`data/rero.db`) is created on first run
- Slots table is initialized with all 12 time slots
- If database exists, existing data is preserved and loaded
- **Migration Support**: Existing databases automatically get the new `booked_by` column

### Data Persistence
- All slot bookings are immediately saved to SQLite
- User SRN is recorded with each booking
- Booking timestamps are recorded for audit trails
- Database transactions ensure data consistency
- No data loss on server restart
- User-specific booking retrieval and management

### User Data Handling
- **Privacy First**: Only SRN is stored in database, no other personal data
- **Authentication Cache**: User profiles cached in memory for 30 minutes only
- **Secure Storage**: No passwords or sensitive data persisted
- **GDPR Compliant**: Minimal data storage approach

## 🧪 Testing & Development

### Quick Testing with cURL

#### Test Authentication
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"YOUR_SRN","password":"YOUR_PASSWORD"}'
```

#### Test Slot Booking
```bash
curl -X POST http://localhost:8000/book-slot \
  -H "Content-Type: application/json" \
  -d '{"slot_id":9,"username":"YOUR_SRN","password":"YOUR_PASSWORD"}'
```

#### Check Your Bookings
```bash
curl -X POST http://localhost:8000/my-bookings \
  -H "Content-Type: application/json" \
  -d '{"username":"YOUR_SRN","password":"YOUR_PASSWORD"}'
```

### WebSocket Testing

You can test WebSocket functionality using any WebSocket client:

1. **Connect**: `ws://localhost:8000/slot-booking`
2. **Send authentication-enabled messages**: Use the JSON formats described above
3. **Monitor**: Watch for real-time updates when other clients make changes
4. **Persistence**: Restart the server and verify bookings are preserved

### Development Tools

#### Virtual Environment Management
```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Deactivate when done
deactivate
```

#### Development Server (Auto-reload)
```bash
# Install uvicorn with reload capability
pip install "uvicorn[standard]"

# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Database Inspection
```bash
# Install SQLite browser (optional)
sudo apt install sqlitebrowser  # Ubuntu/Debian

# Or use command line
sqlite3 data/rero.db
.tables
.schema slots
SELECT * FROM slots WHERE is_booked = 1;
```

## 📚 Module Documentation

### 🚀 `main.py`
**Purpose**: Application entry point and FastAPI setup
- FastAPI application initialization
- Middleware configuration (CORS)
- Router registration (auth + main routes)
- WebSocket endpoint registration
- Database initialization on startup

### 🔐 `auth/pesu_auth.py`
**Purpose**: PESU authentication integration
- `PESUAuthService`: Main authentication service class
- In-memory credential caching with expiration
- External PESU API integration
- Secure credential validation
- Automatic cache cleanup

### ⚙️ `core/` Module

#### `config.py`
- Application configuration settings
- Environment variable handling
- Logging configuration
- CORS, server, and API settings

#### `models.py`
- Pydantic data models for request/response validation
- WebSocket message creators
- Response formatting functions
- Type definitions

#### `slot_manager.py`
- Core slot booking business logic
- Slot availability checking
- Booking and cancellation operations
- Slot summary generation

#### `state.py`
- Global application state management
- WebSocket connection tracking
- In-memory state for real-time updates

### 💾 `database/operations.py`
**Purpose**: Database operations and management
- SQLite connection management
- Database initialization and migration
- CRUD operations for slots
- User-specific booking queries
- Database statistics and health checks

### 🛣️ `routes/` Module

#### `auth.py`
- Authentication endpoint (`/auth/login`)
- User credential validation
- Profile information retrieval
- Error handling for auth failures

#### `main.py`
- Main API endpoints (health, stats, slots)
- HTTP booking and cancellation endpoints
- User booking history endpoint
- System statistics and monitoring

### 🔌 `websocket/` Module

#### `endpoints.py`
- WebSocket endpoint definition
- Connection lifecycle management
- Initial data transmission
- Error handling for WebSocket connections

#### `handlers.py`
- WebSocket message processing
- Authentication validation for WS messages
- Booking/cancellation logic
- Real-time update broadcasting

#### `manager.py`
- WebSocket connection pool management
- Broadcasting to all connected clients
- Connection addition/removal
- Disconnection cleanup

## 🛡️ Security Features

### Authentication Security
- **No Password Storage**: Passwords never stored, only validated via PESU API
- **Session Management**: 30-minute in-memory cache with automatic expiration
- **Secure Hashing**: Credential cache keys use SHA-256 hashing
- **API Rate Limiting**: Cached authentication reduces external API calls

### Data Privacy
- **Minimal Data**: Only SRN stored with bookings
- **No PII in Database**: Personal information never persisted
- **Memory-Only Cache**: User profiles cached in memory only
- **Automatic Cleanup**: Expired cache entries automatically removed

### Network Security
- **CORS Configuration**: Configurable cross-origin policies
- **Input Validation**: Pydantic models validate all inputs
- **Error Handling**: Proper error messages without data leakage
- **HTTPS Ready**: Can be deployed with SSL/TLS termination

## ⚡ Performance Optimizations

### Caching Strategy
- **Authentication Cache**: 30-minute user session cache
- **Database Connections**: Efficient SQLite connection management
- **Memory Management**: Automatic cleanup of expired sessions
- **Broadcast Optimization**: Efficient WebSocket message broadcasting

### Scalability Features
- **Modular Architecture**: Easy to scale individual components
- **Database Optimization**: Indexed queries for fast lookups
- **Connection Pooling**: WebSocket connection management
- **Stateless Design**: Each request is independent (except cache)

## 🔍 Error Handling

### Comprehensive Error Management
- **Database Errors**: Graceful SQLite connection issue handling
- **Authentication Errors**: Clear error messages for auth failures
- **WebSocket Errors**: Proper disconnection and cleanup
- **API Errors**: HTTP status codes with descriptive messages
- **Validation Errors**: Pydantic validation with clear error details

### Logging Strategy
- **Structured Logging**: JSON-formatted logs for easy parsing
- **Log Levels**: DEBUG, INFO, WARNING, ERROR levels
- **Authentication Logging**: Secure logging without credential exposure
- **Performance Logging**: Connection and operation timing
- **Error Tracking**: Detailed error context for debugging

## 📊 Monitoring & Health Checks

### Built-in Monitoring
- **Health Endpoint**: `/health` for system status
- **Statistics Endpoint**: `/stats` for detailed metrics
- **Database Stats**: Real-time database statistics
- **Connection Monitoring**: Active WebSocket connection tracking
- **Performance Metrics**: Response times and operation counts

### Production Monitoring
```bash
# Health check
curl http://localhost:8000/health

# System statistics
curl http://localhost:8000/stats

# Check database status
curl http://localhost:8000/slots
```

## 🚀 Deployment

### Production Deployment

#### Using Uvicorn (Recommended)
```bash
# Install production dependencies
pip install uvicorn[standard] gunicorn

# Run with Uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

# Or with Gunicorn + Uvicorn workers
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

#### Docker Deployment
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Environment Variables for Production
```bash
# Security
export PESU_AUTH_URL="https://pesu-auth.onrender.com/authenticate"
export CACHE_DURATION_MINUTES=30

# Server
export HOST="0.0.0.0"
export PORT=8000
export WORKERS=4

# Database
export DATABASE_PATH="/app/data/rero.db"

# Logging
export LOG_LEVEL="info"
```

### Reverse Proxy Configuration

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /slot-booking {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔄 Backup & Recovery

### Database Backup Strategy
```bash
# Create timestamped backup
cp data/rero.db "data/backup_$(date +%Y%m%d_%H%M%S).db"

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
cp data/rero.db "$BACKUP_DIR/rero_backup_$DATE.db"
find $BACKUP_DIR -name "rero_backup_*.db" -mtime +7 -delete  # Keep 7 days
```

### Database Recovery
```bash
# Stop the server first
# Restore from backup
cp data/backup_YYYYMMDD_HHMMSS.db data/rero.db
# Restart the server
```

### Data Migration
```bash
# Export data to JSON
sqlite3 data/rero.db "SELECT json_object('id', id, 'start_time', start_time, 'end_time', end_time, 'is_booked', is_booked, 'booked_by', booked_by, 'booked_at', booked_at) FROM slots;" > slots_export.json

# Reset database (will auto-recreate)
rm data/rero.db
python main.py  # Restart to recreate
```

## 🛠️ Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 8000
sudo lsof -i :8000
sudo netstat -tlnp | grep :8000

# Kill process if needed
sudo kill -9 <PID>
```

#### Database Permission Issues
```bash
# Fix permissions
chmod 755 data/
chmod 644 data/rero.db

# Ensure directory exists
mkdir -p data
```

#### PESU API Connection Issues
```bash
# Test PESU API connectivity
curl -X POST https://pesu-auth.onrender.com/authenticate \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'

# Check DNS resolution
nslookup pesu-auth.onrender.com
```

#### Memory Issues (High Load)
```bash
# Monitor memory usage
ps aux | grep python
htop

# Clear authentication cache manually (restart server)
# Or reduce CACHE_DURATION_MINUTES
```

### Debug Mode
```bash
# Run with debug logging
export LOG_LEVEL="debug"
python main.py

# Or with uvicorn debug
uvicorn main:app --reload --log-level debug
```

### Log Analysis
```bash
# Filter authentication logs
grep "authentication" logs/app.log

# Filter booking operations
grep "booking\|cancellation" logs/app.log

# Monitor real-time logs
tail -f logs/app.log
```

## 📈 Future Enhancements

### Planned Features
- [ ] **Email Notifications**: Booking confirmations via email
- [ ] **Admin Dashboard**: Web-based administration interface
- [ ] **Slot Reservations**: Time-limited reservations before booking
- [ ] **Recurring Bookings**: Weekly/monthly booking patterns
- [ ] **Booking Limits**: Per-user booking restrictions
- [ ] **API Rate Limiting**: Request throttling for abuse prevention
- [ ] **Audit Logging**: Comprehensive audit trail
- [ ] **Multi-tenant Support**: Multiple organizations/campuses
- [ ] **Mobile App Integration**: REST API for mobile apps
- [ ] **Advanced Analytics**: Booking patterns and usage statistics

### Performance Improvements
- [ ] **Redis Caching**: External cache for authentication
- [ ] **Database Optimization**: PostgreSQL for production
- [ ] **CDN Integration**: Static asset optimization
- [ ] **Load Balancing**: Multiple server instances
- [ ] **Connection Pooling**: Advanced database connection management

### Security Enhancements
- [ ] **JWT Tokens**: Stateless authentication tokens
- [ ] **Role-based Access**: Admin/user role separation
- [ ] **IP Whitelisting**: Network-level access control
- [ ] **Encryption**: Database encryption at rest
- [ ] **Security Headers**: HTTP security headers implementation

## 🆘 Support & Contributing

### Getting Help
1. **Documentation**: Check this README and ARCHITECTURE.md
2. **Logs**: Review application logs for error details
3. **Health Check**: Use `/health` endpoint to verify system status
4. **Database**: Inspect SQLite database for data integrity

### Development Guidelines
- **Code Style**: Follow PEP 8 Python style guidelines
- **Type Hints**: Include type annotations for all functions
- **Documentation**: Update docstrings for new functions
- **Testing**: Test all authentication flows
- **Security**: Never log passwords or sensitive data

### Contribution Process
1. Fork the repository
2. Create feature branch
3. Implement changes with tests
4. Update documentation
5. Submit pull request with clear description

---

## 📋 Quick Reference

### Essential Commands
```bash
# Setup
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# Run
python main.py

# Test
curl http://localhost:8000/health

# WebSocket Test
wscat -c ws://localhost:8000/slot-booking
```

### Key URLs
- **API Documentation**: `http://localhost:8000/docs` (Swagger UI)
- **Health Check**: `http://localhost:8000/health`
- **WebSocket**: `ws://localhost:8000/slot-booking`
- **Login**: `POST http://localhost:8000/auth/login`

### Important Files
- `main.py` - Application entry point
- `data/rero.db` - SQLite database
- `auth/pesu_auth.py` - Authentication service
- `requirements.txt` - Dependencies
- `ARCHITECTURE.md` - Detailed architecture docs

**The ReRo Website Backend is now production-ready with comprehensive authentication, user management, and a scalable modular architecture! 🚀**