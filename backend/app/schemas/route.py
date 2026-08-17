from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from app.core.enums import RouteStopStatus

from app.schemas.location import LocationResponse

class RouteStopResponse(BaseModel):
    id: UUID
    route_id: UUID
    location_id: UUID
    location: Optional[LocationResponse] = None
    sequence: int
    planned_arrival: Optional[datetime] = None
    actual_arrival: Optional[datetime] = None
    status: RouteStopStatus
    shipment_id: Optional[UUID] = None

    class Config:
        from_attributes = True

class RouteResponse(BaseModel):
    id: UUID
    trip_id: UUID
    total_distance_km: float
    estimated_duration_min: int
    estimated_cost: Optional[float] = None
    optimization_score: Optional[float] = None
    polyline: Optional[str] = None
    stops: List[RouteStopResponse] = []

    class Config:
        from_attributes = True
