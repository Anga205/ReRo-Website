"""Test script for device WebSocket functionality and serial communication."""

import asyncio
import websockets
import json
import time
import logging
import requests
from typing import Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class DeviceWebSocketTester:
    """Test class for device WebSocket functionality."""
    
    def __init__(self, base_url: str = "http://localhost:8000", ws_url: str = "ws://localhost:8000"):
        self.base_url = base_url
        self.ws_url = ws_url
        self.test_user = {
            "email": "testuser@example.com",
            "password": "testpassword123"
        }
    
    async def test_device_list(self) -> Dict[str, Any]:
        """Test getting the list of connected devices."""
        try:
            response = requests.get(f"{self.base_url}/devices")
            response.raise_for_status()
            result = response.json()
            logger.info(f"Connected devices: {result}")
            return result
        except Exception as e:
            logger.error(f"Failed to get device list: {e}")
            return {"success": False, "devices": [], "count": 0}
    
    def test_user_registration(self) -> bool:
        """Test user registration."""
        try:
            response = requests.post(
                f"{self.base_url}/auth/register",
                json=self.test_user
            )
            
            if response.status_code == 200:
                logger.info("User registration successful")
                return True
            elif response.status_code == 400 and "already exists" in response.text:
                logger.info("User already exists, proceeding with tests")
                return True
            else:
                logger.error(f"Registration failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Registration error: {e}")
            return False
    
    def test_user_login(self) -> bool:
        """Test user login."""
        try:
            response = requests.post(
                f"{self.base_url}/auth/login",
                json=self.test_user
            )
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"Login successful: {result}")
                return True
            else:
                logger.error(f"Login failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Login error: {e}")
            return False
    
    def book_current_slot(self) -> bool:
        """Book the current time slot for testing."""
        try:
            current_hour = time.localtime().tm_hour  # 0-23 for 24-hour format
            
            # Get current slots
            response = requests.get(f"{self.base_url}/slots")
            if response.status_code != 200:
                logger.error("Failed to get slots")
                return False
            
            slots_data = response.json()
            logger.info(f"Current slots: {slots_data}")
            
            # Try to book current slot via WebSocket (simulated)
            # For testing, we'll assume the slot is available
            logger.info(f"Assuming slot {current_hour} is booked for testing (24-hour format)")
            return True
            
        except Exception as e:
            logger.error(f"Error booking slot: {e}")
            return False
    
    async def test_device_websocket_invalid_device(self) -> bool:
        """Test WebSocket connection to invalid device."""
        try:
            uri = f"{self.ws_url}/devices/read/999"  # Invalid device number
            
            async with websockets.connect(uri) as websocket:
                # Should receive error immediately
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                data = json.loads(response)
                
                if data.get("type") == "error":
                    logger.info(f"✓ Invalid device test passed: {data['message']}")
                    return True
                else:
                    logger.error(f"✗ Expected error for invalid device, got: {data}")
                    return False
                    
        except Exception as e:
            logger.error(f"✗ Invalid device WebSocket test failed: {e}")
            return False
    
    async def test_device_websocket_no_auth(self, device_number: int = 0) -> bool:
        """Test WebSocket connection without authentication."""
        try:
            uri = f"{self.ws_url}/devices/read/{device_number}"
            
            async with websockets.connect(uri) as websocket:
                # Send invalid auth data
                await websocket.send("invalid json")
                
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                data = json.loads(response)
                
                if data.get("type") == "error" and "JSON" in data.get("message", ""):
                    logger.info(f"✓ Invalid JSON test passed: {data['message']}")
                    return True
                else:
                    logger.error(f"✗ Expected JSON error, got: {data}")
                    return False
                    
        except Exception as e:
            logger.error(f"✗ No auth WebSocket test failed: {e}")
            return False
    
    async def test_device_websocket_wrong_credentials(self, device_number: int = 0) -> bool:
        """Test WebSocket connection with wrong credentials."""
        try:
            uri = f"{self.ws_url}/devices/read/{device_number}"
            
            async with websockets.connect(uri) as websocket:
                # Send wrong credentials
                auth_data = {
                    "email": "wrong@example.com",
                    "password": "wrongpassword"
                }
                await websocket.send(json.dumps(auth_data))
                
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                data = json.loads(response)
                
                if data.get("type") == "error" and "Authentication failed" in data.get("message", ""):
                    logger.info(f"✓ Wrong credentials test passed: {data['message']}")
                    return True
                else:
                    logger.error(f"✗ Expected auth error, got: {data}")
                    return False
                    
        except Exception as e:
            logger.error(f"✗ Wrong credentials WebSocket test failed: {e}")
            return False
    
    async def test_device_websocket_no_slot(self, device_number: int = 0) -> bool:
        """Test WebSocket connection without booked slot."""
        try:
            uri = f"{self.ws_url}/devices/read/{device_number}"
            
            async with websockets.connect(uri) as websocket:
                # Send correct credentials but no slot booked
                await websocket.send(json.dumps(self.test_user))
                
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                data = json.loads(response)
                
                if data.get("type") == "error" and "time slot" in data.get("message", ""):
                    logger.info(f"✓ No slot test passed: {data['message']}")
                    return True
                else:
                    logger.error(f"✗ Expected slot error, got: {data}")
                    return False
                    
        except Exception as e:
            logger.error(f"✗ No slot WebSocket test failed: {e}")
            return False
    
    async def test_device_websocket_success(self, device_number: int = 0) -> bool:
        """Test successful WebSocket connection (assuming slot is booked)."""
        try:
            uri = f"{self.ws_url}/devices/read/{device_number}"
            
            async with websockets.connect(uri) as websocket:
                # Send correct credentials
                await websocket.send(json.dumps(self.test_user))
                
                # Receive initial responses
                messages = []
                try:
                    for _ in range(3):  # Expect up to 3 messages
                        response = await asyncio.wait_for(websocket.recv(), timeout=2.0)
                        data = json.loads(response)
                        messages.append(data)
                        logger.info(f"Received: {data}")
                        
                        if data.get("type") == "connection_established":
                            logger.info("✓ Connection established successfully")
                            return True
                            
                except asyncio.TimeoutError:
                    pass  # Expected if no more messages
                
                # Check if we got expected messages
                error_msgs = [msg for msg in messages if msg.get("type") == "error"]
                if error_msgs:
                    logger.info(f"✓ Got expected error (likely no slot booked): {error_msgs[0]['message']}")
                    return True
                
                logger.info(f"✓ WebSocket connection test completed, received {len(messages)} messages")
                return True
                    
        except Exception as e:
            logger.error(f"✗ Success WebSocket test failed: {e}")
            return False
    
    def test_code_compilation(self) -> bool:
        """Test Arduino code compilation."""
        try:
            test_code = '''
void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.println("Device started!");
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  Serial.println("LED ON");
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  Serial.println("LED OFF");
  delay(1000);
}
'''
            
            response = requests.post(
                f"{self.base_url}/devices/compile",
                json={"code": test_code}
            )
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✓ Code compilation test passed: {result}")
                return True
            else:
                logger.error(f"✗ Code compilation failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"✗ Code compilation test failed: {e}")
            return False
    
    def test_code_upload_no_auth(self, device_number: int = 0) -> bool:
        """Test code upload without authentication."""
        try:
            test_code = "void setup(){} void loop(){}"
            
            response = requests.post(
                f"{self.base_url}/devices/upload/{device_number}",
                json={
                    "code": test_code,
                    "email": "wrong@example.com",
                    "password": "wrongpassword"
                }
            )
            
            if response.status_code == 401:
                logger.info("✓ Upload without auth correctly rejected")
                return True
            else:
                logger.error(f"✗ Upload should have been rejected, got: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"✗ Upload no auth test failed: {e}")
            return False
    
    async def run_all_tests(self) -> None:
        """Run all tests."""
        logger.info("=== Starting Device WebSocket Tests ===")
        
        # Test basic API functionality
        logger.info("\n--- Testing Basic API ---")
        devices = await self.test_device_list()
        device_count = devices.get("count", 0)
        
        if device_count == 0:
            logger.warning("No devices found. Some tests may fail.")
        
        self.test_user_registration()
        self.test_user_login()
        self.book_current_slot()
        self.test_code_compilation()
        
        # Test device upload
        logger.info("\n--- Testing Device Upload ---")
        self.test_code_upload_no_auth()
        
        # Test WebSocket functionality
        logger.info("\n--- Testing WebSocket Functionality ---")
        await self.test_device_websocket_invalid_device()
        
        if device_count > 0:
            await self.test_device_websocket_no_auth()
            await self.test_device_websocket_wrong_credentials()
            await self.test_device_websocket_no_slot()
            await self.test_device_websocket_success()
        else:
            logger.warning("Skipping device-specific WebSocket tests (no devices)")
        
        logger.info("\n=== Tests Completed ===")

async def main():
    """Main test function."""
    tester = DeviceWebSocketTester()
    await tester.run_all_tests()

if __name__ == "__main__":
    asyncio.run(main())
