from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from app.database import get_db
from app.schemas.trip import TripResponse
from app.models.trip import Trip
from app.core.dependencies import get_current_user
from app.core.enums import TripStatus, RouteStopStatus
from app.core.exceptions import NotFoundException

router = APIRouter(prefix="/trips", tags=["trips"])

@router.get("", response_model=list[TripResponse])
async def list_trips(db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    result = await db.execute(select(Trip))
    return result.scalars().all()

@router.get("/{id}", response_model=TripResponse)
async def get_trip(id: UUID, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    result = await db.execute(select(Trip).where(Trip.id == id))
    trip = result.scalars().first()
    if not trip:
        raise NotFoundException("Trip not found")
    return trip

@router.patch("/{id}/start", response_model=TripResponse)
async def start_trip(id: UUID, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    result = await db.execute(select(Trip).where(Trip.id == id))
    trip = result.scalars().first()
    if not trip:
        raise NotFoundException("Trip not found")
    trip.status = TripStatus.IN_PROGRESS
    from datetime import datetime
    trip.actual_start = datetime.utcnow()
    await db.commit()
    await db.refresh(trip)
    return trip

@router.patch("/{id}/arrive/{stop_id}", response_model=TripResponse)
async def arrive_at_stop(id: UUID, stop_id: UUID, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    # simple stub logic
    result = await db.execute(select(Trip).where(Trip.id == id))
    trip = result.scalars().first()
    if not trip:
        raise NotFoundException("Trip not found")
    await db.commit()
    return trip

@router.patch("/{id}/pickup/{stop_id}", response_model=TripResponse)
async def confirm_pickup(id: UUID, stop_id: UUID, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    # simple stub logic
    result = await db.execute(select(Trip).where(Trip.id == id))
    trip = result.scalars().first()
    if not trip:
        raise NotFoundException("Trip not found")
    await db.commit()
    return trip

@router.patch("/{id}/complete", response_model=TripResponse)
async def complete_trip(id: UUID, db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    result = await db.execute(select(Trip).where(Trip.id == id))
    trip = result.scalars().first()
    if not trip:
        raise NotFoundException("Trip not found")
    trip.status = TripStatus.COMPLETED
    from datetime import datetime
    trip.actual_arrival = datetime.utcnow()
    await db.commit()
    await db.refresh(trip)
    return trip
