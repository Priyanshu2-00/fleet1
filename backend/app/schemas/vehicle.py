from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from app.core.enums import VehicleStatus
from app.schemas.location import LocationResponse

class VehicleCreate(BaseModel):
    registration_number: str
    vehicle_type: str
    capacity: float
    capacity_unit: str = "tons"
    current_location_id: Optional[UUID] = None

class VehicleUpdate(BaseModel):
    status: Optional[VehicleStatus] = None
    current_load: Optional[float] = None
    current_location_id: Optional[UUID] = None
    driver_id: Optional[UUID] = None

class VehicleResponse(BaseModel):
    id: UUID
    registration_number: str
    vehicle_type: str
    capacity: float
    capacity_unit: str
    current_load: float
    current_location_id: Optional[UUID]
    status: VehicleStatus
    driver_id: Optional[UUID]

    current_location: Optional[LocationResponse] = None
    driver_name: Optional[str] = None

    class Config:
        from_attributes = True

class VehicleAvailability(BaseModel):
    id: UUID
    registration_number: str
    capacity: float
    current_load: float
    remaining_capacity: float
    status: VehicleStatus
    current_location: Optional[LocationResponse] = None

    class Config:
        from_attributes = True
