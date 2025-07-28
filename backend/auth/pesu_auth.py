"""PESU authentication service using external API."""

import httpx
import logging
from typing import Optional, Dict, Any
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

# In-memory cache for login details
login_cache: Dict[str, Dict[str, Any]] = {}
CACHE_DURATION_MINUTES = 30

class PESUAuthService:
    """Service for authenticating PESU users."""
    
    PESU_AUTH_URL = "http://localhost:5000/authenticate"
    
    @staticmethod
    async def authenticate_user(username: str, password: str) -> Optional[Dict[str, Any]]:
        """
        Authenticate user with PESU API.
        Returns user profile if successful, None if failed.
        """
        try:
            # Check cache first
            cached_data = PESUAuthService._get_from_cache(username, password)
            if cached_data:
                logger.info(f"Using cached authentication for user: {username}")
                return cached_data
            
            # Make API request
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    PESUAuthService.PESU_AUTH_URL,
                    json={
                        "username": username,
                        "password": password,
                        "profile": True
                    },
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("status") and "profile" in data:
                        # Cache the successful authentication
                        PESUAuthService._store_in_cache(username, password, data["profile"])
                        logger.info(f"Successfully authenticated user: {username}")
                        return data["profile"]
                    else:
                        logger.warning(f"Authentication failed for user: {username}")
                        return None
                else:
                    logger.error(f"PESU API returned status {response.status_code} for user: {username}")
                    return None
                    
        except httpx.TimeoutException:
            logger.error(f"Timeout while authenticating user: {username}")
            return None
        except Exception as e:
            logger.error(f"Error authenticating user {username}: {e}")
            return None
    
    @staticmethod
    def _get_cache_key(username: str, password: str) -> str:
        """Generate cache key for user credentials."""
        import hashlib
        key_data = f"{username}:{password}"
        return hashlib.sha256(key_data.encode()).hexdigest()
    
    @staticmethod
    def _get_from_cache(username: str, password: str) -> Optional[Dict[str, Any]]:
        """Get user data from cache if valid."""
        cache_key = PESUAuthService._get_cache_key(username, password)
        
        if cache_key in login_cache:
            cached_data = login_cache[cache_key]
            cache_time = cached_data["cached_at"]
            
            # Check if cache is still valid
            if datetime.now() - cache_time < timedelta(minutes=CACHE_DURATION_MINUTES):
                return cached_data["profile"]
            else:
                # Remove expired cache entry
                del login_cache[cache_key]
        
        return None
    
    @staticmethod
    def _store_in_cache(username: str, password: str, profile: Dict[str, Any]) -> None:
        """Store user profile in cache."""
        cache_key = PESUAuthService._get_cache_key(username, password)
        login_cache[cache_key] = {
            "profile": profile,
            "cached_at": datetime.now()
        }
        
        # Clean up old cache entries (simple cleanup)
        PESUAuthService._cleanup_cache()
    
    @staticmethod
    def _cleanup_cache() -> None:
        """Remove expired entries from cache."""
        current_time = datetime.now()
        expired_keys = []
        
        for key, data in login_cache.items():
            if current_time - data["cached_at"] >= timedelta(minutes=CACHE_DURATION_MINUTES):
                expired_keys.append(key)
        
        for key in expired_keys:
            del login_cache[key]
        
        if expired_keys:
            logger.info(f"Cleaned up {len(expired_keys)} expired cache entries")

async def validate_user_credentials(username: str, password: str) -> Optional[str]:
    """
    Validate user credentials and return SRN if successful.
    Returns None if authentication fails.
    """
    profile = await PESUAuthService.authenticate_user(username, password)
    if profile:
        return profile.get("srn")
    return None
