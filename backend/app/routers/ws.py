"""
WebSocket endpoints for real-time fleet tracking, alerts, and shipment updates.
"""

from collections import defaultdict
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.database import get_db
from app.services import tracking_service

router = APIRouter(tags=["websockets"])

class ConnectionManager:
    """Manages WebSocket connections organized by channels/rooms."""
    
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = defaultdict(list)
    
    async def connect(self, websocket: WebSocket, channel: str):
        await websocket.accept()
        self.active_connections[channel].append(websocket)
    
    def disconnect(self, websocket: WebSocket, channel: str):
        if websocket in self.active_connections[channel]:
            self.active_connections[channel].remove(websocket)
    
    async def broadcast(self, channel: str, message: dict):
        for connection in list(self.active_connections[channel]):
            try:
                await connection.send_json(message)
            except Exception:
                self.disconnect(connection, channel)

manager = ConnectionManager()

@router.websocket("/ws/fleet/updates")
async def ws_fleet_updates(websocket: WebSocket):
    channel = "fleet/updates"
    await manager.connect(websocket, channel)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, channel)

@router.websocket("/ws/alerts")
async def ws_alerts(websocket: WebSocket):
    channel = "alerts"
    await manager.connect(websocket, channel)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, channel)

@router.websocket("/ws/shipment/{shipment_id}")
async def ws_shipment(websocket: WebSocket, shipment_id: UUID):
    channel = f"shipment/{shipment_id}"
    await manager.connect(websocket, channel)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, channel)

@router.websocket("/ws/trip/{trip_id}")
async def ws_trip(websocket: WebSocket, trip_id: UUID):
    channel = f"trip/{trip_id}"
    await manager.connect(websocket, channel)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, channel)

@router.websocket("/ws/vehicle/{vehicle_id}/location")
async def ws_vehicle_location(websocket: WebSocket, vehicle_id: UUID, db: AsyncSession = Depends(get_db)):
    channel = f"vehicle/{vehicle_id}"
    await manager.connect(websocket, channel)
    try:
        while True:
            data = await websocket.receive_json()
            
            lat = data.get("lat")
            lon = data.get("lon")
            speed = data.get("speed", 0.0)
            heading = data.get("heading", 0.0)
            trip_id_str = data.get("trip_id")
            trip_id = UUID(trip_id_str) if trip_id_str else None
            
            if lat is not None and lon is not None:
                update_result = await tracking_service.process_location_update(
                    db, vehicle_id, lat, lon, speed, heading, trip_id
                )
                
                await manager.broadcast("fleet/updates", update_result)
                
                alerts = update_result.get("alerts", [])
                for alert in alerts:
                    await manager.broadcast("alerts", alert)
                    
    except WebSocketDisconnect:
        manager.disconnect(websocket, channel)
