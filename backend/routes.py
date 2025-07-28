"""HTTP routes for the Slot Booking API."""

from fastapi import APIRouter
from models import create_root_response, create_health_response
from websocket_manager import get_connection_count
from slot_manager import get_booked_slots_list
from database import get_database_stats

router = APIRouter()

@router.get("/")
async def root():
    """Root endpoint for basic API information."""
    return create_root_response(
        active_connections=get_connection_count(),
        booked_slots=get_booked_slots_list()
    )

@router.get("/health")
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

@router.get("/slots")
async def get_all_slots():
    """Get all slots with their current status."""
    from slot_manager import get_slot_summary
    return get_slot_summary()

@router.get("/stats")
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
