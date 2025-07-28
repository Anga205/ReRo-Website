"""WebSocket endpoints for the Slot Booking API."""

import json
import logging
from fastapi import WebSocket, WebSocketDisconnect
from websocket.manager import add_connection, remove_connection, send_initial_slots
from websocket.handlers import process_client_message
from core.models import create_error_response

logger = logging.getLogger(__name__)

async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for slot booking."""
    await websocket.accept()
    await add_connection(websocket)
    
    # Send initial slot information
    await send_initial_slots(websocket)
    
    try:
        while True:
            # Wait for messages from client
            data = await websocket.receive_text()
            
            try:
                message_data = json.loads(data)
                await process_client_message(websocket, message_data)
                
            except json.JSONDecodeError:
                error_response = create_error_response("Invalid JSON format")
                await websocket.send_text(json.dumps(error_response))
                
    except WebSocketDisconnect:
        logger.info("Client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        await remove_connection(websocket)
