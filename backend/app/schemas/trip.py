from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from app.core.enums import TripStatus
from app.schemas.shipment import ShipmentResponse
from app.schemas.route import RouteResponse
from app.schemas.vehicle import VehicleResponse

class TripCreate(BaseModel):
    vehicle_id: UUID
    driver_id: UUID
    start_location_id: UUID
    destination_location_id: UUID
    planned_start: Optional[datetime] = None
    shipment_ids: List[UUID]

class TripShipmentResponse(BaseModel):
    shipment_id: UUID
    allocated_quantity: float
    pickup_sequence: int
    shipment: Optional[ShipmentResponse] = None

    class Config:
        from_attributes = True

class TripResponse(BaseModel):
    id: UUID
    vehicle_id: UUID
    driver_id: UUID
    start_location_id: UUID
    destination_location_id: UUID
    planned_start: Optional[datetime]
    actual_start: Optional[datetime]
    estimated_arrival: Optional[datetime]
    actual_arrival: Optional[datetime]
    status: TripStatus

    vehicle_info: Optional[VehicleResponse] = None
    driver_name: Optional[str] = None
    shipments: List[TripShipmentResponse] = []
    route: Optional[RouteResponse] = None

    class Config:
        from_attributes = True
