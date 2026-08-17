import uuid
from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, Text, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from app.core.enums import RouteStopStatus

class Route(Base):
    __tablename__ = "routes"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    trip_id = Column(String(36), ForeignKey("trips.id"), unique=True)
    total_distance_km = Column(Float)
    estimated_duration_min = Column(Integer)
    estimated_cost = Column(Float, nullable=True)
    optimization_score = Column(Float, nullable=True)
    polyline = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    trip = relationship("Trip", back_populates="route")
    stops = relationship("RouteStop", back_populates="route", order_by="RouteStop.sequence")

class RouteStop(Base):
    __tablename__ = "route_stops"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    route_id = Column(String(36), ForeignKey("routes.id"))
    location_id = Column(String(36), ForeignKey("locations.id"))
    sequence = Column(Integer)
    planned_arrival = Column(DateTime(timezone=True), nullable=True)
    actual_arrival = Column(DateTime(timezone=True), nullable=True)
    status = Column(String, default=RouteStopStatus.PENDING)
    shipment_id = Column(String(36), ForeignKey("shipments.id"), nullable=True)

    route = relationship("Route", back_populates="stops")
    location = relationship("Location")
    shipment = relationship("Shipment")
