from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.core.enums import VehicleStatus

class LocationUpdateCreate(BaseModel):
    vehicle_id: UUID
    latitude: float
    longitude: float
    speed: Optional[float] = None
    heading: Optional[float] = None
    trip_id: Optional[UUID] = None

class LocationUpdateResponse(BaseModel):
    id: UUID
    vehicle_id: UUID
    latitude: float
    longitude: float
    speed: Optional[float]
    heading: Optional[float]
    timestamp: datetime
    trip_id: Optional[UUID]

    class Config:
        from_attributes = True

class FleetPositionResponse(BaseModel):
    vehicle_id: UUID
    registration_number: str
    latitude: float
    longitude: float
    speed: Optional[float]
    heading: Optional[float]
    timestamp: datetime
    status: VehicleStatus
    current_load: float
    capacity: float

    class Config:
        from_attributes = True
