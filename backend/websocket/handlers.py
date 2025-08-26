"""WebSocket message handlers for the Slot Booking API."""

import json
import logging
from typing import Dict
from fastapi import WebSocket
from core.models import (
    create_booking_response, 
    create_cancellation_response, 
    create_error_response,
    create_slots_message
)
from core.slot_manager import book_slot, cancel_slot_booking, get_slot_summary
from websocket.manager import broadcast_slot_update
from auth.local_auth import validate_user_credentials
from auth.jwt_utils import decode_access_token

logger = logging.getLogger(__name__)

async def handle_slot_booking(slot_id: int, email: str | None = None, password: str | None = None, token: str | None = None) -> Dict:
    """Handle slot booking request with authentication and return response message."""
    # Resolve user via token or legacy credentials
    user_email = None
    if token:
        try:
            claims = decode_access_token(token)
            user_email = claims.get("sub")
        except Exception:
            user_email = None
    elif email and password:
        user_email = await validate_user_credentials(email, password)
    if not user_email:
        return create_booking_response(
            success=False,
            message="Authentication failed. Invalid credentials.",
            slot_id=slot_id
        )
    
    if book_slot(slot_id, user_email):
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

async def handle_slot_cancellation(slot_id: int, email: str | None = None, password: str | None = None, token: str | None = None) -> Dict:
    """Handle slot cancellation request with authentication and return response message."""
    user_email = None
    if token:
        try:
            claims = decode_access_token(token)
            user_email = claims.get("sub")
        except Exception:
            user_email = None
    elif email and password:
        user_email = await validate_user_credentials(email, password)
    if not user_email:
        return create_cancellation_response(
            success=False,
            message="Authentication failed. Invalid credentials.",
            slot_id=slot_id
        )
    
    if cancel_slot_booking(slot_id, user_email):
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
            message=f"Slot {slot_id} was not booked by you or does not exist",
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
        email = message_data.get("email")
        password = message_data.get("password")
        token = message_data.get("token")
        
        if slot_id is not None and (token or (email and password)):
            response = await handle_slot_booking(slot_id, email, password, token)
            await websocket.send_text(json.dumps(response))
        else:
            error_response = create_error_response("Missing slot_id or auth in booking request")
            await websocket.send_text(json.dumps(error_response))
    
    elif message_type == "cancel_slot":
        slot_id = message_data.get("slot_id")
        email = message_data.get("email")
        password = message_data.get("password")
        token = message_data.get("token")
        
        if slot_id is not None and (token or (email and password)):
            response = await handle_slot_cancellation(slot_id, email, password, token)
            await websocket.send_text(json.dumps(response))
        else:
            error_response = create_error_response("Missing slot_id or auth in cancellation request")
            await websocket.send_text(json.dumps(error_response))
    
    elif message_type == "get_slots":
        slots_message = await handle_get_slots()
        await websocket.send_text(json.dumps(slots_message))
    
    else:
        error_response = create_error_response(f"Unknown message type: {message_type}")
        await websocket.send_text(json.dumps(error_response))
