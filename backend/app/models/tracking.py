import uuid
from sqlalchemy import Column, Float, ForeignKey, DateTime, String
from sqlalchemy.sql import func
from app.database import Base

class LocationUpdate(Base):
    __tablename__ = "location_updates"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    vehicle_id = Column(String(36), ForeignKey("vehicles.id"))
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    speed = Column(Float, nullable=True)
    heading = Column(Float, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    trip_id = Column(String(36), ForeignKey("trips.id"), nullable=True)
