"""Local authentication service using SQLite database."""

import bcrypt
import logging
from typing import Optional, Dict, Any
from database.operations import get_database_connection

logger = logging.getLogger(__name__)

class LocalAuthService:
    """Service for local user authentication using SQLite database."""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password using bcrypt."""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    @staticmethod
    def verify_password(password: str, hashed_password: str) -> bool:
        """Verify a password against its hash."""
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    
    @staticmethod
    def create_user(email: str, password: str) -> bool:
        """
        Create a new user account.
        Returns True if successful, False if email already exists.
        """
        try:
            with get_database_connection() as conn:
                cursor = conn.cursor()
                
                # Check if email already exists
                cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
                if cursor.fetchone():
                    logger.warning(f"Attempt to create user with existing email: {email}")
                    return False
                
                # Hash the password and create user
                hashed_password = LocalAuthService.hash_password(password)
                cursor.execute("""
                    INSERT INTO users (email, password_hash, created_at)
                    VALUES (?, ?, CURRENT_TIMESTAMP)
                """, (email, hashed_password))
                
                conn.commit()
                logger.info(f"Successfully created user account: {email}")
                return True
                
        except Exception as e:
            logger.error(f"Error creating user {email}: {e}")
            return False
    
    @staticmethod
    def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
        """
        Authenticate user with email and password.
        Returns user profile if successful, None if failed.
        """
        try:
            with get_database_connection() as conn:
                cursor = conn.cursor()
                
                # Get user by email
                cursor.execute("""
                    SELECT id, email, password_hash, created_at, last_login
                    FROM users 
                    WHERE email = ?
                """, (email,))
                
                user = cursor.fetchone()
                if not user:
                    logger.warning(f"Authentication failed - user not found: {email}")
                    return None
                
                # Verify password
                if not LocalAuthService.verify_password(password, user["password_hash"]):
                    logger.warning(f"Authentication failed - invalid password: {email}")
                    return None
                
                # Update last login timestamp
                cursor.execute("""
                    UPDATE users 
                    SET last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                """, (user["id"],))
                conn.commit()
                
                # Return user profile (without password hash)
                profile = {
                    "id": user["id"],
                    "email": user["email"],
                    "created_at": user["created_at"],
                    "last_login": user["last_login"]
                }
                
                logger.info(f"Successfully authenticated user: {email}")
                return profile
                
        except Exception as e:
            logger.error(f"Error authenticating user {email}: {e}")
            return None
    
    @staticmethod
    def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
        """Get user profile by email (without password hash)."""
        try:
            with get_database_connection() as conn:
                cursor = conn.cursor()
                
                cursor.execute("""
                    SELECT id, email, created_at, last_login, updated_at
                    FROM users 
                    WHERE email = ?
                """, (email,))
                
                user = cursor.fetchone()
                if user:
                    return {
                        "id": user["id"],
                        "email": user["email"],
                        "created_at": user["created_at"],
                        "last_login": user["last_login"],
                        "updated_at": user["updated_at"]
                    }
                return None
                
        except Exception as e:
            logger.error(f"Error getting user {email}: {e}")
            return None
    
    @staticmethod
    def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
        """Get user profile by ID (without password hash)."""
        try:
            with get_database_connection() as conn:
                cursor = conn.cursor()
                
                cursor.execute("""
                    SELECT id, email, created_at, last_login, updated_at
                    FROM users 
                    WHERE id = ?
                """, (user_id,))
                
                user = cursor.fetchone()
                if user:
                    return {
                        "id": user["id"],
                        "email": user["email"],
                        "created_at": user["created_at"],
                        "last_login": user["last_login"],
                        "updated_at": user["updated_at"]
                    }
                return None
                
        except Exception as e:
            logger.error(f"Error getting user by ID {user_id}: {e}")
            return None

async def validate_user_credentials(email: str, password: str) -> Optional[str]:
    """
    Validate user credentials and return user email if successful.
    Returns None if authentication fails.
    """
    profile = LocalAuthService.authenticate_user(email, password)
    if profile:
        return profile.get("email")
    return None
