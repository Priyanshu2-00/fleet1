from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.database import get_db
from app.schemas.vehicle import VehicleCreate, VehicleResponse, VehicleUpdate, VehicleAvailability
from app.core.dependencies import get_current_user, require_role
from app.core.enums import UserRole, VehicleStatus
from app.models.user import User
from app.services import fleet_service

router = APIRouter(prefix="/vehicles", tags=["vehicles"])

@router.post("", response_model=VehicleResponse)
async def create_vehicle_endpoint(
    request: VehicleCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN, UserRole.FLEET_MANAGER))
):
    vehicle = await fleet_service.create_vehicle(db, request)
    await db.commit()
    return vehicle

@router.get("", response_model=list[VehicleResponse])
async def list_vehicles(
    status: VehicleStatus = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    filters = {"status": status} if status else {}
    return await fleet_service.get_vehicles(db, filters)

@router.get("/available", response_model=list[VehicleAvailability])
async def get_available_vehicles(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.FLEET_MANAGER, UserRole.ADMIN))
):
    vehicles = await fleet_service.get_available_vehicles(db)
    result = []
    for v in vehicles:
        av = VehicleAvailability(
            id=v.id,
            registration_number=v.registration_number,
            capacity=v.capacity,
            current_load=v.current_load,
            remaining_capacity=v.capacity - v.current_load,
            status=v.status,
            current_location=v.current_location
        )
        result.append(av)
    return result

@router.get("/{id}", response_model=VehicleResponse)
async def get_vehicle_endpoint(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await fleet_service.get_vehicle(db, id)

@router.patch("/{id}", response_model=VehicleResponse)
async def update_vehicle_endpoint(
    id: UUID,
    request: VehicleUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.ADMIN, UserRole.FLEET_MANAGER))
):
    vehicle = await fleet_service.update_vehicle(db, id, request)
    await db.commit()
    return vehicle
