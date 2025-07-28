"""Database management for the Slot Booking API."""

import sqlite3
import logging
import os
from typing import List, Set, Optional
from core.config import SLOT_CONFIG

logger = logging.getLogger(__name__)

DATABASE_DIR = "data"
DATABASE_PATH = f"{DATABASE_DIR}/rero.db"

def ensure_database_directory() -> None:
    """Ensure the data directory exists."""
    if not os.path.exists(DATABASE_DIR):
        os.makedirs(DATABASE_DIR)
        logger.info(f"Created database directory: {DATABASE_DIR}")

def get_database_connection() -> sqlite3.Connection:
    """Get a database connection."""
    ensure_database_directory()
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # Enable column access by name
    return conn

def initialize_database() -> None:
    """Initialize the database with the slots table."""
    ensure_database_directory()
    
    with get_database_connection() as conn:
        cursor = conn.cursor()
        
        # Create slots table if it doesn't exist (with new booked_by column)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS slots (
                id INTEGER PRIMARY KEY,
                start_time TEXT NOT NULL,
                end_time TEXT NOT NULL,
                is_booked BOOLEAN DEFAULT FALSE,
                booked_by TEXT DEFAULT NULL,
                booked_at DATETIME DEFAULT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Check if we need to add the booked_by column to existing table
        cursor.execute("PRAGMA table_info(slots)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if "booked_by" not in columns:
            cursor.execute("ALTER TABLE slots ADD COLUMN booked_by TEXT DEFAULT NULL")
            logger.info("Added booked_by column to existing slots table")
        
        # Check if slots are already populated
        cursor.execute("SELECT COUNT(*) FROM slots")
        count = cursor.fetchone()[0]
        
        if count == 0:
            # Populate initial slots
            populate_initial_slots(cursor)
            logger.info("Initialized database with default slots")
        else:
            logger.info(f"Database already contains {count} slots")
        
        conn.commit()

def populate_initial_slots(cursor: sqlite3.Cursor) -> None:
    """Populate the database with initial slot data."""
    slots_data = []
    
    for hour in range(SLOT_CONFIG["start_hour"], SLOT_CONFIG["end_hour"]):
        start_time = f"{hour:02d}:00"
        end_time = f"{(hour + 1):02d}:00"
        slots_data.append((hour, start_time, end_time, False))
    
    cursor.executemany(
        "INSERT INTO slots (id, start_time, end_time, is_booked) VALUES (?, ?, ?, ?)",
        slots_data
    )
    
    logger.info(f"Populated {len(slots_data)} initial slots")

def load_booked_slots() -> Set[int]:
    """Load booked slot IDs from the database."""
    with get_database_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM slots WHERE is_booked = TRUE")
        booked_slots = {row[0] for row in cursor.fetchall()}
        logger.info(f"Loaded {len(booked_slots)} booked slots from database")
        return booked_slots

def get_all_slots() -> List[dict]:
    """Get all slots from the database."""
    with get_database_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, start_time, end_time, is_booked, booked_by, booked_at 
            FROM slots 
            ORDER BY id
        """)
        
        slots = []
        for row in cursor.fetchall():
            slots.append({
                "id": row["id"],
                "start_time": row["start_time"],
                "end_time": row["end_time"],
                "is_booked": bool(row["is_booked"]),
                "booked_by": row["booked_by"],
                "booked_at": row["booked_at"]
            })
        
        return slots

def book_slot_in_db(slot_id: int, booked_by: str) -> bool:
    """Book a slot in the database. Returns True if successful."""
    try:
        with get_database_connection() as conn:
            cursor = conn.cursor()
            
            # Check if slot exists and is available
            cursor.execute(
                "SELECT is_booked FROM slots WHERE id = ?", 
                (slot_id,)
            )
            result = cursor.fetchone()
            
            if result is None:
                logger.warning(f"Slot {slot_id} does not exist")
                return False
            
            if result["is_booked"]:
                logger.warning(f"Slot {slot_id} is already booked")
                return False
            
            # Book the slot
            cursor.execute("""
                UPDATE slots 
                SET is_booked = TRUE, 
                    booked_by = ?,
                    booked_at = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (booked_by, slot_id))
            
            conn.commit()
            logger.info(f"Successfully booked slot {slot_id} by {booked_by} in database")
            return True
            
    except sqlite3.Error as e:
        logger.error(f"Database error while booking slot {slot_id}: {e}")
        return False

def cancel_slot_in_db(slot_id: int, user_srn: Optional[str] = None) -> bool:
    """Cancel a slot booking in the database. Returns True if successful."""
    try:
        with get_database_connection() as conn:
            cursor = conn.cursor()
            
            # Check if slot exists and is booked
            if user_srn:
                cursor.execute(
                    "SELECT is_booked, booked_by FROM slots WHERE id = ?", 
                    (slot_id,)
                )
                result = cursor.fetchone()
                
                if result is None:
                    logger.warning(f"Slot {slot_id} does not exist")
                    return False
                
                if not result["is_booked"]:
                    logger.warning(f"Slot {slot_id} is not booked")
                    return False
                
                if result["booked_by"] != user_srn:
                    logger.warning(f"Slot {slot_id} was not booked by user {user_srn}")
                    return False
            else:
                cursor.execute(
                    "SELECT is_booked FROM slots WHERE id = ?", 
                    (slot_id,)
                )
                result = cursor.fetchone()
                
                if result is None:
                    logger.warning(f"Slot {slot_id} does not exist")
                    return False
                
                if not result["is_booked"]:
                    logger.warning(f"Slot {slot_id} is not booked")
                    return False
            
            # Cancel the booking
            cursor.execute("""
                UPDATE slots 
                SET is_booked = FALSE, 
                    booked_by = NULL,
                    booked_at = NULL,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (slot_id,))
            
            conn.commit()
            logger.info(f"Successfully cancelled slot {slot_id} booking in database")
            return True
            
    except sqlite3.Error as e:
        logger.error(f"Database error while cancelling slot {slot_id}: {e}")
        return False

def is_slot_available_in_db(slot_id: int) -> bool:
    """Check if a slot is available in the database."""
    try:
        with get_database_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT is_booked FROM slots WHERE id = ?", 
                (slot_id,)
            )
            result = cursor.fetchone()
            
            if result is None:
                return False
            
            return not result["is_booked"]
            
    except sqlite3.Error as e:
        logger.error(f"Database error while checking slot {slot_id}: {e}")
        return False

def get_user_bookings(user_srn: str) -> List[dict]:
    """Get all bookings for a specific user."""
    try:
        with get_database_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, start_time, end_time, booked_at 
                FROM slots 
                WHERE booked_by = ? AND is_booked = TRUE
                ORDER BY id
            """, (user_srn,))
            
            bookings = []
            for row in cursor.fetchall():
                bookings.append({
                    "id": row["id"],
                    "start_time": row["start_time"],
                    "end_time": row["end_time"],
                    "booked_at": row["booked_at"]
                })
            
            return bookings
            
    except sqlite3.Error as e:
        logger.error(f"Database error while getting bookings for {user_srn}: {e}")
        return []

def get_database_stats() -> dict:
    """Get database statistics."""
    try:
        with get_database_connection() as conn:
            cursor = conn.cursor()
            
            cursor.execute("SELECT COUNT(*) FROM slots")
            total_slots = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM slots WHERE is_booked = TRUE")
            booked_slots = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM slots WHERE is_booked = FALSE")
            available_slots = cursor.fetchone()[0]
            
            return {
                "total_slots": total_slots,
                "booked_slots": booked_slots,
                "available_slots": available_slots,
                "database_path": DATABASE_PATH
            }
            
    except sqlite3.Error as e:
        logger.error(f"Database error while getting stats: {e}")
        return {
            "total_slots": 0,
            "booked_slots": 0,
            "available_slots": 0,
            "database_path": DATABASE_PATH,
            "error": str(e)
        }
