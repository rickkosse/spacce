from typing import List, Dict, Optional
from bleak import BleakClient, BleakScanner
from fastapi import FastAPI, WebSocket, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import logging
from pydantic import BaseModel

logging.basicConfig(level=logging.DEBUG)

app = FastAPI(title="BLE API", description="Bluetooth Low Energy API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connection state management
class BLEState:
    def __init__(self):
        self.client: Optional[BleakClient] = None
        self.connected_device: Optional[str] = None

ble_state = BLEState()

class Device(BaseModel):
    name: str
    address: str

@app.get("/devices", response_model=List[Device])
async def get_devices() -> List[Device]:
    """
    Scan for available BLE devices.
    
    Returns:
        List[Device]: List of discovered BLE devices
    """
    try:
        devices = await BleakScanner.discover()
        return [
            Device(name=d.name or "Unknown device", address=d.address) 
            for d in devices
        ]
    except Exception as e:
        logging.error(f"Error scanning devices: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.get("/connect/{address}")
async def connect_device(address: str) -> Dict[str, str]:
    """
    Connect to a BLE device.
    
    Args:
        address (str): Device MAC address
        
    Returns:
        Dict[str, str]: Connection status
    """
    if ble_state.client and ble_state.client.is_connected:
        return {"status": "already_connected", "device": ble_state.connected_device}

    try:
        ble_state.client = BleakClient(address)
        await ble_state.client.connect()

        if ble_state.client.is_connected:
            ble_state.connected_device = address
            logging.info(f"Connected to device: {address}")
            return {"status": "connected", "device": address}
        
        return {"status": "failed"}
    except Exception as e:
        logging.error(f"Error connecting to {address}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.get("/disconnect")
async def disconnect_device() -> Dict[str, str]:
    """
    Disconnect from the currently connected BLE device.
    
    Returns:
        Dict[str, str]: Disconnection status
    """
    if not ble_state.client:
        return {"status": "not_connected"}

    try:
        await ble_state.client.disconnect()
        ble_state.connected_device = None
        ble_state.client = None
        return {"status": "disconnected"}
    except Exception as e:
        logging.error(f"Error disconnecting: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )