from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from app.database import get_db
from app.schemas.location import LocationCreate, LocationResponse
from app.core.enums import LocationType
from app.models.location import Location
from app.core.dependencies import require_role
from app.core.enums import UserRole
from app.core.exceptions import NotFoundException

router = APIRouter(prefix="/locations", tags=["locations"])

@router.post("", response_model=LocationResponse)
async def create_location(
    request: LocationCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_role(UserRole.ADMIN, UserRole.FLEET_MANAGER))
):
    location = Location(**request.model_dump())
    db.add(location)
    await db.commit()
    await db.refresh(location)
    return location

@router.get("", response_model=list[LocationResponse])
async def list_locations(
    type: LocationType = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Location)
    if type:
        query = query.where(Location.type == type)
    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{id}", response_model=LocationResponse)
async def get_location(id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Location).where(Location.id == id))
    location = result.scalars().first()
    if not location:
        raise NotFoundException("Location not found")
    return location
