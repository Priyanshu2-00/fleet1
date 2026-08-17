import uuid
from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from app.core.enums import VehicleStatus

class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    registration_number = Column(String, unique=True, nullable=False)
    vehicle_type = Column(String, nullable=False)
    capacity = Column(Float, nullable=False)
    capacity_unit = Column(String, default="tons")
    current_load = Column(Float, default=0.0)
    current_location_id = Column(String(36), ForeignKey("locations.id"), nullable=True)
    status = Column(String, default=VehicleStatus.AVAILABLE)
    driver_id = Column(String(36), ForeignKey("drivers.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    current_location = relationship("Location")
    driver = relationship("Driver", back_populates="assigned_vehicle", foreign_keys=[driver_id])
    trips = relationship("Trip", back_populates="vehicle")
