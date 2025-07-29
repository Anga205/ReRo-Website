"""Device management routes for Arduino code compilation and upload."""

import uuid
import subprocess
import logging
from typing import Dict, Any
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from device_handler.get_devices import connected_devices, detect_serial_devices
from device_handler.utils import ArduinoBoardConfig, CodeManager, DeviceValidator
from device_handler.serial_manager import serial_manager
from auth.local_auth import LocalAuthService
from database.operations import get_database_connection

logger = logging.getLogger(__name__)

devices_router = APIRouter(prefix="/devices", tags=["devices"])
code_manager = CodeManager()

class CodeUploadRequest(BaseModel):
    code: str
    email: str
    password: str

class CodeCompileRequest(BaseModel):
    code: str

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

def authenticate_user_for_upload(email: str, password: str) -> bool:
    """Authenticate user for code upload."""
    user_profile = LocalAuthService.authenticate_user(email, password)
    return user_profile is not None

def compile_arduino_code(code: str, board_model: str, project_id: str) -> Dict[str, Any]:
    """Compile Arduino code for a specific board."""
    project_dir = None
    
    try:
        # Create project and save code
        project_dir = code_manager.create_project_directory(project_id)
        sketch_path = code_manager.save_arduino_sketch(code, project_dir, project_id)
        
        # Get board configuration
        fqbn = ArduinoBoardConfig.get_fqbn(board_model)
        if not fqbn:
            return {
                "success": False,
                "stdout": "",
                "stderr": f"Unsupported board model: {board_model}"
            }
        
        # Compile code
        result = subprocess.run(
            ["arduino-cli", "compile", "--fqbn", fqbn, sketch_path],
            capture_output=True,
            text=True,
            check=False,
            timeout=30
        )
        
        return {
            "success": result.returncode == 0,
            "stdout": result.stdout,
            "stderr": result.stderr
        }
        
    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "stdout": "",
            "stderr": "Compilation timeout (30 seconds)"
        }
    except Exception as e:
        return {
            "success": False,
            "stdout": "",
            "stderr": f"Compilation error: {str(e)}"
        }
    finally:
        if project_dir:
            code_manager.cleanup_project(project_dir)

def upload_arduino_code(code: str, device_port: str, board_model: str, project_id: str) -> Dict[str, Any]:
    """Upload Arduino code to a device."""
    project_dir = None
    
    try:
        # Create project and save code
        project_dir = code_manager.create_project_directory(project_id)
        sketch_path = code_manager.save_arduino_sketch(code, project_dir, project_id)
        
        # Get board configuration
        fqbn = ArduinoBoardConfig.get_fqbn(board_model)
        if not fqbn:
            return {
                "success": False,
                "compile_output": "",
                "upload_output": "",
                "error": f"Unsupported board model: {board_model}"
            }
        
        # Compile first
        compile_result = subprocess.run(
            ["arduino-cli", "compile", "--fqbn", fqbn, sketch_path],
            capture_output=True,
            text=True,
            check=False,
            timeout=30
        )
        
        if compile_result.returncode != 0:
            return {
                "success": False,
                "compile_output": compile_result.stdout,
                "upload_output": "",
                "error": "Compilation failed"
            }
        
        # Upload code
        upload_result = subprocess.run(
            ["arduino-cli", "upload", "-p", device_port, "--fqbn", fqbn, sketch_path],
            capture_output=True,
            text=True,
            check=False,
            timeout=60
        )
        
        return {
            "success": upload_result.returncode == 0,
            "compile_output": compile_result.stdout,
            "upload_output": upload_result.stdout if upload_result.returncode == 0 else upload_result.stderr,
            "error": None if upload_result.returncode == 0 else "Upload failed"
        }
        
    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "compile_output": "",
            "upload_output": "",
            "error": "Upload timeout"
        }
    except Exception as e:
        return {
            "success": False,
            "compile_output": "",
            "upload_output": "",
            "error": f"Upload error: {str(e)}"
        }
    finally:
        if project_dir:
            code_manager.cleanup_project(project_dir)

@devices_router.get("")
async def get_devices():
    """Get all connected Arduino devices."""
    try:
        # Refresh the device list
        global connected_devices
        connected_devices = detect_serial_devices()
        
        return {
            "success": True,
            "devices": connected_devices,
            "count": len(connected_devices),
            "supported_models": ArduinoBoardConfig.get_supported_boards()
        }
    except Exception as e:
        logger.error(f"Error getting devices: {e}")
        raise HTTPException(status_code=500, detail="Failed to get connected devices")

@devices_router.post("/compile")
async def compile_code(request: CodeCompileRequest):
    """Compile Arduino code to check if it's valid."""
    project_id = str(uuid.uuid4())
    
    try:
        # Try compilation for different board types
        compile_results = {}
        supported_boards = ArduinoBoardConfig.get_supported_boards()
        
        for board in supported_boards:
            compile_results[board] = compile_arduino_code(request.code, board, f"{project_id}_{board}")
            
            # If compilation succeeds for any board, we consider it valid
            if compile_results[board]["success"]:
                break
        
        # Check if any compilation succeeded
        any_success = any(result["success"] for result in compile_results.values())
        
        return {
            "success": any_success,
            "compile_results": compile_results,
            "message": "Code compiled successfully" if any_success else "Code compilation failed",
            "project_id": project_id
        }
        
    except Exception as e:
        logger.error(f"Error compiling code: {e}")
        raise HTTPException(status_code=500, detail=f"Compilation failed: {str(e)}")

@devices_router.post("/upload/{device_number}")
async def upload_code(device_number: int, request: CodeUploadRequest):
    """Upload Arduino code to a specific device."""
    project_id = str(uuid.uuid4())
    
    try:
        # Authenticate user
        if not authenticate_user_for_upload(request.email, request.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Check if user has booked the current time slot
        current_slot = get_current_time_slot()
        if not is_user_slot_booked(request.email, current_slot):
            # Format time display properly for 24-hour format
            end_hour = (current_slot + 1) % 24
            raise HTTPException(
                status_code=403, 
                detail=f"You must have booked the current time slot ({current_slot:02d}:00-{end_hour:02d}:00) to upload code"
            )
        
        # Refresh device list and validate device number
        global connected_devices
        connected_devices = detect_serial_devices()
        
        validation_error = DeviceValidator.get_device_validation_error(
            device_number, len(connected_devices), 
            connected_devices[device_number]["model"] if device_number < len(connected_devices) else "unknown"
        )
        
        if validation_error:
            raise HTTPException(status_code=400, detail=validation_error)
        
        device = connected_devices[device_number]
        device_model = device["model"]
        device_port = device["port"]
        
        # Stop serial reading for this device (only one process can access serial port)
        serial_manager.stop_reading_device(device_number)
        serial_manager.reset_device_output(device_number)
        
        # Upload code to device
        upload_result = upload_arduino_code(request.code, device_port, device_model, project_id)
        
        if upload_result["success"]:
            return {
                "success": True,
                "message": f"Code uploaded successfully to {device_model} on {device_port}",
                "device": device,
                "compile_output": upload_result["compile_output"],
                "upload_output": upload_result["upload_output"],
                "project_id": project_id
            }
        else:
            return {
                "success": False,
                "message": upload_result["error"],
                "device": device,
                "compile_output": upload_result["compile_output"],
                "upload_output": upload_result["upload_output"],
                "project_id": project_id
            }
            
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail="Upload operation timed out")
    except Exception as e:
        logger.error(f"Error uploading code: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
