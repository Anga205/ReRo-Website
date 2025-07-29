#!/usr/bin/env python3
"""Utility script to validate 24-hour slot configuration and test slot operations."""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.config import SLOT_CONFIG
from core.slot_manager import is_slot_available, get_slot_summary
from database.operations import initialize_database, get_all_slots
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def validate_24_hour_slots():
    """Validate that the 24-hour slot configuration is working correctly."""
    
    print("=== 24-Hour Slot Configuration Validation ===")
    
    # Check configuration
    print(f"Start hour: {SLOT_CONFIG['start_hour']}")
    print(f"End hour: {SLOT_CONFIG['end_hour']}")
    print(f"Total slots expected: {SLOT_CONFIG['end_hour'] - SLOT_CONFIG['start_hour']}")
    
    # Initialize database
    try:
        initialize_database()
        print("✓ Database initialized successfully")
    except Exception as e:
        print(f"✗ Database initialization failed: {e}")
        return False
    
    # Get all slots
    try:
        slots = get_all_slots()
        print(f"✓ Retrieved {len(slots)} slots from database")
        
        if len(slots) != 24:
            print(f"✗ Expected 24 slots, got {len(slots)}")
            return False
        
    except Exception as e:
        print(f"✗ Failed to retrieve slots: {e}")
        return False
    
    # Validate slot IDs and times
    print("\n--- Slot Validation ---")
    for i, slot in enumerate(slots):
        slot_id = slot['id']
        start_time = slot['start_time']
        end_time = slot['end_time']
        
        # Check slot ID is correct
        if slot_id != i:
            print(f"✗ Slot {i}: ID mismatch (expected {i}, got {slot_id})")
            return False
        
        # Check time format
        expected_start = f"{i:02d}:00"
        expected_end = f"{(i + 1) % 24:02d}:00"
        
        if start_time != expected_start:
            print(f"✗ Slot {i}: Start time mismatch (expected {expected_start}, got {start_time})")
            return False
        
        if end_time != expected_end:
            print(f"✗ Slot {i}: End time mismatch (expected {expected_end}, got {end_time})")
            return False
        
        # Show a few examples
        if i < 5 or i > 20:
            print(f"  Slot {slot_id}: {start_time} - {end_time}")
    
    print("✓ All slot times are correctly formatted")
    
    # Test slot availability functions
    print("\n--- Slot Availability Testing ---")
    
    # Test valid slots (0-23)
    valid_slots = [0, 1, 12, 23]
    for slot_id in valid_slots:
        try:
            available = is_slot_available(slot_id)
            print(f"✓ Slot {slot_id}: Available = {available}")
        except Exception as e:
            print(f"✗ Slot {slot_id}: Error checking availability - {e}")
            return False
    
    # Test invalid slots (negative and >= 24)
    invalid_slots = [-1, 24, 25, 100]
    for slot_id in invalid_slots:
        try:
            available = is_slot_available(slot_id)
            if available:
                print(f"✗ Slot {slot_id}: Should be invalid but returned available=True")
                return False
            else:
                print(f"✓ Slot {slot_id}: Correctly identified as invalid")
        except Exception as e:
            print(f"✓ Slot {slot_id}: Correctly rejected with error")
    
    # Test edge cases (midnight transition)
    print("\n--- Edge Case Testing ---")
    midnight_slot = slots[0]  # 00:00-01:00
    late_night_slot = slots[23]  # 23:00-00:00
    
    print(f"Midnight slot (0): {midnight_slot['start_time']} - {midnight_slot['end_time']}")
    print(f"Late night slot (23): {late_night_slot['start_time']} - {late_night_slot['end_time']}")
    
    if late_night_slot['end_time'] != "00:00":
        print(f"✓ Late night slot correctly wraps to 00:00")
    else:
        print(f"✗ Late night slot should end at 00:00")
    
    # Get summary
    print("\n--- Slot Summary ---")
    try:
        summary = get_slot_summary()
        print(f"Total slots: {len(summary['slots'])}")
        print(f"Available slots: {len(summary['available_slots'])}")
        print(f"Booked slots: {len(summary['booked_slots'])}")
        
        if len(summary['available_slots']) + len(summary['booked_slots']) == 24:
            print("✓ Available + Booked slots = 24")
        else:
            print("✗ Available + Booked slots ≠ 24")
            return False
        
    except Exception as e:
        print(f"✗ Failed to get slot summary: {e}")
        return False
    
    print("\n=== All 24-Hour Slot Tests Passed! ===")
    return True

if __name__ == "__main__":
    success = validate_24_hour_slots()
    sys.exit(0 if success else 1)
