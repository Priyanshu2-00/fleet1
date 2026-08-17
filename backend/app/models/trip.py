import uuid
from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from app.core.enums import TripStatus

class TripShipment(Base):
    __tablename__ = "trip_shipments"
    trip_id = Column(String(36), ForeignKey("trips.id"), primary_key=True)
    shipment_id = Column(String(36), ForeignKey("shipments.id"), primary_key=True)
    allocated_quantity = Column(Float)
    pickup_sequence = Column(Integer)

    trip = relationship("Trip", back_populates="shipments")
    shipment = relationship("Shipment", back_populates="trip_shipments")

class Trip(Base):
    __tablename__ = "trips"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    vehicle_id = Column(String(36), ForeignKey("vehicles.id"))
    driver_id = Column(String(36), ForeignKey("drivers.id"))
    start_location_id = Column(String(36), ForeignKey("locations.id"))
    destination_location_id = Column(String(36), ForeignKey("locations.id"))
    planned_start = Column(DateTime(timezone=True), nullable=True)
    actual_start = Column(DateTime(timezone=True), nullable=True)
    estimated_arrival = Column(DateTime(timezone=True), nullable=True)
    actual_arrival = Column(DateTime(timezone=True), nullable=True)
    status = Column(String, default=TripStatus.PLANNED)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    vehicle = relationship("Vehicle", back_populates="trips")
    driver = relationship("Driver")
    start_location = relationship("Location", foreign_keys=[start_location_id])
    destination_location = relationship("Location", foreign_keys=[destination_location_id])
    shipments = relationship("TripShipment", back_populates="trip")
    route = relationship("Route", back_populates="trip", uselist=False)
