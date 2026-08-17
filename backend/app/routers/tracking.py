from fastapi import APIRouter, Depends, Body
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.database import get_db
from app.services import tracking_service
from app.core.dependencies import require_role
from app.core.enums import UserRole

router = APIRouter(prefix="/tracking", tags=["tracking"])

@router.post("/update")
async def submit_location_update(
    vehicle_id: UUID = Body(...),
    lat: float = Body(...),
    lon: float = Body(...),
    speed: float = Body(0.0),
    heading: float = Body(0.0),
    trip_id: UUID = Body(None),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_role(UserRole.DRIVER, UserRole.ADMIN))
):
    result = await tracking_service.process_location_update(db, vehicle_id, lat, lon, speed, heading, trip_id)
    
    # Broadcast to websocket
    from app.routers.ws import manager
    await manager.broadcast("fleet/updates", result)
    for alert in result.get("alerts", []):
        await manager.broadcast("alerts", alert)
        
    return result

@router.get("/fleet")
async def get_active_fleet_positions(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_role(UserRole.FLEET_MANAGER, UserRole.ADMIN))
):
    return await tracking_service.get_fleet_positions(db)

@router.get("/vehicle/{id}/history")
async def get_vehicle_history(
    id: UUID,
    trip_id: UUID = None,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_role(UserRole.FLEET_MANAGER, UserRole.ADMIN))
):
    return await tracking_service.get_vehicle_history(db, id, trip_id, limit)
