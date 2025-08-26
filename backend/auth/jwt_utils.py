"""JWT utility functions and dependencies for FastAPI authentication."""

import os
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

# Configuration
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "dev-insecure-secret-change-me")
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.environ.get("JWT_EXPIRE_MINUTES", "60"))


def create_access_token(subject: str, additional_claims: Optional[Dict[str, Any]] = None,
                        expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token for a given subject (e.g., user email)."""
    to_encode: Dict[str, Any] = {"sub": subject}
    if additional_claims:
        to_encode.update(additional_claims)

    expire = datetime.now(tz=timezone.utc) + (expires_delta or timedelta(minutes=JWT_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Dict[str, Any]:
    """Decode and validate a JWT, returning its claims if valid."""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


# FastAPI dependency using HTTP Bearer auth
bearer_scheme = HTTPBearer(auto_error=True)


def get_current_user_email(creds: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> str:
    """Dependency to extract and validate JWT, returning the user email (subject)."""
    if creds.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid auth scheme")
    claims = decode_access_token(creds.credentials)
    email = claims.get("sub")
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token claims")
    return email
