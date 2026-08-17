import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from app.core.enums import UserRole, UserStatus, DriverAvailability

class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, default=UserRole.FARMER)
    status = Column(String, default=UserStatus.ACTIVE)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    farmer_profile = relationship("Farmer", back_populates="user", uselist=False)
    driver_profile = relationship("Driver", back_populates="user", uselist=False)

class Farmer(Base):
    __tablename__ = "farmers"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"))
    farm_name = Column(String)
    location_id = Column(String(36), ForeignKey("locations.id"), nullable=True)
    contact_info = Column(String)

    user = relationship("User", back_populates="farmer_profile")
    location = relationship("Location")
    shipments = relationship("Shipment", back_populates="farmer")

class Driver(Base):
    __tablename__ = "drivers"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"))
    license_number = Column(String)
    assigned_vehicle_id = Column(String(36), ForeignKey("vehicles.id"), nullable=True)
    availability = Column(String, default=DriverAvailability.AVAILABLE)

    user = relationship("User", back_populates="driver_profile")
    assigned_vehicle = relationship("Vehicle", back_populates="driver", foreign_keys=[assigned_vehicle_id])
