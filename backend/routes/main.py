"""Main API routes."""

from fastapi import APIRouter
from core.models import create_root_response, create_health_response
from websocket.manager import get_connection_count
from core.slot_manager import get_booked_slots_list
from database.operations import get_database_stats, get_user_bookings
from auth.local_auth import validate_user_credentials
from core.models import BookingRequest, CancellationRequest, LoginRequest
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

main_router = APIRouter()

@main_router.get("/")
async def root():
    """Root endpoint for basic API information."""
    return create_root_response(
        active_connections=get_connection_count(),
        booked_slots=get_booked_slots_list()
    )

@main_router.get("/health")
async def health_check():
    """Health check endpoint with system status."""
    db_stats = get_database_stats()
    
    response = create_health_response(
        active_connections=get_connection_count(),
        booked_slots_count=db_stats.get("booked_slots", 0)
    )
    
    # Add database statistics
    response["database"] = db_stats
    
    return response

@main_router.get("/slots")
async def get_all_slots():
    """Get all slots with their current status."""
    from core.slot_manager import get_slot_summary
    return get_slot_summary()

@main_router.get("/stats")
async def get_statistics():
    """Get detailed statistics about the slot booking system."""
    db_stats = get_database_stats()
    
    return {
        "database": db_stats,
        "websocket": {
            "active_connections": get_connection_count()
        },
        "slots": {
            "total": db_stats.get("total_slots", 12),
            "booked": db_stats.get("booked_slots", 0),
            "available": db_stats.get("available_slots", 12)
        }
    }

@main_router.post("/book-slot")
async def book_slot_http(booking_data: BookingRequest):
    """HTTP endpoint to book a slot with authentication."""
    from core.slot_manager import book_slot
    
    # Validate user credentials
    user_email = await validate_user_credentials(booking_data.email, booking_data.password)
    if not user_email:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Attempt to book the slot
    success = book_slot(booking_data.slot_id, user_email)
    
    if success:
        return {
            "success": True,
            "message": f"Slot {booking_data.slot_id} booked successfully",
            "slot_id": booking_data.slot_id
        }
    else:
        raise HTTPException(status_code=400, detail=f"Slot {booking_data.slot_id} is not available")

@main_router.post("/cancel-slot")
async def cancel_slot_http(cancellation_data: CancellationRequest):
    """HTTP endpoint to cancel a slot booking with authentication."""
    from core.slot_manager import cancel_slot_booking
    
    # Validate user credentials
    user_email = await validate_user_credentials(cancellation_data.email, cancellation_data.password)
    if not user_email:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Attempt to cancel the slot
    success = cancel_slot_booking(cancellation_data.slot_id, user_email)
    
    if success:
        return {
            "success": True,
            "message": f"Slot {cancellation_data.slot_id} booking cancelled successfully",
            "slot_id": cancellation_data.slot_id
        }
    else:
        raise HTTPException(status_code=400, detail=f"Slot {cancellation_data.slot_id} was not booked by you or does not exist")

@main_router.post("/my-bookings")
async def get_my_bookings(login_data: LoginRequest):
    """Get all bookings for the authenticated user."""
    # Validate user credentials
    user_email = await validate_user_credentials(login_data.email, login_data.password)
    if not user_email:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    bookings = get_user_bookings(user_email)
    return {
        "success": True,
        "bookings": bookings,
        "total_bookings": len(bookings)
    }
