"""Global state management for the Slot Booking API."""

from typing import List, Set
from fastapi import WebSocket

# Global state for active connections and booked slots
active_connections: List[WebSocket] = []
booked_slots: Set[int] = set()

def get_active_connections() -> List[WebSocket]:
    """Get the list of active WebSocket connections."""
    return active_connections

def get_booked_slots() -> Set[int]:
    """Get the set of booked slot IDs."""
    return booked_slots

def get_connection_count() -> int:
    """Get the number of active connections."""
    return len(active_connections)

def get_booked_slots_count() -> int:
    """Get the number of booked slots."""
    return len(booked_slots)
