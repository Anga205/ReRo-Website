"""Slot management functions for the Slot Booking API."""

from typing import List, Dict
import logging
from core.config import SLOT_CONFIG
from database.operations import (
    get_all_slots, 
    book_slot_in_db, 
    cancel_slot_in_db, 
    is_slot_available_in_db
)

logger = logging.getLogger(__name__)

def generate_time_slots() -> List[Dict]:
    """Generate time slots from database."""
    return get_all_slots()

def get_available_slots() -> List[int]:
    """Get list of available slot IDs from database."""
    slots = get_all_slots()
    return [slot["id"] for slot in slots if not slot["is_booked"]]

def get_booked_slots_list() -> List[int]:
    """Get list of booked slot IDs from database."""
    slots = get_all_slots()
    return [slot["id"] for slot in slots if slot["is_booked"]]

def is_slot_available(slot_id: int) -> bool:
    """Check if a slot is available for booking."""
    # Valid slot IDs are 0-23 for 24-hour format
    valid_range = SLOT_CONFIG["start_hour"] <= slot_id < SLOT_CONFIG["end_hour"]
    if not valid_range:
        return False
    
    return is_slot_available_in_db(slot_id)

def book_slot(slot_id: int, booked_by: str) -> bool:
    """Book a slot if available. Returns True if successful, False otherwise."""
    if not is_slot_available(slot_id):
        return False
    
    return book_slot_in_db(slot_id, booked_by)

def cancel_slot_booking(slot_id: int, user_email: str = None) -> bool:
    """Cancel a slot booking. Returns True if successful, False otherwise."""
    return cancel_slot_in_db(slot_id, user_email)

def get_slot_summary() -> Dict:
    """Get a summary of all slots."""
    return {
        "slots": generate_time_slots(),
        "available_slots": get_available_slots(),
        "booked_slots": get_booked_slots_list()
    }
