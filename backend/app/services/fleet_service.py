from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleUpdate
from app.core.enums import VehicleStatus
from app.core.exceptions import NotFoundException, CapacityExceededException

async def create_vehicle(db: AsyncSession, data: VehicleCreate) -> Vehicle:
    vehicle = Vehicle(
        registration_number=data.registration_number,
        vehicle_type=data.vehicle_type,
        capacity=data.capacity,
        capacity_unit=data.capacity_unit,
        current_location_id=data.current_location_id,
        status=VehicleStatus.AVAILABLE
    )
    db.add(vehicle)
    await db.flush()
    await db.refresh(vehicle)
    return vehicle

async def get_vehicles(db: AsyncSession, filters: dict = None) -> list[Vehicle]:
    query = select(Vehicle)
    if filters and "status" in filters:
        query = query.where(Vehicle.status == filters["status"])
    result = await db.execute(query)
    return result.scalars().all()

async def get_vehicle(db: AsyncSession, id: UUID) -> Vehicle:
    result = await db.execute(select(Vehicle).where(Vehicle.id == id))
    vehicle = result.scalars().first()
    if not vehicle:
        raise NotFoundException(f"Vehicle {id} not found")
    return vehicle

async def get_available_vehicles(db: AsyncSession) -> list[Vehicle]:
    query = select(Vehicle).where(Vehicle.status == VehicleStatus.AVAILABLE, Vehicle.current_load < Vehicle.capacity)
    result = await db.execute(query)
    return result.scalars().all()

async def update_vehicle(db: AsyncSession, id: UUID, data: VehicleUpdate) -> Vehicle:
    vehicle = await get_vehicle(db, id)
    if data.status is not None:
        vehicle.status = data.status
    if data.current_load is not None:
        if data.current_load > vehicle.capacity:
            raise CapacityExceededException("Current load cannot exceed capacity")
        vehicle.current_load = data.current_load
    if data.current_location_id is not None:
        vehicle.current_location_id = data.current_location_id
    if data.driver_id is not None:
        vehicle.driver_id = data.driver_id
        
    await db.flush()
    await db.refresh(vehicle)
    return vehicle

def validate_capacity(vehicle: Vehicle, additional_load: float) -> bool:
    return vehicle.current_load + additional_load <= vehicle.capacity
