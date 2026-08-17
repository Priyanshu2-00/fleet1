from fastapi import APIRouter, Depends, BackgroundTasks, Body
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.database import get_db
from app.services import simulation_service
from app.routers.ws import manager
from app.core.dependencies import require_role
from app.core.enums import UserRole

router = APIRouter(prefix="/simulation", tags=["simulation"])

@router.post("/start/{trip_id}")
async def start_simulation(
    trip_id: UUID,
    background_tasks: BackgroundTasks,
    speed_factor: float = Body(1.0),
    introduce_delay: bool = Body(False),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_role(UserRole.ADMIN, UserRole.FLEET_MANAGER))
):
    delay_at = 1 if introduce_delay else None
    background_tasks.add_task(
        simulation_service.run_simulation, 
        db, trip_id, manager, speed_factor, delay_at
    )
    return {"message": f"Simulation started for trip {trip_id}"}
