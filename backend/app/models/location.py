import uuid
from sqlalchemy import Column, String, Float, DateTime
from sqlalchemy.sql import func
from app.database import Base
from app.core.enums import LocationType

class Location(Base):
    __tablename__ = "locations"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    type = Column(String, default=LocationType.FARM)
    address = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
