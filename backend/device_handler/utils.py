"""Helper utilities for device management."""

import os
import shutil
import logging
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

class ArduinoBoardConfig:
    """Configuration for Arduino board types."""
    
    BOARD_CONFIGS = {
        "uno": {
            "fqbn": "arduino:avr:uno",
            "description": "Arduino Uno"
        },
        "mega": {
            "fqbn": "arduino:avr:mega",
            "description": "Arduino Mega"
        },
        "esp32": {
            "fqbn": "esp32:esp32:esp32",
            "description": "ESP32"
        }
    }
    
    @classmethod
    def get_fqbn(cls, model: str) -> Optional[str]:
        """Get the Fully Qualified Board Name for a device model."""
        config = cls.BOARD_CONFIGS.get(model)
        return config["fqbn"] if config else None
    
    @classmethod
    def get_supported_boards(cls) -> List[str]:
        """Get list of supported board types."""
        return list(cls.BOARD_CONFIGS.keys())
    
    @classmethod
    def is_supported(cls, model: str) -> bool:
        """Check if a device model is supported."""
        return model in cls.BOARD_CONFIGS

class CodeManager:
    """Manages code compilation and file operations."""
    
    def __init__(self, base_data_dir: str = "./data"):
        self.base_data_dir = base_data_dir
    
    def create_project_directory(self, project_id: str) -> str:
        """Create a project directory and return the path."""
        # Ensure base data directory exists
        if not os.path.exists(self.base_data_dir):
            os.makedirs(self.base_data_dir)
            logger.info(f"Created base data directory: {self.base_data_dir}")
        
        project_dir = os.path.join(self.base_data_dir, project_id)
        
        if not os.path.exists(project_dir):
            os.makedirs(project_dir)
            logger.info(f"Created project directory: {project_dir}")
        
        return project_dir
    
    def save_arduino_sketch(self, code: str, project_dir: str, sketch_name: str) -> str:
        """Save Arduino code to .ino file and return the file path."""
        if not sketch_name.endswith('.ino'):
            sketch_name += '.ino'
        
        file_path = os.path.join(project_dir, sketch_name)
        
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(code)
            logger.info(f"Saved Arduino sketch: {file_path}")
            return file_path
        except Exception as e:
            logger.error(f"Error saving sketch to {file_path}: {e}")
            raise
    
    def cleanup_project(self, project_dir: str) -> bool:
        """Remove project directory and all its contents."""
        try:
            if os.path.exists(project_dir):
                shutil.rmtree(project_dir)
                logger.info(f"Cleaned up project directory: {project_dir}")
                return True
            return False
        except Exception as e:
            logger.error(f"Error cleaning up project {project_dir}: {e}")
            return False

class DeviceValidator:
    """Validates device operations and permissions."""
    
    @staticmethod
    def validate_device_index(device_index: int, device_count: int) -> bool:
        """Validate that device index is within bounds."""
        return 0 <= device_index < device_count
    
    @staticmethod
    def validate_device_model(device_model: str) -> bool:
        """Validate that device model is supported."""
        return ArduinoBoardConfig.is_supported(device_model)
    
    @staticmethod
    def get_device_validation_error(device_index: int, device_count: int, device_model: str) -> Optional[str]:
        """Get validation error message for device, if any."""
        if not DeviceValidator.validate_device_index(device_index, device_count):
            return f"Invalid device index {device_index}. Available devices: 0-{device_count-1}"
        
        if not DeviceValidator.validate_device_model(device_model):
            supported_models = ArduinoBoardConfig.get_supported_boards()
            return f"Unsupported device model '{device_model}'. Supported models: {', '.join(supported_models)}"
        
        return None
