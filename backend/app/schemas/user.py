from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from app.schemas.auth import UserResponse
from app.core.enums import DriverAvailability

class FarmerResponse(BaseModel):
    id: UUID
    user_id: UUID
    farm_name: Optional[str] = None
    location_id: Optional[UUID] = None
    contact_info: Optional[str] = None
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True

class DriverResponse(BaseModel):
    id: UUID
    user_id: UUID
    license_number: Optional[str] = None
    assigned_vehicle_id: Optional[UUID] = None
    availability: DriverAvailability
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True
