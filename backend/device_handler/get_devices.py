import serial.tools.list_ports

def detect_serial_devices():
    known_devices = {
        "2341:0043": "uno",     # Official Arduino Uno
        "2341:0010": "mega",    # Official Arduino Mega
        "2341:0243": "uno",     # Uno R3
        "2341:0042": "mega",    # Mega 2560 R3
        "1a86:7523": "uno",     # CH340 - usually Uno/Mega
        "1a86:55d4": "esp32",   # CH9102 - newer ESP32 clones
        "10c4:ea60": "esp32",   # CP2102
        "10c4:ea70": "esp32",   # CP2105 dual UART
        "0403:6001": "esp32",   # FTDI - NodeMCU, etc.
        "303a:1001": "esp32",   # ESP32-S2 native USB
    }

    devices = []

    ports = serial.tools.list_ports.comports()
    for port in ports:
        vid = f"{port.vid:04x}" if port.vid else None
        pid = f"{port.pid:04x}" if port.pid else None
        key = f"{vid}:{pid}" if vid and pid else None

        model = known_devices.get(key, "unknown")

        device_info = {
            "model": model,
            "port": port.device,
            "description": port.description,
            "manufacturer": port.manufacturer,
            "serial_number": port.serial_number,
            "vid": vid,
            "pid": pid,
        }

        devices.append(device_info)

    return devices

# Initialize connected devices when module is imported
connected_devices = detect_serial_devices()