"""Serial device manager for reading Arduino output with WebSocket integration."""

import serial
import threading
import time
import logging
from typing import Dict, Optional, List, Callable
from concurrent.futures import ThreadPoolExecutor

logger = logging.getLogger(__name__)

class SerialDeviceManager:
    """Manages serial connections and output reading for multiple devices."""
    
    def __init__(self):
        self.serial_connections: Dict[int, serial.Serial] = {}
        self.serial_outputs: Dict[int, str] = {}
        self.reading_threads: Dict[int, threading.Thread] = {}
        self.stop_flags: Dict[int, threading.Event] = {}
        self.output_callbacks: Dict[int, List[Callable[[str], None]]] = {}
        self.lock = threading.RLock()
        self.executor = ThreadPoolExecutor(max_workers=10)
    
    def start_reading_device(self, device_index: int, port: str, baud_rate: int = 9600) -> bool:
        """Start reading from a serial device."""
        try:
            logger.info(f"Starting reading for device {device_index} on port {port} with baud rate {baud_rate}")
            with self.lock:
                logger.info(f"Acquired lock for device {device_index}")
                # Stop existing connection if any
                self.stop_reading_device(device_index)
                logger.info(f"Stopped any existing reading for device {device_index}")
                # Initialize device data
                self.serial_outputs[device_index] = ""
                self.output_callbacks[device_index] = []
                self.stop_flags[device_index] = threading.Event()
                
                # Create serial connection
                serial_conn = serial.Serial(
                    port=port,
                    baudrate=baud_rate,
                    timeout=1,
                    parity=serial.PARITY_NONE,
                    stopbits=serial.STOPBITS_ONE,
                    bytesize=serial.EIGHTBITS
                )
                
                self.serial_connections[device_index] = serial_conn
                
                # Start reading thread
                logger.info(f"Starting reading thread for device {device_index} on port {port}")
                thread = threading.Thread(
                    target=self._read_serial_loop,
                    args=(device_index, serial_conn),
                    daemon=True
                )
                thread.start()
                self.reading_threads[device_index] = thread
                
                logger.info(f"Started reading from device {device_index} on port {port}")
                return True
                
        except Exception as e:
            logger.error(f"Failed to start reading device {device_index}: {e}")
            return False
    
    def stop_reading_device(self, device_index: int) -> bool:
        """Stop reading from a serial device."""
        thread_to_join = None
        serial_conn_to_close = None
        try:
            with self.lock:
                logger.info(f"Acquired lock to stop reading device {device_index}")
                if device_index not in self.serial_connections:
                    return True # Already stopped or never started

                # Set stop flag
                if device_index in self.stop_flags:
                    self.stop_flags[device_index].set()
                
                # Get connection and thread to handle outside the lock
                serial_conn_to_close = self.serial_connections.pop(device_index, None)
                thread_to_join = self.reading_threads.pop(device_index, None)
                
                # Clear data
                if device_index in self.serial_outputs:
                    self.serial_outputs[device_index] = ""
                
                if device_index in self.output_callbacks:
                    del self.output_callbacks[device_index]
                
                if device_index in self.stop_flags:
                    del self.stop_flags[device_index]

            # Perform blocking operations outside the lock
            if serial_conn_to_close:
                try:
                    serial_conn_to_close.close()
                except Exception as e:
                    logger.warning(f"Error closing serial connection {device_index}: {e}")

            if thread_to_join and thread_to_join.is_alive():
                thread_to_join.join(timeout=2.0)

            logger.info(f"Stopped reading from device {device_index}")
            return True
                
        except Exception as e:
            logger.error(f"Failed to stop reading device {device_index}: {e}")
            return False
    
    def reset_device_output(self, device_index: int) -> None:
        """Reset the serial output for a device."""
        with self.lock:
            self.serial_outputs[device_index] = ""
            logger.info(f"Reset output for device {device_index}")
    
    def get_device_output(self, device_index: int) -> str:
        """Get the current serial output for a device."""
        with self.lock:
            return self.serial_outputs.get(device_index, "")
    
    def add_output_callback(self, device_index: int, callback: Callable[[str], None]) -> None:
        """Add a callback to be called when device output is updated."""
        with self.lock:
            if device_index not in self.output_callbacks:
                self.output_callbacks[device_index] = []
            self.output_callbacks[device_index].append(callback)
    
    def remove_output_callback(self, device_index: int, callback: Callable[[str], None]) -> None:
        """Remove an output callback for a device."""
        with self.lock:
            if device_index in self.output_callbacks:
                try:
                    self.output_callbacks[device_index].remove(callback)
                except ValueError:
                    pass  # Callback not found
    
    def is_device_connected(self, device_index: int) -> bool:
        """Check if a device is currently connected and being read."""
        with self.lock:
            return (device_index in self.serial_connections and 
                    self.serial_connections[device_index].is_open)
    
    def _read_serial_loop(self, device_index: int, serial_conn: serial.Serial) -> None:
        """Main loop for reading serial data from a device."""
        buffer = ""
        
        try:
            while not self.stop_flags[device_index].is_set():
                try:
                    if serial_conn.in_waiting > 0:
                        # Read available data
                        data = serial_conn.read(serial_conn.in_waiting).decode('utf-8', errors='ignore')
                        buffer += data
                        
                        # Process complete lines
                        while '\n' in buffer:
                            line, buffer = buffer.split('\n', 1)
                            line = line.strip()
                            
                            if line:  # Only process non-empty lines
                                self._update_device_output(device_index, line + '\n')
                    
                    # Small delay to prevent excessive CPU usage
                    time.sleep(0.01)
                    
                except serial.SerialException as e:
                    logger.error(f"Serial error for device {device_index}: {e}")
                    break
                except Exception as e:
                    logger.error(f"Unexpected error reading device {device_index}: {e}")
                    break
        
        except Exception as e:
            logger.error(f"Fatal error in serial reading loop for device {device_index}: {e}")
        
        finally:
            logger.info(f"Serial reading loop ended for device {device_index}")
    
    def _update_device_output(self, device_index: int, new_data: str) -> None:
        """Update device output and notify callbacks."""
        try:
            with self.lock:
                # Append new data to output (keep last 10000 characters)
                current_output = self.serial_outputs.get(device_index, "")
                updated_output = (current_output + new_data)[-10000:]
                self.serial_outputs[device_index] = updated_output
                
                # Get callbacks to notify
                callbacks = self.output_callbacks.get(device_index, []).copy()
            
            # Notify callbacks outside of lock to prevent deadlock
            for callback in callbacks:
                try:
                    # Execute callback in thread pool to avoid blocking
                    callback(updated_output)
                except Exception as e:
                    logger.error(f"Error in output callback for device {device_index}: {e}")
                    
        except Exception as e:
            logger.error(f"Error updating device output for device {device_index}: {e}")
    
    def stop_all_devices(self) -> None:
        """Stop reading from all devices."""
        device_indices = list(self.serial_connections.keys())
        for device_index in device_indices:
            self.stop_reading_device(device_index)
        
        # Shutdown executor
        self.executor.shutdown(wait=True)

# Global serial manager instance
serial_manager = SerialDeviceManager()
