# ReRo Website Backend - Slot Booking API

A FastAPI-based WebSocket application for real-time slot booking with SQLite persistence, local user authentication, and modular architecture. The system provides 1-hour time slots covering a full 24-hour day (00:00-23:59) with email-based user management and secure password hashing.

## 🔥 Key Features

- **🔐 Local Authentication**: Secure user registration and login with bcrypt password hashing
- **⚡ Real-time Updates**: WebSocket-based communication for instant slot updates
- **💾 SQLite Database**: Persistent storage with email-based user management
- **🏗️ Modular Architecture**: Clean, organized code structure for maintainability
- **🚀 Performance Optimized**: Efficient database operations and connection management
- **🔒 Email-based Bookings**: Each booking tied to user's email address
- **📡 Live Broadcasting**: All connected clients receive real-time updates
- **📊 Health Monitoring**: Built-in health check and statistics endpoints
- **🛡️ Security**: bcrypt password hashing and secure authentication for all operations
- **👤 User Registration**: Self-service account creation with email/password

## 📁 Project Structure

The application follows a modular architecture with organized modules:

```
backend/
├── main.py                    # 🚀 Main FastAPI application (only file in root)
├── requirements.txt           # 📋 Python dependencies (includes bcrypt)
├── LOCAL_AUTH_SUMMARY.md     # 📖 Local authentication system documentation
├── venv/                     # 🐍 Virtual environment
├── data/                     # 💾 Database directory (auto-created)
│   └── rero.db              # SQLite database file
├── auth/                     # 🔐 Authentication module
│   ├── __init__.py
│   └── local_auth.py        # Local authentication service with bcrypt
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
│   ├── auth.py              # Authentication routes (register/login)
│   └── main.py              # Main API routes
└── websocket/               # 🔌 WebSocket functionality
    ├── __init__.py
    ├── endpoints.py         # WebSocket endpoint definitions
    ├── handlers.py          # WebSocket message handlers
    └── manager.py           # WebSocket connection management
```

## 🔐 Authentication System

### Local User Management
The system uses a local SQLite database to manage user accounts with secure password hashing. Users must register with an email and password to access booking functionality.

### Security Features
- **bcrypt Password Hashing**: All passwords are securely hashed using bcrypt with salt
- **Email-based Authentication**: Users authenticate with email/password credentials
- **User Registration**: Self-service account creation with duplicate email prevention
- **Secure Validation**: Password verification using bcrypt's secure comparison
- **No Plain-text Storage**: Passwords are never stored in plain text

### User Account Management
- Each user account is tied to a unique email address
- Users can only cancel their own bookings
- Personal booking history available via API
- Account registration prevents duplicate email addresses

## 💾 Database Schema

The application uses SQLite with the following table structure:

### `users` Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,           -- User's email address (unique)
    password_hash TEXT NOT NULL,          -- bcrypt hashed password
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### `slots` Table
```sql
CREATE TABLE slots (
    id INTEGER PRIMARY KEY,               -- Slot ID (3-14 for 3AM-3PM)
    start_time TEXT NOT NULL,             -- Start time (e.g., "09:00")
    end_time TEXT NOT NULL,               -- End time (e.g., "10:00")
    is_booked BOOLEAN DEFAULT FALSE,      -- Booking status
    booked_by TEXT DEFAULT NULL,          -- User's email who booked the slot
    booked_at DATETIME DEFAULT NULL,      -- When the slot was booked
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Key Database Features
- **Email-based User Management**: Unique email addresses for each user
- **Secure Password Storage**: bcrypt hashed passwords with salt
- **User Tracking**: Each booking records the user's email
- **Automatic Migration**: Existing databases are automatically updated
- **Data Integrity**: Database constraints prevent conflicts
- **Audit Trail**: User creation and booking timestamps

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Internet connection (for package installation)

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
- `httpx==0.25.2` - HTTP client for API calls
- `pydantic==2.5.0` - Data validation
- `websockets==12.0` - WebSocket support
- `python-json-logger==2.0.7` - Structured logging
- `bcrypt==4.0.1` - Secure password hashing

## 🛣️ API Endpoints

### Authentication Routes

#### `POST /auth/register`
**Description**: Register a new user account with email and password

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "email": "user@example.com",
    "created_at": "2025-01-28T10:30:00.123456"
  }
}
```

**Error Response** (400):
```json
{
  "detail": "User with this email already exists"
}
```

#### `POST /auth/login`
**Description**: Authenticate users with email and password

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "email": "user@example.com"
  }
}
```

**Error Response** (401):
```json
{
  "detail": "Invalid email or password"
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
**Description**: Book a slot with email/password authentication

**Request Body**:
```json
{
  "slot_id": 5,
  "email": "user@example.com",
  "password": "securepassword123"
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
  "detail": "Invalid email or password" // or "Slot 5 is not available"
}
```

#### `POST /cancel-slot`
**Description**: Cancel a slot booking (only your own bookings)

**Request Body**:
```json
{
  "slot_id": 5,
  "email": "user@example.com",
  "password": "securepassword123"
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
  "email": "user@example.com",
  "password": "securepassword123"
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
      "booked_at": "2025-01-28 10:15:30"
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
**Description**: Main WebSocket endpoint for real-time slot booking with email/password authentication

**Connection Flow**:
1. Client connects to WebSocket
2. Server automatically sends current slot status from database
3. Client can send booking/cancellation requests with email/password credentials
4. Server validates authentication before processing
5. Server updates database and broadcasts changes to all connected clients

## 📡 WebSocket Message Protocol

### Client → Server Messages

#### Book a Slot
```json
{
  "type": "book_slot",
  "slot_id": 9,
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### Cancel a Slot
```json
{
  "type": "cancel_slot",
  "slot_id": 9,
  "email": "user@example.com",
  "password": "securepassword123"
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
  "message": "Authentication failed. Invalid email or password.",
  "slot_id": 9
}
```

#### General Error Response
```json
{
  "type": "error",
  "message": "Missing slot_id, email, or password in booking request"
}
```

## ⏰ Slot System

- **Time Range**: 24-hour coverage (00:00 - 23:59) - (24 slots total)
- **Slot Duration**: 1 hour each
- **Slot IDs**: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
- **Format**: 24-hour format (e.g., "09:00" to "10:00", "23:00" to "00:00")
- **Persistence**: All bookings stored in SQLite with email tracking
- **User Management**: Each booking tied to specific user's email address

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
# Server configuration
export HOST="0.0.0.0"
export PORT=8000
export LOG_LEVEL="info"

# Database configuration
export DATABASE_PATH="data/rero.db"
```

### Default Settings

- **Host**: 0.0.0.0 (all interfaces)
- **Port**: 8000
- **Log Level**: INFO
- **CORS**: Enabled for all origins (development setting)
- **Database**: SQLite with automatic initialization
- **Password Hashing**: bcrypt with automatic salt generation

## 💾 Database Management

### Automatic Initialization
- Database directory (`data/`) is created automatically if it doesn't exist
- Database file (`data/rero.db`) is created on first run
- Users and slots tables are initialized automatically
- If database exists, existing data is preserved and loaded
- **Migration Support**: Existing databases automatically get the new user management system

### Data Persistence
- All user accounts and slot bookings are immediately saved to SQLite
- User email addresses are recorded with each booking
- Password hashes are securely stored using bcrypt
- Booking timestamps are recorded for audit trails
- Database transactions ensure data consistency
- No data loss on server restart
- Email-based booking retrieval and management

### User Data Handling
- **Privacy First**: Only email addresses and hashed passwords stored
- **Secure Passwords**: bcrypt hashing with automatic salt generation
- **No Plain-text**: Passwords never stored in readable format
- **GDPR Compliant**: Minimal data storage approach with secure practices

## 🧪 Testing & Development

### Quick Testing with cURL

#### Test User Registration
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

#### Test Authentication
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

#### Test Slot Booking
```bash
curl -X POST http://localhost:8000/book-slot \
  -H "Content-Type: application/json" \
  -d '{"slot_id":9,"email":"test@example.com","password":"testpass123"}'
```

#### Check Your Bookings
```bash
curl -X POST http://localhost:8000/my-bookings \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
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

### 🔐 `auth/local_auth.py`
**Purpose**: Local user authentication service
- `LocalAuthService`: Main authentication service class
- User registration with duplicate email prevention
- Secure password hashing using bcrypt
- Password verification and user authentication
- Email-based user validation

### ⚙️ `core/` Module

#### `config.py`
- Application configuration settings
- Environment variable handling
- Logging configuration
- CORS, server, and API settings

#### `models.py`
- Pydantic data models for request/response validation
- User registration and login models
- WebSocket message creators
- Response formatting functions
- Type definitions for email-based authentication

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
- User account creation and management
- CRUD operations for slots with email-based tracking
- User-specific booking queries
- Database statistics and health checks

### 🛣️ `routes/` Module

#### `auth.py`
- User registration endpoint (`/auth/register`)
- User authentication endpoint (`/auth/login`)
- Local database user validation
- bcrypt password verification
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
- Email/password authentication validation for WS messages
- Booking/cancellation logic with email tracking
- Real-time update broadcasting

#### `manager.py`
- WebSocket connection pool management
- Broadcasting to all connected clients
- Connection addition/removal
- Disconnection cleanup

## 🛡️ Security Features

### Password Security
- **bcrypt Hashing**: All passwords are hashed using bcrypt with automatic salt generation
- **No Plain-text Storage**: Passwords are never stored in readable format
- **Secure Verification**: Password verification uses bcrypt's secure comparison function
- **Salt Generation**: Each password gets a unique salt for maximum security

### User Account Security
- **Email Uniqueness**: Prevents duplicate accounts with the same email
- **Input Validation**: Email format and password strength validation
- **Secure Registration**: User creation with proper error handling
- **Authentication Logging**: Secure logging without credential exposure

### Data Privacy
- **Minimal Data**: Only email addresses and hashed passwords stored
- **Local Storage**: All user data stays in the local SQLite database
- **No External Dependencies**: No third-party authentication services
- **GDPR Compliant**: Minimal personal data collection and storage

## ⚡ Performance Optimizations

### Database Optimization
- **Efficient SQLite Operations**: Optimized queries for user and slot management
- **Connection Management**: Proper database connection handling
- **Indexed Queries**: Email-based lookups for fast user authentication
- **Transaction Management**: Consistent database operations

### Security Performance
- **bcrypt Optimization**: Secure password hashing with reasonable performance
- **Email Validation**: Fast email format validation
- **User Lookup**: Efficient email-based user retrieval
- **Session Handling**: Stateless authentication per request

### Scalability Features
- **Modular Architecture**: Easy to scale individual components
- **Local Database**: No external API dependencies for better reliability
- **Connection Pooling**: WebSocket connection management
- **Efficient Broadcasting**: Optimized real-time message distribution

## 🔍 Error Handling

### Comprehensive Error Management
- **Database Errors**: Graceful SQLite connection issue handling
- **Authentication Errors**: Clear error messages for registration and login failures
- **User Registration**: Proper handling of duplicate email attempts
- **WebSocket Errors**: Proper disconnection and cleanup
- **API Errors**: HTTP status codes with descriptive messages
- **Validation Errors**: Pydantic validation with clear error details

### Logging Strategy
- **Structured Logging**: JSON-formatted logs for easy parsing
- **Log Levels**: DEBUG, INFO, WARNING, ERROR levels
- **Security Logging**: Authentication events without password exposure
- **Performance Logging**: Connection and operation timing
- **Error Tracking**: Detailed error context for debugging
- **User Activity**: Registration and login activity tracking

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
# Server
export HOST="0.0.0.0"
export PORT=8000
export WORKERS=4

# Database
export DATABASE_PATH="/app/data/rero.db"

# Logging
export LOG_LEVEL="info"

# Security (optional)
export BCRYPT_ROUNDS=12  # Higher for more security, lower for performance
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

#### User Registration Issues
```bash
# Test user registration
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'

# Check if user already exists
grep "email" data/rero.db  # or use SQLite browser
```

#### Authentication Issues
```bash
# Test login endpoint
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'

# Check user table
sqlite3 data/rero.db "SELECT * FROM users;"
```

#### Password Issues
- Ensure passwords meet minimum requirements (6+ characters)
- Check for proper bcrypt installation: `pip list | grep bcrypt`
- Verify password hashing in logs (without exposing actual passwords)

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
grep "authentication\|registration\|login" logs/app.log

# Filter booking operations
grep "booking\|cancellation" logs/app.log

# Monitor user activity
grep "user" logs/app.log

# Monitor real-time logs
tail -f logs/app.log
```

## 📈 Future Enhancements

### Planned Features
- [ ] **JWT Tokens**: Stateless authentication with token-based sessions
- [ ] **Password Reset**: Email-based password recovery system
- [ ] **Email Verification**: Confirm email addresses during registration
- [ ] **Account Management**: Update email/password endpoints
- [ ] **Admin Dashboard**: Web-based administration interface
- [ ] **Slot Reservations**: Time-limited reservations before booking
- [ ] **Recurring Bookings**: Weekly/monthly booking patterns
- [ ] **Booking Limits**: Per-user booking restrictions
- [ ] **API Rate Limiting**: Request throttling for abuse prevention
- [ ] **Audit Logging**: Comprehensive audit trail
- [ ] **Multi-tenant Support**: Multiple organizations/campuses
- [ ] **Mobile App Integration**: Enhanced REST API for mobile apps
- [ ] **Advanced Analytics**: Booking patterns and usage statistics

### Authentication Improvements
- [ ] **Two-Factor Authentication**: SMS/email-based 2FA
- [ ] **OAuth Integration**: Google/GitHub OAuth support
- [ ] **Session Management**: Persistent login sessions
- [ ] **Account Lockout**: Brute force protection
- [ ] **Password Strength**: Enhanced password requirements
- [ ] **User Roles**: Admin/user role-based permissions

### Performance Improvements
- [ ] **Redis Caching**: External cache for session management
- [ ] **Database Optimization**: PostgreSQL for production scaling
- [ ] **CDN Integration**: Static asset optimization
- [ ] **Load Balancing**: Multiple server instances
- [ ] **Connection Pooling**: Advanced database connection management
- [ ] **Password Hashing Optimization**: Adaptive bcrypt work factors

### Security Enhancements
- [ ] **Enhanced Encryption**: Database encryption at rest
- [ ] **Security Headers**: HTTP security headers implementation
- [ ] **Input Sanitization**: Advanced input validation and sanitization
- [ ] **CSRF Protection**: Cross-site request forgery protection
- [ ] **Rate Limiting**: Per-user and per-IP rate limiting
- [ ] **Security Auditing**: Regular security assessment and monitoring

## 🆘 Support & Contributing

### Getting Help
1. **Documentation**: Check this README and LOCAL_AUTH_SUMMARY.md
2. **Logs**: Review application logs for error details
3. **Health Check**: Use `/health` endpoint to verify system status
4. **Database**: Inspect SQLite database for data integrity
5. **Authentication Testing**: Use test endpoints to verify user registration/login

### Development Guidelines
- **Code Style**: Follow PEP 8 Python style guidelines
- **Type Hints**: Include type annotations for all functions
- **Documentation**: Update docstrings for new functions
- **Security**: Never log passwords or sensitive data
- **Testing**: Test all authentication and booking flows
- **Password Security**: Always use bcrypt for password hashing

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

# Test User Registration
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'

# Test Authentication
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'

# Health Check
curl http://localhost:8000/health

# WebSocket Test
wscat -c ws://localhost:8000/slot-booking
```

### Key URLs
- **API Documentation**: `http://localhost:8000/docs` (Swagger UI)
- **Health Check**: `http://localhost:8000/health`
- **WebSocket**: `ws://localhost:8000/slot-booking`
- **User Registration**: `POST http://localhost:8000/auth/register`
- **User Login**: `POST http://localhost:8000/auth/login`

### Important Files
- `main.py` - Application entry point
- `data/rero.db` - SQLite database (users + slots)
- `auth/local_auth.py` - Local authentication service
- `requirements.txt` - Dependencies (includes bcrypt)
- `LOCAL_AUTH_SUMMARY.md` - Local authentication documentation

**The ReRo Website Backend is now production-ready with secure local authentication, user registration, and comprehensive email-based user management! 🚀🔐**

## 🔑 JWT Authentication (Updated)

- Login now returns a JWT: `POST /auth/login -> { success, message, token, user }`.
- Send `Authorization: Bearer <token>` on protected HTTP routes: `/book-slot`, `/cancel-slot`, `/my-bookings`, `/slots/user`, and `/devices/upload/{device_number}`.
- WebSockets accept JWT in messages for booking/cancel and device serial auth: include `{ "token": "<JWT>" }` instead of email/password.
- Environment variables:
  - `JWT_SECRET_KEY` (set this in production)
  - `JWT_ALGORITHM` (default: HS256)
  - `JWT_EXPIRE_MINUTES` (default: 60)
