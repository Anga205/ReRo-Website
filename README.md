# ReRo Website - Modular Slot Booking System with Arduino Device Management

A comprehensive, full-stack web application for real-time slot booking with integrated Arduino device management. Features a modular React frontend with dark mode, real-time WebSocket updates, and a FastAPI backend with Arduino code compilation and upload capabilities.

## 🔥 Key Features

### 🎨 Frontend Features
- **� Dark Mode Theme**: Professional dark UI with Material-UI and Tailwind CSS
- **🏗️ Modular Architecture**: 16+ reusable components across auth, booking, and home modules
- **⚡ Real-time WebSocket**: Instant slot updates across all connected clients
- **📱 Responsive Design**: Mobile-first design that works on all screen sizes
- **🔐 Authentication Flow**: Complete login/register with form validation and error handling
- **🎯 Color-coded Slots**: Visual indicators (🟢 Available, 🔴 Booked, 🔵 Your booking)
- **🔄 Live Connection Status**: Real-time WebSocket connection indicators
- **📊 Interactive Slot Grid**: 24 time slots (24-hour coverage) with one-click booking/cancellation
- **🎭 Smooth Animations**: Material-UI transitions and loading states
- **� Client-side Routing**: React Router for SPA navigation
- **⚡ Hot Reload**: Vite development server with instant updates
- **🧪 TypeScript**: Full type safety across all components

### ⚙️ Backend Features
- **🔌 Arduino Device Management**: Full hardware integration with 10+ supported device types
- **� Real-time Serial Reading**: Live WebSocket streams for Arduino serial output monitoring
- **�🚀 FastAPI Framework**: Modern async Python API with automatic OpenAPI docs
- **🔐 Local Authentication**: bcrypt password hashing with secure user management
- **💾 SQLite Database**: Persistent storage with automatic schema management
- **🌐 Dual WebSocket System**: Slot booking + device serial communication endpoints
- **🛡️ Security**: Slot-based authorization, input validation, and SQL injection protection
- **📊 Device Detection**: Automatic Arduino Uno, Mega, and ESP32 recognition
- **⚡ Code Compilation**: arduino-cli integration for multi-board compilation
- **� Secure Code Upload**: Authentication + slot validation for device programming
- **🔄 Serial Port Management**: Exclusive access handling for upload/read operations
- **�📁 File Management**: Automatic temporary file cleanup and project management
- **📈 Health Monitoring**: System statistics and connection monitoring
- **🎯 Thread-Safe Operations**: Concurrent serial reading with broadcast messaging
- **🔄 CORS Support**: Cross-origin resource sharing for frontend-backend communication
- **📝 Comprehensive Logging**: Structured logging with different levels across all modules

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Material-UI** + **Tailwind CSS**
- **Vite** build tool
- **WebSocket** for real-time updates

### Backend
- **FastAPI** with Python 3.8+
- **SQLite** database
- **WebSocket** support (dual endpoints)
- **PySerial** for Arduino communication
- **arduino-cli** for device management
- **bcrypt** for password security
- **Threading** for concurrent operations

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** (for frontend)
- **Python 3.8+** (for backend)
- **arduino-cli** (for device management)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ReRo-Website
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   ```

4. **Install Arduino CLI** (for device management):
   ```bash
   # Linux/macOS
   curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh
   
   # Or download from: https://arduino.github.io/arduino-cli/
   ```

### Running the Application

1. **Start Backend**:
   ```bash
   cd backend
   python main.py
   # Server runs on http://localhost:8000
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   # App runs on http://localhost:5173
   ```

## 🏗️ Architecture Overview

### 🎨 Frontend Architecture & Components

The frontend features a completely modular React architecture with 16+ specialized components:

```
frontend/src/
├── pages/                  # Main page components (4 pages)
│   ├── Home.tsx           # Landing page with hero and features
│   ├── SlotBooking.tsx    # Main booking interface
│   ├── Login.tsx          # User authentication
│   └── Register.tsx       # User registration
├── components/             # Modular component library (16+ components)
│   ├── auth/              # Authentication UI components (6 components)
│   │   ├── LoginHeader.tsx     # Login page branding
│   │   ├── LoginForm.tsx       # Login form with validation
│   │   ├── LoginFooter.tsx     # Login page footer/links
│   │   ├── RegisterHeader.tsx  # Registration page branding
│   │   ├── RegisterForm.tsx    # Registration form with validation
│   │   └── RegisterFooter.tsx  # Registration page footer/links
│   ├── booking/           # Slot booking components (5 components)
│   │   ├── AppHeader.tsx       # Navigation bar with user info
│   │   ├── BookingHeader.tsx   # Booking page title and info
│   │   ├── SlotCard.tsx        # Individual slot component with actions
│   │   ├── SlotsGrid.tsx       # 12-slot grid layout manager
│   │   └── StatusAlerts.tsx    # Connection and error status displays
│   ├── home/              # Home page components (3 components)
│   │   ├── HeroSection.tsx     # Main landing banner
│   │   ├── FeaturesSection.tsx # Feature highlights grid
│   │   └── TimeSlotsInfo.tsx   # Available time slots information
│   └── index.ts           # Centralized component exports
├── contexts/              # React Context providers
│   ├── AuthContext.tsx    # User authentication state management
│   └── StateContext.tsx   # Global application state
├── shared/                # Shared utilities and types
│   └── types.tsx          # TypeScript type definitions
└── assets/                # Static assets and images
    └── ieeeras.png        # Organization logo
```

#### 🎨 Frontend Technology Features
- **Material-UI Components**: AppBar, Container, Grid, Card, Button, TextField, Alert
- **Tailwind CSS Classes**: Custom styling with utility-first approach
- **React 19**: Latest React with concurrent features and automatic batching
- **TypeScript**: Full type safety with interfaces for props and state
- **React Router v6**: Modern client-side routing with lazy loading
- **WebSocket Integration**: Real-time communication with automatic reconnection
- **Context API**: Global state management for authentication and app state
- **Responsive Grid**: CSS Grid and Flexbox for mobile-first design
- **Form Validation**: Real-time input validation with error feedback
- **Dark Theme**: Comprehensive dark mode with custom color palette

### ⚙️ Backend Architecture & Modules

The backend follows a clean, modular FastAPI architecture with 10+ specialized modules:

```
backend/
├── main.py                # 🚀 FastAPI application entry point
├── requirements.txt       # 📋 Python dependencies (15+ packages)
├── data/                  # 💾 Database and file storage
│   ├── rero.db           # SQLite database file
│   └── arduino_projects/ # Temporary Arduino project directories
├── core/                  # ⚙️ Core application modules (5 modules)
│   ├── config.py         # Configuration management and logging setup
│   ├── models.py         # Pydantic data models and response schemas
│   ├── slot_manager.py   # Slot booking business logic
│   ├── state.py          # Global application state management
│   └── __init__.py
├── auth/                  # 🔐 Authentication system (1 module)
│   ├── local_auth.py     # Local user management with bcrypt
│   └── __init__.py
├── database/              # 💾 Database operations (1 module)
│   ├── operations.py     # SQLite CRUD operations and schema management
│   └── __init__.py
├── routes/                # 🛣️ HTTP API endpoints (3 route modules)
│   ├── main.py           # Core API routes (slots, stats, health)
│   ├── auth.py           # Authentication routes (login, register)
│   ├── devices.py        # Arduino device management routes
│   └── __init__.py
├── websocket/             # 🔌 Real-time communication (4 modules)
│   ├── endpoints.py      # Slot booking WebSocket endpoint
│   ├── device_endpoints.py # Device serial reading WebSocket endpoint
│   ├── handlers.py       # WebSocket message processing
│   ├── manager.py        # Connection and broadcast management
│   └── __init__.py
└── device_handler/       # 🔌 Arduino integration (4 modules)
    ├── get_devices.py    # Hardware device detection and listing
    ├── serial_manager.py # Real-time serial communication management
    ├── utils.py          # Board configurations and file management
    └── __init__.py
```

#### ⚙️ Backend Technology Features
- **FastAPI Framework**: Async Python with automatic OpenAPI/Swagger docs
- **SQLite Database**: Lightweight, file-based database with ACID compliance
- **Dual WebSocket Support**: Slot booking + device serial communication endpoints
- **PySerial Integration**: Real-time Arduino serial communication at 9600 baud
- **Thread-Safe Operations**: Concurrent serial reading with broadcast messaging
- **bcrypt Security**: Password hashing with salt and secure verification
- **arduino-cli Integration**: Command-line interface for Arduino compilation/upload
- **Serial Port Management**: Exclusive access handling for upload/read operations
- **Pydantic Models**: Data validation and serialization with type hints
- **CORS Middleware**: Cross-origin resource sharing for web clients
- **Structured Logging**: Multi-level logging across all modules
- **Modular Design**: Separation of concerns with clean interfaces
- **Error Handling**: Comprehensive exception handling and user feedback
- **Resource Cleanup**: Automatic connection and file management

## 🔌 Arduino Device Management

### 🔧 Supported Hardware
- **Arduino Uno** (Official boards: `2341:0043`, `2341:0243`)
- **Arduino Mega** (Official boards: `2341:0010`, `2341:0042`) 
- **CH340 Clones** (`1a86:7523` - Uno/Mega compatible)
- **ESP32 Variants** (Multiple chip types):
  - CP2102 USB-to-Serial (`10c4:ea60`)
  - CP2105 Dual UART (`10c4:ea70`) 
  - CH9102 newer clones (`1a86:55d4`)
  - FTDI-based boards (`0403:6001`)
  - ESP32-S2 native USB (`303a:1001`)

### 📡 Device API Endpoints

#### 1. 📋 List Connected Devices
```http
GET /devices
```
**Response Example**:
```json
{
  "success": true,
  "devices": [
    {
      "model": "uno",
      "port": "/dev/ttyUSB0",
      "description": "USB Serial", 
      "manufacturer": null,
      "serial_number": null,
      "vid": "1a86",
      "pid": "7523"
    },
    {
      "model": "esp32",
      "port": "/dev/ttyACM0",
      "description": "USB Single Serial",
      "manufacturer": null, 
      "serial_number": "5574010494",
      "vid": "1a86",
      "pid": "55d4"
    }
  ],
  "count": 2,
  "supported_models": ["uno", "mega", "esp32"]
}
```

#### 2. ⚙️ Compile Arduino Code
```http
POST /devices/compile
Content-Type: application/json

{
  "code": "void setup() {\n  Serial.begin(9600);\n  pinMode(LED_BUILTIN, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(LED_BUILTIN, HIGH);\n  delay(1000);\n  digitalWrite(LED_BUILTIN, LOW);\n  delay(1000);\n}"
}
```
**Response Example**:
```json
{
  "success": true,
  "compile_results": {
    "uno": {
      "success": true,
      "stdout": "Sketch uses 1634 bytes (5%) of program storage space. Maximum is 32256 bytes.\nGlobal variables use 200 bytes (9%) of dynamic memory, leaving 1848 bytes for local variables. Maximum is 2048 bytes.\n",
      "stderr": ""
    },
    "mega": {
      "success": true, 
      "stdout": "Sketch uses 1634 bytes (0%) of program storage space. Maximum is 253952 bytes.\nGlobal variables use 200 bytes (2%) of dynamic memory, leaving 7992 bytes for local variables. Maximum is 8192 bytes.\n",
      "stderr": ""
    },
    "esp32": {
      "success": true,
      "stdout": "Sketch uses 221465 bytes (16%) of program storage space. Maximum is 1310720 bytes.\nGlobal variables use 13428 bytes (4%) of dynamic memory, leaving 314252 bytes for local variables. Maximum is 327680 bytes.\n", 
      "stderr": ""
    }
  },
  "message": "Code compiled successfully for all boards",
  "project_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

#### 3. 📤 Upload Code to Device
```http
POST /devices/upload/{device_number}
Content-Type: application/json

{
  "code": "void setup() {\n  Serial.begin(9600);\n  Serial.println(\"Hello, ReRo!\");\n}\n\nvoid loop() {\n  Serial.println(\"Running...\");\n  delay(2000);\n}",
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Security & Validation Features**:
- ✅ **User Authentication**: Validates email/password credentials
- ✅ **Slot Authorization**: Ensures user has booked the current time slot
- ✅ **Device Validation**: Confirms target device exists and is available
- ✅ **Board Compatibility**: Automatically selects correct FQBN for device type
- ✅ **Automatic Cleanup**: Removes temporary project files after upload
- ✅ **Error Handling**: Comprehensive error reporting for all failure modes

**Response Example (Success)**:
```json
{
  "success": true,
  "message": "Code uploaded successfully to device 0",
  "device_info": {
    "model": "uno",
    "port": "/dev/ttyUSB0"
  },
  "upload_details": {
    "compile_success": true,
    "upload_success": true,
    "project_id": "uuid-here"
  }
}
```

**Response Example (Error)**:
```json
{
  "success": false,
  "message": "Upload failed: User does not have current slot booked",
  "error_type": "slot_validation_error",
  "details": {
    "current_slot": 9,
    "user_email": "user@example.com",
    "slot_booked": false
  }
}
```

### ⚡ Arduino Integration Features
- **🔄 Auto-detection**: Scans for connected devices on startup and refresh
- **🎯 Multi-board Support**: Compiles for Uno, Mega, and ESP32 simultaneously
- **🛡️ Secure Operations**: All uploads require authentication and slot validation
- **📁 Project Management**: Creates temporary Arduino projects with proper structure
- **🧹 Cleanup**: Automatic removal of temporary files for security
- **⚡ Fast Compilation**: Uses arduino-cli for efficient build process
- **📊 Detailed Feedback**: Memory usage, compile errors, upload status
- **🔍 Device Validation**: Ensures hardware exists before attempting operations

## 📡 Real-time Device Serial Communication

### 🌐 WebSocket Endpoint for Device Reading

#### `/devices/read/{device_number}`

**Real-time serial output monitoring** - Connect to Arduino devices and receive live serial data at 9600 baud.

**Features**:
- ✅ **Authentication Required**: Email/password validation
- ✅ **Slot-based Authorization**: Must have current time slot booked
- ✅ **Real-time Updates**: Instant serial output broadcasting
- ✅ **Multi-client Support**: Multiple users can read from same device
- ✅ **Automatic Cleanup**: Connections properly managed

### 📱 Usage Examples

#### JavaScript WebSocket Client
```javascript
const deviceNumber = 0;
const ws = new WebSocket(`ws://localhost:8000/devices/read/${deviceNumber}`);

ws.onopen = () => {
    // Send authentication
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
            console.log('Connected to:', data.device_info);
            break;
        case 'serial_output':
            console.log('Device output:', data.output);
            break;
    }
};
```

#### Python AsyncIO Client
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

### 📨 WebSocket Message Types

#### Client → Server (Authentication)
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

#### Server → Client Messages

**Connection Established**:
```json
{
    "type": "connection_established",
    "device_number": 0,
    "device_info": {
        "model": "uno",
        "port": "/dev/ttyUSB0"
    },
    "message": "Connected to device 0 (uno on /dev/ttyUSB0)"
}
```

**Serial Output**:
```json
{
    "type": "serial_output",
    "device_number": 0,
    "output": "Hello from Arduino!\nLED ON\nLED OFF\n",
    "timestamp": "2025-07-29T12:34:56.789Z"
}
```

**Error Messages**:
```json
{
    "type": "error",
    "message": "Authentication failed"
}
```

### 🛡️ Security & Access Control

**Error Conditions**:
- **Invalid Device**: Device number doesn't exist → Immediate error + close
- **Authentication Failed**: Invalid credentials → Error + close
- **No Slot Booked**: User hasn't booked current time slot → Error + close
- **Device Busy**: Serial port in use by upload → Graceful handling

### ⚡ Integration with Code Upload

When code is uploaded via `/devices/upload/{device_number}`:
1. **Serial reading automatically stops** (prevents port conflicts)
2. **Device output reset to empty** (fresh start)
3. **New code execution begins**
4. **Serial reading can be restarted** via WebSocket connection

### 🔧 Arduino Code for Serial Output

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
    
    Serial.print("Uptime: ");
    Serial.print(millis() / 1000);
    Serial.println(" seconds");
}
```

### 📊 Performance Characteristics

- **Baud Rate**: 9600 (configurable)
- **Buffer Size**: 10,000 characters per device
- **Latency**: Sub-second real-time delivery
- **Concurrent Connections**: Multiple users per device
- **Memory Usage**: Bounded by buffer limits
- **Thread Safety**: Full concurrent operation support

## 🔐 Authentication & Security

### 🔒 User Management System
- **🆕 Self-Registration**: Users create accounts with email/password
- **🔐 Secure Login**: bcrypt password hashing with salt (12 rounds)
- **📧 Email-based Identity**: Each user identified by unique email address
- **🛡️ Password Security**: No plain-text storage, secure verification
- **🔄 Session Management**: Stateless authentication for API requests
- **👤 User Profiles**: Profile information with creation timestamps

### 🛡️ Security Features
- **🔒 bcrypt Hashing**: Industry-standard password protection
- **🎯 Slot-based Access**: Users can only upload during their booked time slots
- **🔍 Device Validation**: Hardware existence verification before upload attempts
- **🚫 SQL Injection Protection**: Parameterized queries throughout database layer
- **📝 Input Validation**: Pydantic models for request/response validation
- **🔐 Credential Verification**: Secure authentication for all sensitive operations
- **🧹 Automatic Cleanup**: Temporary file removal for security
- **⚡ Rate Limiting**: Built-in FastAPI protections against abuse

### 📊 Database Schema

#### 👥 Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,           -- Unique email identifier
    password_hash TEXT NOT NULL,          -- bcrypt hashed password (60 chars)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME DEFAULT NULL     -- Track user activity
);
```

#### 🕐 Slots Table  
```sql
CREATE TABLE slots (
    id INTEGER PRIMARY KEY,               -- Slot ID (3-14 for 3AM-3PM)
    start_time TEXT NOT NULL,             -- Start time format: "09:00"
    end_time TEXT NOT NULL,               -- End time format: "10:00"
    is_booked BOOLEAN DEFAULT FALSE,      -- Booking status flag
    booked_by TEXT DEFAULT NULL,          -- User email who booked slot
    booked_at DATETIME DEFAULT NULL,      -- Timestamp when slot was booked
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 🔑 Authentication Workflow
1. **Registration**: 
   - Email uniqueness validation
   - Password strength requirements
   - bcrypt hash generation and storage
   - User profile creation

2. **Login**:
   - Email/password credential verification
   - bcrypt password comparison
   - User session establishment
   - Last login timestamp update

3. **Protected Operations**:
   - Authentication token validation
   - User permission verification  
   - Slot booking authorization
   - Device upload access control

## ⚡ Real-time Features & Slot Management

### 🌐 WebSocket Communication
- **📡 Dual WebSocket Endpoints**: Slot booking + device serial communication
- **🔄 Auto-reconnection**: Automatic reconnection on connection loss
- **📊 Connection Monitoring**: Live connection count and status tracking
- **🎯 Instant Updates**: Real-time slot status + serial output delivery
- **💬 Message Broadcasting**: Efficient distribution to connected clients
- **🔍 Connection Management**: Add/remove connections with cleanup
- **⚡ Low Latency**: Sub-second update delivery across the network
- **🛡️ Authenticated Streams**: Secure access to both slot and device data
- **🎯 Instant Updates**: Immediate slot status propagation to all clients
- **💬 Message Broadcasting**: Efficient message distribution to connected clients
- **🔍 Connection Management**: Add/remove connections with cleanup
- **⚡ Low Latency**: Sub-second update delivery across the network

### 🕐 Slot Management System
- **📅 24 Time Slots**: Complete 24-hour coverage (00:00 - 23:59) with 1-hour intervals
- **🎨 Visual Status Indicators**: 
  - 🟢 **Available** - Open for booking
  - 🔴 **Booked by Others** - Unavailable  
  - 🔵 **Your Booking** - Booked by current user
  - ⚪ **Loading** - Status being updated
- **⚡ One-click Operations**: Simple booking and cancellation interface
- **🔄 Real-time Sync**: Instant updates across all connected devices
- **📊 Booking Analytics**: Track booking patterns and usage statistics
- **🛡️ Conflict Prevention**: Atomic booking operations prevent race conditions

### 📋 API Endpoints for Slot Management

#### 🕐 Get All Slots
```http
GET /slots
```
**Response**:
```json
{
  "success": true,
  "slots": [
    {
      "id": 3,
      "start_time": "03:00", 
      "end_time": "04:00",
      "is_booked": false,
      "booked_by": null,
      "booked_at": null
    },
    {
      "id": 9,
      "start_time": "09:00",
      "end_time": "10:00", 
      "is_booked": true,
      "booked_by": "user@example.com",
      "booked_at": "2025-07-29T09:15:30.123Z"
    }
  ],
  "total_slots": 12,
  "available_slots": 10,
  "booked_slots": 2
}
```

#### 📊 System Statistics  
```http
GET /stats
```
**Response**:
```json
{
  "success": true,
  "active_connections": 5,
  "database": {
    "total_users": 25,
    "total_slots": 12,
    "booked_slots": 3,
    "available_slots": 9,
    "database_size": "256 KB"
  },
  "uptime": "2h 45m 12s",
  "arduino_devices": 2
}
```

#### 🏥 Health Check
```http
GET /health  
```
**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-07-29T12:34:56.789Z",
  "active_connections": 5,
  "booked_slots_count": 3,
  "database": {
    "status": "connected",
    "total_users": 25,
    "total_slots": 12
  },
  "arduino_cli": "available",
  "version": "1.0.0"
}
```

### 🔄 WebSocket Message Types

#### � Slot Booking Endpoint (`/slot-booking`)

**Client → Server Messages**:
```javascript
// Book a slot
{
  "type": "book_slot",
  "slot_id": 9,
  "user_email": "user@example.com", 
  "password": "securepassword"
}

// Cancel a booking
{
  "type": "cancel_slot",
  "slot_id": 9,
  "user_email": "user@example.com",
  "password": "securepassword"
}
```

**Server → Client Messages**:
```javascript
// Slot status update
{
  "type": "slot_update",
  "slot_id": 9,
  "is_booked": true,
  "booked_by": "user@example.com",
  "timestamp": "2025-07-29T12:34:56.789Z"
}

// Booking confirmation
{
  "type": "booking_success",
  "slot_id": 9,
  "message": "Slot booked successfully",
  "booked_at": "2025-07-29T12:34:56.789Z"
}

// Error notification
{
  "type": "error",
  "message": "Slot is already booked",
  "error_code": "SLOT_UNAVAILABLE"
}
```

#### 📡 Device Serial Endpoint (`/devices/read/{device_number}`)

**Client → Server Messages**:
```javascript
// Authentication (sent immediately after connection)
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Server → Client Messages**:
```javascript
// Connection established
{
  "type": "connection_established",
  "device_number": 0,
  "device_info": {"model": "uno", "port": "/dev/ttyUSB0"},
  "message": "Connected to device 0"
}

// Real-time serial output
{
  "type": "serial_output",
  "device_number": 0,
  "output": "LED ON\nLED OFF\nUptime: 45 seconds\n",
  "timestamp": "2025-07-29T12:34:56.789Z"
}

// Error responses
{
  "type": "error",
  "message": "Authentication failed"
}
```

### ⚡ Performance Features
- **🚀 Async Operations**: Non-blocking database operations
- **🔄 Connection Pooling**: Efficient database connection management  
- **📊 Real-time Metrics**: Live performance monitoring
- **🎯 Optimized Queries**: Indexed database queries for fast responses
- **📝 Structured Logging**: Performance tracking and debugging
- **🛡️ Error Recovery**: Graceful error handling with user feedback

## 🎨 Frontend Components & UI Features

### 🏗️ Modular Component Architecture Benefits
- **🔧 Single Responsibility**: Each component has a focused, specific purpose
- **♻️ High Reusability**: Components can be shared across multiple pages
- **🧪 Easy Testing**: Smaller components are simpler to unit test
- **📖 Better Readability**: Clean, focused page components with clear structure
- **⚡ Tree-shaking**: Better code splitting and bundle optimization
- **🔄 Hot Reload**: Fast development with component-level updates

### 🎨 Material-UI & Theming Features
- **🌙 Dark Theme**: Comprehensive dark mode with custom color palette
- **📱 Responsive Components**: Mobile-first responsive design system
- **🎯 Consistent Styling**: Unified design language across all components
- **⚡ Performance**: Optimized component rendering with minimal re-renders
- **🎭 Smooth Animations**: Material Design transitions and micro-interactions

#### 🎨 Custom Theme Configuration
```typescript
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#60a5fa' },      // Light blue
    secondary: { main: '#34d399' },    // Light green  
    background: {
      default: '#0f172a',             // Dark slate
      paper: '#1e293b'                // Lighter dark for cards
    },
    text: {
      primary: '#f1f5f9',             // Light text
      secondary: '#cbd5e1'            // Muted light text
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif'
  }
});
```

### 🔧 Component Examples & Usage

#### 📊 Slot Grid Component
```tsx
// Clean, modular slot grid with real-time updates
<SlotsGrid 
  slotsData={slotsData}
  userEmail={user?.email}
  loading={loading}
  onSlotAction={handleSlotAction}
/>
```

#### 🎯 Slot Card Component  
```tsx
// Individual slot with visual status and actions
<SlotCard
  slot={slot}
  isUserSlot={slot.booked_by === userEmail}
  onBook={() => onSlotAction('book', slot.id)}
  onCancel={() => onSlotAction('cancel', slot.id)}
/>
```

#### 🚨 Status Alert Component
```tsx
// Real-time connection and error status
<StatusAlerts 
  error={error}
  isConnected={isConnected}
  reconnecting={reconnecting}
/>
```

### 📱 Responsive Design Features
- **📱 Mobile-first**: Optimized for mobile devices with touch-friendly interfaces
- **💻 Desktop Enhanced**: Rich desktop experience with hover states and larger layouts
- **🖥️ Tablet Optimized**: Perfect tablet experience with intermediate layouts
- **📐 Flexible Grid**: CSS Grid and Flexbox for adaptive layouts
- **🎯 Touch Targets**: Properly sized buttons and interactive elements
- **📏 Breakpoint System**: Material-UI breakpoints for consistent responsive behavior

### ⚡ Frontend Performance Features
- **🚀 Vite Build System**: Lightning-fast development and production builds
- **📦 Code Splitting**: Automatic route-based code splitting with React.lazy
- **🔄 Hot Module Replacement**: Instant updates during development
- **🗜️ Asset Optimization**: Automatic image and asset optimization
- **📊 Bundle Analysis**: Built-in bundle size analysis and optimization
- **⚡ Tree Shaking**: Dead code elimination for smaller bundles

### 🔄 State Management
- **🎯 React Context**: Global state management for authentication and app state
- **📊 Local State**: Component-level state for UI interactions
- **🔄 WebSocket State**: Real-time data synchronization with backend
- **💾 Persistent State**: Local storage for user preferences
- **🔍 Error Boundaries**: Graceful error handling and recovery

## 🔧 Development Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
python main.py       # Start development server
uvicorn main:app --reload  # Alternative start command
```

## 🚀 Production Deployment

### Frontend Build
```bash
cd frontend
npm run build
# Deploy dist/ folder to web server
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 📊 API Documentation

When running the backend, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🧪 Testing & API Documentation

### 📊 API Documentation Access
When running the backend, comprehensive API documentation is available:
- **📖 Swagger UI**: `http://localhost:8000/docs` - Interactive API explorer
- **📋 ReDoc**: `http://localhost:8000/redoc` - Clean, readable API documentation  
- **🔍 OpenAPI Schema**: `http://localhost:8000/openapi.json` - Machine-readable API specification

### 🔧 Development Testing

#### 🛠️ Backend API Testing
```bash
# Health check
curl http://localhost:8000/health

# List all slots
curl http://localhost:8000/slots

# Get system statistics
curl http://localhost:8000/stats

# List connected Arduino devices
curl http://localhost:8000/devices

# Test Arduino code compilation
curl -X POST "http://localhost:8000/devices/compile" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "void setup() {\n  Serial.begin(9600);\n  pinMode(LED_BUILTIN, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(LED_BUILTIN, HIGH);\n  delay(1000);\n  digitalWrite(LED_BUILTIN, LOW);\n  delay(1000);\n}"
  }'

# Test user registration
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepassword123"
  }'

# Test user login
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com", 
    "password": "securepassword123"
  }'

# Test code upload (requires authentication and slot booking)
curl -X POST "http://localhost:8000/devices/upload/0" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "void setup(){Serial.begin(9600);}\nvoid loop(){Serial.println(\"Test\");delay(1000);}",
    "email": "test@example.com",
    "password": "securepassword123"
  }'
```

#### 🎨 Frontend Testing
```bash
# Start development server with hot reload
npm run dev

# Build for production and check for errors
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code quality
npm run lint

# Type checking with TypeScript
npx tsc --noEmit
```

#### 📡 Device WebSocket Testing

**Comprehensive Test Suite**:
```bash
cd backend
python test_websocket_device.py  # Full automated testing
```

**Manual WebSocket Testing**:
```bash
cd backend
python test_websocket_client.py  # Interactive testing
```

**Browser Console Testing**:
```javascript
// Test device serial WebSocket in browser console
const ws = new WebSocket('ws://localhost:8000/devices/read/0');
ws.onopen = () => ws.send(JSON.stringify({
  email: 'test@example.com', 
  password: 'testpassword123'
}));
ws.onmessage = e => console.log(JSON.parse(e.data));
```

**Test Coverage**:
- ✅ Device authentication and authorization
- ✅ Serial output reading and broadcasting
- ✅ Connection management and cleanup
- ✅ Error handling for all edge cases
- ✅ Integration with code upload functionality

### 🔍 WebSocket Testing

#### 📡 Using Browser Developer Tools

**Slot Booking WebSocket**:
```javascript
// Connect to slot booking WebSocket
const ws = new WebSocket('ws://localhost:8000/slot-booking');

// Listen for messages
ws.onmessage = (event) => {
  console.log('Received:', JSON.parse(event.data));
};

// Book a slot
ws.send(JSON.stringify({
  type: 'book_slot',
  slot_id: 9,
  user_email: 'test@example.com',
  password: 'securepassword123'
}));

// Cancel a slot
ws.send(JSON.stringify({
  type: 'cancel_slot', 
  slot_id: 9,
  user_email: 'test@example.com',
  password: 'securepassword123'
}));
```

**Device Serial WebSocket**:
```javascript
// Connect to device serial WebSocket
const deviceWs = new WebSocket('ws://localhost:8000/devices/read/0');

// Send authentication
deviceWs.onopen = () => {
  deviceWs.send(JSON.stringify({
    email: 'test@example.com',
    password: 'securepassword123'
  }));
};

// Listen for serial output
deviceWs.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'serial_output') {
    console.log('Arduino output:', data.output);
  }
};
```

#### 🔌 Using wscat (WebSocket client)
```bash
# Install wscat
npm install -g wscat

# Connect to slot booking endpoint
wscat -c ws://localhost:8000/slot-booking

# Send booking message
{"type":"book_slot","slot_id":9,"user_email":"test@example.com","password":"securepassword123"}

# Connect to device serial endpoint
wscat -c ws://localhost:8000/devices/read/0

# Send authentication
{"email":"test@example.com","password":"securepassword123"}
```

### 🐛 Debugging & Logging

#### 📝 Backend Logging Levels
```python
# Configure logging in core/config.py
logging.basicConfig(
    level=logging.INFO,  # Change to DEBUG for verbose logging
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

#### 🔍 Frontend Development Tools
- **React Developer Tools**: Component inspection and state debugging
- **Browser DevTools**: Network monitoring and WebSocket message inspection
- **Vite DevTools**: Build analysis and performance monitoring
- **Material-UI DevTools**: Theme and component debugging

### ⚡ Performance Testing

#### 📊 Backend Performance
```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Load test API endpoints
ab -n 1000 -c 10 http://localhost:8000/health
ab -n 500 -c 5 http://localhost:8000/slots
ab -n 100 -c 2 http://localhost:8000/devices
```

#### 🎯 Frontend Performance
```bash
# Lighthouse CLI for performance audit
npm install -g lighthouse
lighthouse http://localhost:5173 --output html --output-path ./lighthouse-report.html

# Bundle analyzer
npm run build
npx vite-bundle-analyzer dist
```

## 📝 Recent Changes

### 🆕 Device Serial Reading WebSocket (Latest)
- **Real-time Serial Communication**: New `/devices/read/{device_number}` WebSocket endpoint
- **Live Arduino Output**: Stream serial data at 9600 baud to authenticated users
- **Secure Access Control**: Authentication + slot validation for device access
- **Concurrent Multi-user Support**: Multiple users can read from same device
- **Integration with Upload**: Automatic serial disconnect during code upload
- **Thread-safe Operations**: Concurrent serial reading with broadcast messaging
- **Comprehensive Testing**: Full test suite with automated and manual testing tools

### ✨ Frontend Refactoring
- **Modular Components**: Split large page components into focused, reusable modules
- **Improved Maintainability**: Better code organization and separation of concerns
- **Enhanced Reusability**: Components can be easily shared across pages
- **Better Testing**: Smaller components are easier to unit test

### 🔌 Backend Device Management
- **Arduino Integration**: Complete device detection and management system
- **Code Compilation**: Support for Uno, Mega, and ESP32 boards
- **Secure Uploads**: Authentication and slot validation for device uploads
- **Automatic Cleanup**: Temporary file management for security

### 🛡️ Security Enhancements
- **Dual WebSocket Security**: Authentication required for both slot and device endpoints
- **Slot-based Access Control**: Users can only upload/read during booked slots
- **Device Validation**: Ensures target devices exist before operations
- **Serial Port Management**: Exclusive access handling prevents conflicts
- **Credential Verification**: Secure authentication for all sensitive operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the modular architecture
4. Test thoroughly (frontend build + backend endpoints)
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for the ReRo community**

*Modern web technology meets Arduino development in a secure, real-time slot booking system.*
