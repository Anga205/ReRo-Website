"""Data models and type definitions for the Slot Booking API."""

from typing import Dict, Any, List
from datetime import datetime
from pydantic import BaseModel

class LoginRequest(BaseModel):
    """Model for login request."""
    email: str
    password: str

class LoginResponse(BaseModel):
    """Model for login response with JWT token."""
    success: bool
    message: str
    token: str | None = None
    user: Dict[str, Any] | None = None

class RegisterRequest(BaseModel):
    """Model for user registration request."""
    email: str
    password: str

class BookingRequest(BaseModel):
    """Model for booking request with authentication."""
    slot_id: int
    # For backward compatibility, keep email/password optional but prefer token
    email: str | None = None
    password: str | None = None
    token: str | None = None

class CancellationRequest(BaseModel):
    """Model for cancellation request with authentication."""
    slot_id: int
    email: str | None = None
    password: str | None = None
    token: str | None = None
    
class TokenOnlyRequest(BaseModel):
    """Model carrying only a token; used for protected reads."""
    token: str | None = None

def create_slot_model(slot_id: int, start_time: str, end_time: str, is_booked: bool, booked_by: str = None) -> Dict[str, Any]:
    """Create a slot data model."""
    return {
        "id": slot_id,
        "start_time": start_time,
        "end_time": end_time,
        "is_booked": is_booked,
        "booked_by": booked_by
    }

def create_slots_message(slots: List[Dict], available_slots: List[int], booked_slots: List[int]) -> Dict[str, Any]:
    """Create a slots update message model."""
    return {
        "type": "slots_update",
        "data": {
            "slots": slots,
            "available_slots": available_slots,
            "booked_slots": booked_slots
        },
        "timestamp": datetime.now().isoformat()
    }

def create_booking_response(success: bool, message: str, slot_id: int) -> Dict[str, Any]:
    """Create a booking response message model."""
    return {
        "type": "booking_response",
        "success": success,
        "message": message,
        "slot_id": slot_id
    }

def create_cancellation_response(success: bool, message: str, slot_id: int) -> Dict[str, Any]:
    """Create a cancellation response message model."""
    return {
        "type": "cancellation_response",
        "success": success,
        "message": message,
        "slot_id": slot_id
    }

def create_error_response(message: str) -> Dict[str, Any]:
    """Create an error response message model."""
    return {
        "type": "error",
        "message": message
    }

def create_health_response(active_connections: int, booked_slots_count: int) -> Dict[str, Any]:
    """Create a health check response model."""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "active_connections": active_connections,
        "total_slots": 12,
        "booked_slots_count": booked_slots_count,
        "available_slots_count": 12 - booked_slots_count
    }

def create_root_response(active_connections: int, booked_slots: List[int]) -> Dict[str, Any]:
    """Create a root endpoint response model."""
    return {
        "message": "Slot Booking API is running",
        "websocket_endpoint": "/slot-booking",
        "active_connections": active_connections,
        "booked_slots": booked_slots
    }
