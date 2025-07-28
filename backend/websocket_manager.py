"""WebSocket connection management for the Slot Booking API."""

import json
import logging
from typing import Dict, List
from fastapi import WebSocket
from models import create_slots_message
from slot_manager import get_slot_summary

logger = logging.getLogger(__name__)

# Global state for active connections (kept in memory for real-time updates)
active_connections: List[WebSocket] = []

def get_active_connections() -> List[WebSocket]:
    """Get the list of active WebSocket connections."""
    return active_connections

def get_connection_count() -> int:
    """Get the number of active connections."""
    return len(active_connections)

async def add_connection(websocket: WebSocket) -> None:
    """Add a new WebSocket connection to active connections."""
    active_connections.append(websocket)
    logger.info(f"New connection added. Total connections: {len(active_connections)}")

async def remove_connection(websocket: WebSocket) -> None:
    """Remove a WebSocket connection from active connections."""
    if websocket in active_connections:
        active_connections.remove(websocket)
        logger.info(f"Connection removed. Total connections: {len(active_connections)}")

async def broadcast_to_all_connections(message: Dict) -> None:
    """Broadcast a message to all active WebSocket connections."""
    if not active_connections:
        return
    
    message_json = json.dumps(message)
    disconnected_connections = []
    
    for connection in active_connections:
        try:
            await connection.send_text(message_json)
        except Exception as e:
            logger.error(f"Error sending message to connection: {e}")
            disconnected_connections.append(connection)
    
    # Remove disconnected connections
    for connection in disconnected_connections:
        await remove_connection(connection)

async def send_initial_slots(websocket: WebSocket) -> None:
    """Send initial slot information to a newly connected client."""
    try:
        slot_summary = get_slot_summary()
        initial_message = create_slots_message(
            slot_summary["slots"],
            slot_summary["available_slots"],
            slot_summary["booked_slots"]
        )
        await websocket.send_text(json.dumps(initial_message))
        logger.info("Initial slots data sent to new connection")
    except Exception as e:
        logger.error(f"Error sending initial slots: {e}")

async def broadcast_slot_update() -> None:
    """Broadcast slot update to all active connections."""
    slot_summary = get_slot_summary()
    update_message = create_slots_message(
        slot_summary["slots"],
        slot_summary["available_slots"],
        slot_summary["booked_slots"]
    )
    await broadcast_to_all_connections(update_message)
