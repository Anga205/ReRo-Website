"""WebSocket message handlers for the Slot Booking API."""

import json
import logging
from typing import Dict
from fastapi import WebSocket
from models import (
    create_booking_response, 
    create_cancellation_response, 
    create_error_response,
    create_slots_message
)
from slot_manager import book_slot, cancel_slot_booking, get_slot_summary
from websocket_manager import broadcast_slot_update

logger = logging.getLogger(__name__)

async def handle_slot_booking(slot_id: int) -> Dict:
    """Handle slot booking request and return response message."""
    if book_slot(slot_id):
        # Broadcast update to all connections
        await broadcast_slot_update()
        
        return create_booking_response(
            success=True,
            message=f"Slot {slot_id} booked successfully",
            slot_id=slot_id
        )
    else:
        return create_booking_response(
            success=False,
            message=f"Slot {slot_id} is not available",
            slot_id=slot_id
        )

async def handle_slot_cancellation(slot_id: int) -> Dict:
    """Handle slot cancellation request and return response message."""
    if cancel_slot_booking(slot_id):
        # Broadcast update to all connections
        await broadcast_slot_update()
        
        return create_cancellation_response(
            success=True,
            message=f"Slot {slot_id} booking cancelled successfully",
            slot_id=slot_id
        )
    else:
        return create_cancellation_response(
            success=False,
            message=f"Slot {slot_id} was not booked",
            slot_id=slot_id
        )

async def handle_get_slots() -> Dict:
    """Handle get slots request and return current slots."""
    slot_summary = get_slot_summary()
    return create_slots_message(
        slot_summary["slots"],
        slot_summary["available_slots"],
        slot_summary["booked_slots"]
    )

async def process_client_message(websocket: WebSocket, message_data: Dict) -> None:
    """Process incoming message from client."""
    message_type = message_data.get("type")
    
    if message_type == "book_slot":
        slot_id = message_data.get("slot_id")
        if slot_id is not None:
            response = await handle_slot_booking(slot_id)
            await websocket.send_text(json.dumps(response))
        else:
            error_response = create_error_response("Missing slot_id in booking request")
            await websocket.send_text(json.dumps(error_response))
    
    elif message_type == "cancel_slot":
        slot_id = message_data.get("slot_id")
        if slot_id is not None:
            response = await handle_slot_cancellation(slot_id)
            await websocket.send_text(json.dumps(response))
        else:
            error_response = create_error_response("Missing slot_id in cancellation request")
            await websocket.send_text(json.dumps(error_response))
    
    elif message_type == "get_slots":
        slots_message = await handle_get_slots()
        await websocket.send_text(json.dumps(slots_message))
    
    else:
        error_response = create_error_response(f"Unknown message type: {message_type}")
        await websocket.send_text(json.dumps(error_response))
