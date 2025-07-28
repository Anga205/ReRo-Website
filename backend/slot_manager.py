"""Slot management functions for the Slot Booking API."""

from typing import List, Dict
import logging
from config import SLOT_CONFIG
from models import create_slot_model
from state import get_booked_slots

logger = logging.getLogger(__name__)

def generate_time_slots() -> List[Dict]:
    """Generate time slots from 3am to 3pm (12 slots of 1 hour each)."""
    slots = []
    booked_slots = get_booked_slots()
    
    for hour in range(SLOT_CONFIG["start_hour"], SLOT_CONFIG["end_hour"]):
        slot_id = hour
        start_time = f"{hour:02d}:00"
        end_time = f"{(hour + 1):02d}:00"
        is_booked = slot_id in booked_slots
        
        slot = create_slot_model(slot_id, start_time, end_time, is_booked)
        slots.append(slot)
    
    return slots

def get_available_slots() -> List[int]:
    """Get list of available slot IDs."""
    all_slot_ids = set(range(SLOT_CONFIG["start_hour"], SLOT_CONFIG["end_hour"]))
    booked_slots = get_booked_slots()
    return list(all_slot_ids - booked_slots)

def get_booked_slots_list() -> List[int]:
    """Get list of booked slot IDs."""
    return list(get_booked_slots())

def is_slot_available(slot_id: int) -> bool:
    """Check if a slot is available for booking."""
    valid_range = SLOT_CONFIG["start_hour"] <= slot_id <= (SLOT_CONFIG["end_hour"] - 1)
    not_booked = slot_id not in get_booked_slots()
    return valid_range and not_booked

def book_slot(slot_id: int) -> bool:
    """Book a slot if available. Returns True if successful, False otherwise."""
    if not is_slot_available(slot_id):
        return False
    
    booked_slots = get_booked_slots()
    booked_slots.add(slot_id)
    logger.info(f"Slot {slot_id} booked successfully")
    return True

def cancel_slot_booking(slot_id: int) -> bool:
    """Cancel a slot booking. Returns True if successful, False otherwise."""
    booked_slots = get_booked_slots()
    if slot_id in booked_slots:
        booked_slots.remove(slot_id)
        logger.info(f"Slot {slot_id} booking cancelled")
        return True
    return False

def get_slot_summary() -> Dict:
    """Get a summary of all slots."""
    return {
        "slots": generate_time_slots(),
        "available_slots": get_available_slots(),
        "booked_slots": get_booked_slots_list()
    }
