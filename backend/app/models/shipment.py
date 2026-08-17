import uuid
from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from app.core.enums import ShipmentStatus, Priority

class Shipment(Base):
    __tablename__ = "shipments"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    farmer_id = Column(String(36), ForeignKey("farmers.id"))
    pickup_location_id = Column(String(36), ForeignKey("locations.id"))
    destination_location_id = Column(String(36), ForeignKey("locations.id"))
    produce_type = Column(String, nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String, default="tons")
    priority = Column(String, default=Priority.NORMAL)
    pickup_window_start = Column(DateTime(timezone=True), nullable=True)
    pickup_window_end = Column(DateTime(timezone=True), nullable=True)
    status = Column(String, default=ShipmentStatus.REQUESTED)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    farmer = relationship("Farmer", back_populates="shipments")
    pickup_location = relationship("Location", foreign_keys=[pickup_location_id])
    destination_location = relationship("Location", foreign_keys=[destination_location_id])
    trip_shipments = relationship("TripShipment", back_populates="shipment")
