"""HTTP routes for the Slot Booking API."""

from fastapi import APIRouter
from models import create_root_response, create_health_response
from state import get_connection_count, get_booked_slots_count, get_booked_slots
from slot_manager import get_booked_slots_list

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
    return create_health_response(
        active_connections=get_connection_count(),
        booked_slots_count=get_booked_slots_count()
    )
