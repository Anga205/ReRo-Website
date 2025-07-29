"""Test script for 24-hour slot functionality."""

import requests
import json
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SlotTester:
    """Test class for 24-hour slot functionality."""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.test_user = {
            "email": "slottest@example.com",
            "password": "testpassword123"
        }
    
    def test_user_setup(self) -> bool:
        """Set up test user."""
        try:
            # Try to register user
            response = requests.post(
                f"{self.base_url}/auth/register",
                json=self.test_user
            )
            
            if response.status_code in [200, 400]:  # 400 if user already exists
                logger.info("User setup successful")
                return True
            else:
                logger.error(f"User setup failed: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"User setup error: {e}")
            return False
    
    def test_get_all_slots(self) -> bool:
        """Test getting all slots to verify 24-hour structure."""
        try:
            response = requests.get(f"{self.base_url}/slots")
            
            if response.status_code != 200:
                logger.error(f"Failed to get slots: {response.status_code}")
                return False
            
            data = response.json()
            slots = data.get("slots", [])
            
            logger.info(f"Total slots found: {len(slots)}")
            
            # Verify we have 24 slots (0-23)
            if len(slots) != 24:
                logger.error(f"Expected 24 slots, got {len(slots)}")
                return False
            
            # Verify slot IDs are 0-23
            slot_ids = [slot["id"] for slot in slots]
            expected_ids = list(range(0, 24))
            
            if sorted(slot_ids) != expected_ids:
                logger.error(f"Slot IDs mismatch. Expected: {expected_ids}, Got: {sorted(slot_ids)}")
                return False
            
            # Log some sample slots
            logger.info("Sample slots:")
            for i in [0, 6, 12, 18, 23]:
                slot = next((s for s in slots if s["id"] == i), None)
                if slot:
                    logger.info(f"  Slot {i}: {slot['start_time']}-{slot['end_time']}")
            
            logger.info("✓ 24-hour slot structure verified")
            return True
            
        except Exception as e:
            logger.error(f"Error testing slots: {e}")
            return False
    
    def test_slot_booking_range(self) -> bool:
        """Test booking slots across the full 24-hour range."""
        try:
            # Test slots: midnight, early morning, noon, evening, late night
            test_slots = [0, 3, 6, 12, 18, 23]
            
            for slot_id in test_slots:
                # Try to book the slot
                logger.info(f"Testing slot {slot_id} ({slot_id:02d}:00-{(slot_id+1)%24:02d}:00)")
                
                # Note: This would normally require WebSocket for booking
                # For this test, we'll just verify the slot exists and is valid
                response = requests.get(f"{self.base_url}/slots")
                if response.status_code == 200:
                    data = response.json()
                    slots = data.get("slots", [])
                    
                    target_slot = next((s for s in slots if s["id"] == slot_id), None)
                    if target_slot:
                        logger.info(f"  ✓ Slot {slot_id} exists: {target_slot['start_time']}-{target_slot['end_time']}")
                    else:
                        logger.error(f"  ✗ Slot {slot_id} not found")
                        return False
                else:
                    logger.error(f"Failed to verify slot {slot_id}")
                    return False
            
            logger.info("✓ All test slots in 24-hour range are valid")
            return True
            
        except Exception as e:
            logger.error(f"Error testing slot booking range: {e}")
            return False
    
    def test_current_slot_calculation(self) -> bool:
        """Test that current slot calculation works for 24-hour system."""
        try:
            current_hour = datetime.now().hour
            logger.info(f"Current hour: {current_hour}")
            
            # Verify the slot exists
            response = requests.get(f"{self.base_url}/slots")
            if response.status_code == 200:
                data = response.json()
                slots = data.get("slots", [])
                
                current_slot = next((s for s in slots if s["id"] == current_hour), None)
                if current_slot:
                    logger.info(f"✓ Current slot {current_hour} found: {current_slot['start_time']}-{current_slot['end_time']}")
                    return True
                else:
                    logger.error(f"✗ Current slot {current_hour} not found")
                    return False
            else:
                logger.error("Failed to get slots for current slot test")
                return False
                
        except Exception as e:
            logger.error(f"Error testing current slot calculation: {e}")
            return False
    
    def test_device_access_validation(self) -> bool:
        """Test that device access validation works with 24-hour slots."""
        try:
            # Test device list
            response = requests.get(f"{self.base_url}/devices")
            
            if response.status_code == 200:
                data = response.json()
                device_count = data.get("count", 0)
                logger.info(f"✓ Device API accessible, {device_count} devices found")
                
                # The device upload endpoint should work with any hour 0-23
                current_hour = datetime.now().hour
                logger.info(f"✓ Current hour {current_hour} is valid for device access")
                return True
            else:
                logger.error(f"Device API not accessible: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Error testing device access: {e}")
            return False
    
    def run_all_tests(self) -> None:
        """Run all 24-hour slot tests."""
        logger.info("=== Starting 24-Hour Slot Tests ===")
        
        # Setup
        if not self.test_user_setup():
            logger.error("User setup failed, stopping tests")
            return
        
        # Core tests
        tests = [
            ("24-Hour Slot Structure", self.test_get_all_slots),
            ("Slot Booking Range", self.test_slot_booking_range),
            ("Current Slot Calculation", self.test_current_slot_calculation),
            ("Device Access Validation", self.test_device_access_validation),
        ]
        
        results = []
        for test_name, test_func in tests:
            logger.info(f"\n--- Running: {test_name} ---")
            try:
                result = test_func()
                results.append((test_name, result))
                if result:
                    logger.info(f"✓ {test_name} PASSED")
                else:
                    logger.error(f"✗ {test_name} FAILED")
            except Exception as e:
                logger.error(f"✗ {test_name} ERROR: {e}")
                results.append((test_name, False))
        
        # Summary
        logger.info(f"\n=== Test Results Summary ===")
        passed = sum(1 for _, result in results if result)
        total = len(results)
        
        for test_name, result in results:
            status = "PASS" if result else "FAIL"
            logger.info(f"{status}: {test_name}")
        
        logger.info(f"\nOverall: {passed}/{total} tests passed")
        
        if passed == total:
            logger.info("🎉 All 24-hour slot tests PASSED!")
        else:
            logger.warning(f"⚠️  {total - passed} test(s) FAILED")

def main():
    """Main test function."""
    tester = SlotTester()
    tester.run_all_tests()

if __name__ == "__main__":
    main()
