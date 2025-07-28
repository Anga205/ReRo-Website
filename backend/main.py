"""
ReRo Website Backend - Slot Booking API

A FastAPI-based slot booking system with real-time WebSocket updates
and PESU authentication integration.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

# Import modular components
from core.config import setup_logging, CORS_CONFIG, API_CONFIG, SERVER_CONFIG
from routes.main import main_router
from routes.auth import auth_router
from routes.devices import devices_router
from websocket.endpoints import websocket_endpoint
from database.operations import initialize_database

# Configure logging
setup_logging()
logger = logging.getLogger(__name__)

# Initialize database
try:
    initialize_database()
    logger.info("Database initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize database: {e}")
    raise

# Create FastAPI application
app = FastAPI(
    title=API_CONFIG["title"],
    version=API_CONFIG["version"],
    description=API_CONFIG["description"]
)

# Add CORS middleware
app.add_middleware(CORSMiddleware, **CORS_CONFIG)

# Include HTTP routes
app.include_router(main_router)
app.include_router(auth_router)
app.include_router(devices_router)

# Register WebSocket endpoint
app.websocket("/slot-booking")(websocket_endpoint)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host=SERVER_CONFIG["host"], 
        port=SERVER_CONFIG["port"], 
        log_level=SERVER_CONFIG["log_level"]
    )
