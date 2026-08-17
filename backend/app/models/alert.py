import uuid
from sqlalchemy import Column, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base
from app.core.enums import AlertType, AlertSeverity, AlertStatus

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    vehicle_id = Column(String(36), ForeignKey("vehicles.id"), nullable=True)
    shipment_id = Column(String(36), ForeignKey("shipments.id"), nullable=True)
    trip_id = Column(String(36), ForeignKey("trips.id"), nullable=True)
    type = Column(String, default=AlertType.DELAY)
    severity = Column(String, default=AlertSeverity.MEDIUM)
    message = Column(Text)
    metadata_ = Column("metadata", JSON, nullable=True)
    status = Column(String, default=AlertStatus.ACTIVE)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)
