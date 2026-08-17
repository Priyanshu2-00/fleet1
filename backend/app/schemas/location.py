from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from app.core.enums import LocationType

class LocationCreate(BaseModel):
    name: str
    latitude: float
    longitude: float
    type: LocationType
    address: Optional[str] = None

class LocationResponse(BaseModel):
    id: UUID
    name: str
    latitude: float
    longitude: float
    type: LocationType
    address: Optional[str] = None

    class Config:
        from_attributes = True
