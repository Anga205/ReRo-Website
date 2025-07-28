"""Authentication routes."""

from fastapi import APIRouter, HTTPException
from core.models import LoginRequest
from auth.pesu_auth import PESUAuthService
import logging

logger = logging.getLogger(__name__)

auth_router = APIRouter(prefix="/auth", tags=["authentication"])

@auth_router.post("/login")
async def login(login_data: LoginRequest):
    """Login endpoint to authenticate PESU users."""
    try:
        profile = await PESUAuthService.authenticate_user(
            login_data.username, 
            login_data.password
        )
        
        if profile:
            return {
                "success": True,
                "message": "Login successful",
                "user": {
                    "name": profile.get("name"),
                    "srn": profile.get("srn"),
                    "prn": profile.get("prn"),
                    "program": profile.get("program"),
                    "branch": profile.get("branch"),
                    "campus": profile.get("campus")
                }
            }
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
            
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during authentication")
