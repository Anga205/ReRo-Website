"""Authentication routes."""

from fastapi import APIRouter, HTTPException
from core.models import LoginRequest, RegisterRequest
from auth.local_auth import LocalAuthService
import logging

logger = logging.getLogger(__name__)

auth_router = APIRouter(prefix="/auth", tags=["authentication"])

@auth_router.post("/register")
async def register(register_data: RegisterRequest):
    """Register a new user account."""
    try:
        # Validate email format
        if "@" not in register_data.email or "." not in register_data.email:
            raise HTTPException(status_code=400, detail="Invalid email format")
        
        # Validate password length
        if len(register_data.password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters long")
        
        # Create user account
        success = LocalAuthService.create_user(
            register_data.email, 
            register_data.password
        )
        
        if success:
            return {
                "success": True,
                "message": "User account created successfully",
                "email": register_data.email
            }
        else:
            raise HTTPException(status_code=409, detail="Email already exists")
            
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        logger.error(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during registration")

@auth_router.post("/login")
async def login(login_data: LoginRequest):
    """Login endpoint to authenticate users."""
    try:
        profile = LocalAuthService.authenticate_user(
            login_data.email, 
            login_data.password
        )
        
        if profile:
            return {
                "success": True,
                "message": "Login successful",
                "user": {
                    "id": profile.get("id"),
                    "email": profile.get("email"),
                    "created_at": profile.get("created_at"),
                    "last_login": profile.get("last_login")
                }
            }
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
            
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during authentication")
