from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any, Optional
import uuid

from app.database import get_db
from app.core.dependencies import require_role
from app.core.enums import UserRole
from app.services.allocation_service import get_allocation_data
from app.optimization.allocator import AllocationEngine
from app.optimization.reoptimizer import ReOptimizer
from app.config import settings

router = APIRouter(prefix="/optimize", tags=["optimization"])

engine = AllocationEngine()
reopt = ReOptimizer()

@router.post("/allocate")
async def allocate(
    destination_id: Optional[uuid.UUID] = Body(None),
    weights: Optional[Dict[str, float]] = Body(None),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_role(UserRole.FLEET_MANAGER, UserRole.ADMIN))
):
    data = await get_allocation_data(db)
    if not data["depot"]:
        raise HTTPException(status_code=400, detail="No depot found in system")
        
    destination = data["depot"]
    if destination_id:
        from app.models.location import Location
        from sqlalchemy.future import select
        dest_result = await db.execute(select(Location).where(Location.id == destination_id))
        dest_loc = dest_result.scalars().first()
        if dest_loc:
            destination = {
                "id": str(dest_loc.id),
                "name": dest_loc.name,
                "latitude": dest_loc.latitude,
                "longitude": dest_loc.longitude
            }
            
    plan = await engine.run_allocation(
        db, 
        data["shipments"], 
        data["vehicles"], 
        data["depot"], 
        destination, 
        settings
    )
    return plan

@router.post("/allocate/accept")
async def accept_allocation(
    plan: Dict[str, Any] = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_role(UserRole.FLEET_MANAGER, UserRole.ADMIN))
):
    # For simplicity, assuming destination_id is in the first assignment's stop sequence
    destination_id = uuid.UUID(plan["assignments"][0]["pickup_sequence"][-1]["location_id"]) if plan.get("assignments") and plan["assignments"][0].get("pickup_sequence") else None
    
    if not destination_id:
        raise HTTPException(status_code=400, detail="Invalid plan structure")
        
    trips = await engine.create_trips_from_plan(db, plan, destination_id)
    return {"message": "Trips created successfully", "trip_count": len(trips)}

@router.post("/reoptimize/{trip_id}")
async def reoptimize_trip(
    trip_id: uuid.UUID,
    current_lat: float = Body(...),
    current_lon: float = Body(...),
    reason: Optional[str] = Body(None),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_role(UserRole.FLEET_MANAGER, UserRole.ADMIN))
):
    result = await reopt.reoptimize_trip(db, trip_id, current_lat, current_lon, settings)
    return result

@router.get("/comparison")
async def get_comparison():
    # Return dummy data for last comparison
    return {
        "baseline_distance": 120.5,
        "optimized_distance": 85.2,
        "distance_savings_pct": 29.3,
        "baseline_vehicles": 4,
        "optimized_vehicles": 3,
        "vehicle_savings": 1,
        "baseline_utilization": 45.0,
        "optimized_utilization": 82.5
    }
