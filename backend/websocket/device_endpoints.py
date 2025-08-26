"""WebSocket endpoints for device serial communication."""

import json
import time
import asyncio
import logging
from datetime import datetime
from typing import Dict, Set
from fastapi import WebSocket, WebSocketDisconnect, HTTPException
from pydantic import BaseModel

from device_handler.get_devices import connected_devices, detect_serial_devices
from device_handler.serial_manager import serial_manager
from auth.local_auth import LocalAuthService
from auth.jwt_utils import decode_access_token
from database.operations import get_database_connection

logger = logging.getLogger(__name__)

class DeviceLoginRequest(BaseModel):
    # Support either token or legacy email/password
    token: str | None = None
    email: str | None = None
    password: str | None = None

# Store active WebSocket connections for each device and their broadcast tasks
device_connections: Dict[int, Set[WebSocket]] = {}
broadcast_queues: Dict[int, asyncio.Queue] = {}

def get_current_time_slot() -> int:
    """Get the current time slot based on current hour."""
    current_hour = datetime.now().hour
    return current_hour

def is_user_slot_booked(user_email: str, slot_id: int) -> bool:
    """Check if the user has booked the specified time slot."""
    try:
        with get_database_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT is_booked, booked_by FROM slots WHERE id = ? AND booked_by = ?",
                (slot_id, user_email)
            )
            result = cursor.fetchone()
            return result is not None and result["is_booked"]
    except Exception as e:
        logger.error(f"Error checking user slot booking: {e}")
        return False

def authenticate_user_for_device(email: str, password: str) -> bool:
    """Authenticate user for device access."""
    user_profile = LocalAuthService.authenticate_user(email, password)
    return user_profile is not None

async def add_device_connection(device_number: int, websocket: WebSocket) -> None:
    """Add a WebSocket connection for a device."""
    if device_number not in device_connections:
        device_connections[device_number] = set()
        broadcast_queues[device_number] = asyncio.Queue(maxsize=100)
        # Start broadcast task for this device
        asyncio.create_task(broadcast_worker(device_number))
    
    device_connections[device_number].add(websocket)
    logger.info(f"Added connection for device {device_number}, total: {len(device_connections[device_number])}")

async def broadcast_worker(device_number: int) -> None:
    """Background worker to broadcast messages to device connections."""
    queue = broadcast_queues[device_number]
    
    try:
        while device_number in device_connections:
            try:
                # Wait for a message to broadcast
                message = await asyncio.wait_for(queue.get(), timeout=1.0)
                await broadcast_to_device_connections(device_number, message)
                queue.task_done()
            except asyncio.TimeoutError:
                # Check if we should continue running
                if device_number not in device_connections:
                    break
    except Exception as e:
        logger.error(f"Broadcast worker error for device {device_number}: {e}")
    finally:
        # Cleanup
        if device_number in broadcast_queues:
            del broadcast_queues[device_number]

async def remove_device_connection(device_number: int, websocket: WebSocket) -> None:
    """Remove a WebSocket connection for a device."""
    if device_number in device_connections:
        device_connections[device_number].discard(websocket)
        if not device_connections[device_number]:
            del device_connections[device_number]
            logger.info(f"No more connections for device {device_number}, removing from tracking")
            # The broadcast worker will automatically stop when device_connections entry is removed

async def broadcast_to_device_connections(device_number: int, message: str) -> None:
    """Broadcast a message to all connections for a specific device."""
    if device_number not in device_connections:
        return
    
    connections_to_remove = []
    
    for websocket in device_connections[device_number].copy():
        try:
            await websocket.send_text(message)
        except Exception as e:
            logger.warning(f"Failed to send message to device {device_number} connection: {e}")
            connections_to_remove.append(websocket)
    
    # Remove failed connections
    for websocket in connections_to_remove:
        device_connections[device_number].discard(websocket)

def setup_device_output_callback(device_number: int) -> None:
    """Set up callback for when device output is updated."""
    def output_callback(output: str):
        message = {
            "type": "serial_output",
            "device_number": device_number,
            "output": output,
            "timestamp": datetime.now().isoformat()
        }
        
        # Queue the message for broadcasting
        if device_number in broadcast_queues:
            try:
                broadcast_queues[device_number].put_nowait(json.dumps(message))
            except asyncio.QueueFull:
                logger.warning(f"Broadcast queue full for device {device_number}")
    
    serial_manager.add_output_callback(device_number, output_callback)

def validate_device_number(device_number: int) -> bool:
    """Validate that the device number exists."""
    global connected_devices
    connected_devices = detect_serial_devices()  # Refresh device list
    return 0 <= device_number < len(connected_devices)

async def device_read_websocket_endpoint(websocket: WebSocket, device_number: int):
    """WebSocket endpoint for reading device serial output."""
    await websocket.accept()
    
    try:
        # Validate device number
        if not validate_device_number(device_number):
            error_msg = {
                "type": "error",
                "message": f"Device {device_number} not found or invalid"
            }
            await websocket.send_text(json.dumps(error_msg))
            await websocket.close()
            return
        
        # Wait for authentication message
        auth_data = await websocket.receive_text()
        
        try:
            auth_message = json.loads(auth_data)

            # Determine email via token or legacy credentials
            email = None
            if isinstance(auth_message, dict) and auth_message.get("token"):
                try:
                    claims = decode_access_token(auth_message["token"])
                    email = claims.get("sub")
                except Exception:
                    email = None
            elif isinstance(auth_message, dict) and auth_message.get("email") and auth_message.get("password"):
                # Fallback legacy authentication
                if authenticate_user_for_device(auth_message["email"], auth_message["password"]):
                    email = auth_message["email"]
            
            if not email:
                error_msg = {
                    "type": "error", 
                    "message": "Authentication failed"
                }
                await websocket.send_text(json.dumps(error_msg))
                await websocket.close()
                return
            
            # Check if user has booked current slot
            current_slot = get_current_time_slot()
            if not is_user_slot_booked(email, current_slot):
                # Format time display properly for 24-hour format
                end_hour = (current_slot + 1) % 24
                error_msg = {
                    "type": "error",
                    "message": f"You must have booked the current time slot ({current_slot:02d}:00-{end_hour:02d}:00) to access device {device_number}"
                }
                await websocket.send_text(json.dumps(error_msg))
                await websocket.close()
                return
            
            # User is authenticated and authorized
            await add_device_connection(device_number, websocket)
            
            # Start reading from device if not already started
            device = connected_devices[device_number]
            device_port = device["port"]
            logger.info(f"Attempting to connect to device {device_number} ({device['model']} on {device_port})")
            if not serial_manager.is_device_connected(device_number):
                logger.info(f"Device {device_number} not connected, starting connection")
                success = serial_manager.start_reading_device(device_number, device_port)
                logger.info(f"Device {device_number} connection status: {success}")
                if not success:
                    error_msg = {
                        "type": "error",
                        "message": f"Failed to start reading from device {device_number}"
                    }
                    await websocket.send_text(json.dumps(error_msg))
                    await websocket.close()
                    return
                
                # Set up callback for this device
                setup_device_output_callback(device_number)
            logger.info(f"Started reading from device {device_number} ({device['model']} on {device_port})")
            # Send current output to new connection
            current_output = serial_manager.get_device_output(device_number)
            initial_msg = {
                "type": "serial_output",
                "device_number": device_number,
                "output": current_output,
                "timestamp": datetime.now().isoformat()
            }
            await websocket.send_text(json.dumps(initial_msg))
            
            # Send connection confirmation
            confirm_msg = {
                "type": "connection_established",
                "device_number": device_number,
                "device_info": device,
                "message": f"Connected to device {device_number} ({device['model']} on {device['port']})"
            }
            await websocket.send_text(json.dumps(confirm_msg))
            
            logger.info(f"User {email} connected to device {device_number}")
            
            # Just wait for the WebSocket to be closed by the client
            # The serial data will be sent via the callback mechanism
            try:
                while True:
                    # Wait for close frame or any message from client
                    await websocket.receive()
            except WebSocketDisconnect:
                logger.info(f"Client disconnected from device {device_number}")
            except Exception as e:
                logger.error(f"WebSocket error for device {device_number}: {e}")
                    
        except json.JSONDecodeError:
            error_msg = {
                "type": "error",
                "message": "Invalid JSON in authentication message"
            }
            await websocket.send_text(json.dumps(error_msg))
            await websocket.close()
            return
            
    except WebSocketDisconnect:
        logger.info(f"Client disconnected from device {device_number}")
    except Exception as e:
        logger.error(f"WebSocket error for device {device_number}: {e}")
        try:
            error_msg = {
                "type": "error",
                "message": f"Internal server error: {str(e)}"
            }
            await websocket.send_text(json.dumps(error_msg))
        except:
            pass  # Connection might be already closed
    finally:
        await remove_device_connection(device_number, websocket)
