from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import logging

# Import modular components
from config import setup_logging, CORS_CONFIG, API_CONFIG, SERVER_CONFIG
from routes import router
from websocket_manager import add_connection, remove_connection, send_initial_slots
from websocket_handlers import process_client_message
from models import create_error_response

# Configure logging
setup_logging()
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title=API_CONFIG["title"],
    version=API_CONFIG["version"],
    description=API_CONFIG["description"]
)

# Add CORS middleware
app.add_middleware(CORSMiddleware, **CORS_CONFIG)

# Include HTTP routes
app.include_router(router)

@app.websocket("/slot-booking")
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host=SERVER_CONFIG["host"], 
        port=SERVER_CONFIG["port"], 
        log_level=SERVER_CONFIG["log_level"]
    )