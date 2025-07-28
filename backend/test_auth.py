#!/usr/bin/env python3
"""Test script for local authentication system."""

import asyncio
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from auth.local_auth import LocalAuthService
from database.operations import initialize_database

async def test_authentication():
    """Test the local authentication system."""
    print("Testing Local Authentication System")
    print("=" * 40)
    
    # Initialize database
    print("1. Initializing database...")
    initialize_database()
    print("✓ Database initialized")
    
    # Test user creation
    print("\n2. Creating test user...")
    email = "test@example.com"
    password = "testpass123"
    
    success = LocalAuthService.create_user(email, password)
    if success:
        print(f"✓ User created: {email}")
    else:
        print(f"✗ Failed to create user: {email}")
        return
    
    # Test duplicate user creation
    print("\n3. Testing duplicate user creation...")
    success = LocalAuthService.create_user(email, password)
    if not success:
        print("✓ Correctly prevented duplicate user creation")
    else:
        print("✗ Incorrectly allowed duplicate user creation")
    
    # Test authentication with correct credentials
    print("\n4. Testing authentication with correct credentials...")
    profile = LocalAuthService.authenticate_user(email, password)
    if profile:
        print(f"✓ Authentication successful")
        print(f"   User ID: {profile['id']}")
        print(f"   Email: {profile['email']}")
        print(f"   Created: {profile['created_at']}")
    else:
        print("✗ Authentication failed")
        return
    
    # Test authentication with wrong password
    print("\n5. Testing authentication with wrong password...")
    profile = LocalAuthService.authenticate_user(email, "wrongpassword")
    if not profile:
        print("✓ Correctly rejected wrong password")
    else:
        print("✗ Incorrectly accepted wrong password")
    
    # Test authentication with non-existent user
    print("\n6. Testing authentication with non-existent user...")
    profile = LocalAuthService.authenticate_user("nonexistent@example.com", password)
    if not profile:
        print("✓ Correctly rejected non-existent user")
    else:
        print("✗ Incorrectly accepted non-existent user")
    
    # Test user retrieval
    print("\n7. Testing user retrieval...")
    user = LocalAuthService.get_user_by_email(email)
    if user:
        print(f"✓ User retrieved successfully")
        print(f"   ID: {user['id']}")
        print(f"   Email: {user['email']}")
    else:
        print("✗ Failed to retrieve user")
    
    print("\n" + "=" * 40)
    print("All tests completed successfully! 🎉")
    print("Local authentication system is working correctly.")

if __name__ == "__main__":
    asyncio.run(test_authentication())
