"""Configuration settings for the Slot Booking API."""

import logging
from typing import Dict, Any

# Logging configuration
def setup_logging() -> None:
    """Configure logging for the application."""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

# CORS configuration
CORS_CONFIG: Dict[str, Any] = {
    "allow_origins": ["*"],
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}

# Slot configuration
SLOT_CONFIG: Dict[str, Any] = {
    "start_hour": 0,  # 12:00 AM (midnight)
    "end_hour": 24,   # 12:00 AM next day (exclusive)
    "slot_duration_hours": 1,
}

# Server configuration
SERVER_CONFIG: Dict[str, Any] = {
    "host": "0.0.0.0",
    "port": 8000,
    "log_level": "info",
}

# API metadata
API_CONFIG: Dict[str, Any] = {
    "title": "Slot Booking API",
    "version": "1.0.0",
    "description": "A WebSocket-based slot booking system with real-time updates",
}
