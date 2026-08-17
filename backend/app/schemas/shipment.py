from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from app.core.enums import ShipmentStatus, Priority
from app.schemas.location import LocationResponse

class ShipmentCreate(BaseModel):
    farmer_id: Optional[UUID] = None
    pickup_location_id: UUID
    destination_location_id: UUID
    produce_type: str
    quantity: float = Field(gt=0)
    unit: str = "tons"
    priority: Priority = Priority.NORMAL
    pickup_window_start: Optional[datetime] = None
    pickup_window_end: Optional[datetime] = None

class ShipmentUpdate(BaseModel):
    status: Optional[ShipmentStatus] = None
    priority: Optional[Priority] = None

class ShipmentResponse(BaseModel):
    id: UUID
    farmer_id: UUID
    pickup_location_id: UUID
    destination_location_id: UUID
    produce_type: str
    quantity: float
    unit: str
    priority: Priority
    pickup_window_start: Optional[datetime]
    pickup_window_end: Optional[datetime]
    status: ShipmentStatus
    created_at: datetime
    updated_at: Optional[datetime]

    pickup_location: Optional[LocationResponse] = None
    destination_location: Optional[LocationResponse] = None
    farmer_name: Optional[str] = None

    class Config:
        from_attributes = True

class ShipmentListResponse(BaseModel):
    items: List[ShipmentResponse]
    total: int
