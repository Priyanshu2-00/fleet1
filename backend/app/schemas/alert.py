from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID
from app.core.enums import AlertType, AlertSeverity, AlertStatus

class AlertResponse(BaseModel):
    id: UUID
    vehicle_id: Optional[UUID]
    shipment_id: Optional[UUID]
    trip_id: Optional[UUID]
    type: AlertType
    severity: AlertSeverity
    message: str
    metadata_: Optional[Dict[str, Any]] = None
    status: AlertStatus
    created_at: datetime
    resolved_at: Optional[datetime]

    class Config:
        from_attributes = True

class AlertUpdate(BaseModel):
    status: AlertStatus
