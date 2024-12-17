import asyncio
from bleak import BleakClient, BleakScanner
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import struct
import logging

logging.basicConfig(level=logging.DEBUG)

app = FastAPI()

# Configureer CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend-URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Globale client voor apparaatbeheer
client = None


@app.get("/devices")
async def get_devices():
    """API-endpoint om beschikbare apparaten te vinden."""
    try:
        devices = await BleakScanner.discover()
        return [{"name": d.name or "Onbekend apparaat", "address": d.address} for d in devices]
    except Exception as e:
        logging.error(f"Fout bij het zoeken naar apparaten: {e}")
        return {"error": str(e)}


@app.get("/connect/{address}")
async def connect_device(address: str):
    """Verbind met een apparaat en houd de verbinding open."""
    global client
    if client and client.is_connected:
        return {"status": "already_connected"}

    try:
        client = BleakClient(address)
        await client.connect()

        if client.is_connected:
            logging.info(f"Verbonden met apparaat: {address}")
            # Toon beschikbare services
            services = await client.get_services()
            for service in services:
                logging.info(f"Service: {service.uuid}")
                for characteristic in service.characteristics:
                    logging.info(f"  Characteristic: {characteristic.uuid} - {characteristic.properties}")
            return {"status": "connected"}
        else:
            logging.warning("Verbinding mislukt.")
            return {"status": "failed"}
    except Exception as e:
        logging.error(f"Fout bij verbinden met {address}: {e}")
        return {"status": "failed", "error": str(e)}


@app.get("/disconnect")
async def disconnect_device():
    """Verbreek de verbinding met het apparaat."""
    global client
    if client and client.is_connected:
        try:
            await client.disconnect()
            logging.info("Verbinding met apparaat verbroken.")
            return {"status": "disconnected"}
        except Exception as e:
            logging.error(f"Fout bij verbreken van verbinding: {e}")
            return {"status": "failed", "error": str(e)}
    else:
        return {"status": "no_device_connected"}


@app.websocket("/ws/data")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket-verbinding voor het streamen van fietsgegevens."""
    await websocket.accept()

    # Controleer of de client verbonden is
    if not client or not client.is_connected:
        logging.warning("Geen verbonden apparaat gevonden.")
        await websocket.send_json({"error": "Geen verbonden apparaat."})
        await websocket.close()
        return

    # Probeer verschillende karakteristieken als fallback
    characteristic_uuids = [
        "00002ad2-0000-1000-8000-00805f9b34fb",  # Indoor Bike Data
        "00002a63-0000-1000-8000-00805f9b34fb",  # Cycling Power Measurement
        "00002a5b-0000-1000-8000-00805f9b34fb"   # CSC Measurement
    ]

    for uuid in characteristic_uuids:
        try:
            logging.info(f"Start notificaties voor {uuid}")
            await client.start_notify(
                uuid,
                lambda _, data: asyncio.create_task(handle_data(data, websocket))
            )
            logging.info(f"Notificaties gestart voor {uuid}")
            break
        except Exception as e:
            logging.warning(f"Fout bij starten notificaties voor {uuid}: {e}")

    # Houd de WebSocket open zolang er gegevens binnenkomen
    try:
        while True:
            await asyncio.sleep(1)
    except Exception as e:
        logging.error(f"WebSocket-fout: {e}")
    finally:
        for uuid in characteristic_uuids:
            try:
                await client.stop_notify(uuid)
                logging.info(f"Notificaties gestopt voor {uuid}")
            except Exception:
                pass
        await websocket.close()
        logging.info("WebSocket gesloten.")

async def handle_data(data, websocket: WebSocket):
    try:
        # Log alle ontvangen bytes
        logging.debug(f"Ontvangen data (hex): {data.hex()}")
        
        # Experimenteer met het uitlezen van de data
        power = struct.unpack_from('<H', data, offset=0)[0]
        cadence = struct.unpack_from('<H', data, offset=2)[0]
        speed_raw = struct.unpack_from('<H', data, offset=4)[0]

        # Snelheid omzetten naar km/h (als dat van toepassing is)
        speed = speed_raw * 0.01

        # Log de geparsede waarden
        logging.debug(f"Parsed - Power: {power}, Cadence: {cadence}, Speed: {speed:.2f}")

        await websocket.send_json({
            "power": power,
            "cadence": cadence,
            "speed": speed
        })
    except Exception as e:
        logging.error(f"Fout bij parsing van data: {e}")
        await websocket.send_json({"error": "Data verwerking fout"})


# Alleen nodig voor directe tests
async def direct_test():
    """Test direct een Bluetooth-verbinding en notificaties."""
    devices = await BleakScanner.discover()
    if not devices:
        logging.warning("Geen apparaten gevonden.")
        return

    address = devices[0]["address"]
    logging.info(f"Verbinding maken met {devices[0]['name']} ({address})")

    async with BleakClient(address) as test_client:
        try:
            await test_client.connect()
            if test_client.is_connected:
                logging.info(f"Verbonden met {devices[0]['name']}")
                characteristic_uuid = "00002ad2-0000-1000-8000-00805f9b34fb"
                await test_client.start_notify(characteristic_uuid, print_data)
                await asyncio.sleep(10)
            else:
                logging.warning("Verbinding mislukt.")
        except Exception as e:
            logging.error(f"Fout bij verbinding of notificaties: {e}")


def print_data(sender, data):
    logging.info(f"Ontvangen data: {data}")
