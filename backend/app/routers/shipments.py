from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
from app.database import get_db
from app.schemas.shipment import ShipmentCreate, ShipmentResponse, ShipmentListResponse, ShipmentUpdate
from app.core.dependencies import get_current_user, require_role
from app.core.enums import UserRole, ShipmentStatus
from app.models.user import User, Farmer
from app.services import shipment_service

router = APIRouter(prefix="/shipments", tags=["shipments"])

@router.post("", response_model=ShipmentResponse)
async def create_shipment_endpoint(
    request: ShipmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.FARMER, UserRole.ADMIN))
):
    farmer_id = request.farmer_id
    if current_user.role == UserRole.FARMER:
        result = await db.execute(select(Farmer).where(Farmer.user_id == current_user.id))
        farmer = result.scalars().first()
        farmer_id = farmer.id
    
    shipment = await shipment_service.create_shipment(db, request, farmer_id)
    await db.commit()
    return shipment

@router.get("", response_model=ShipmentListResponse)
async def list_shipments(
    status: ShipmentStatus = None,
    priority: str = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    filters = {}
    if status:
        filters["status"] = status
    if priority:
        filters["priority"] = priority
        
    if current_user.role == UserRole.FARMER:
        result = await db.execute(select(Farmer).where(Farmer.user_id == current_user.id))
        farmer = result.scalars().first()
        filters["farmer_id"] = farmer.id
        
    shipments = await shipment_service.get_shipments(db, filters)
    return {"items": shipments, "total": len(shipments)}

@router.get("/pending", response_model=list[ShipmentResponse])
async def get_pending_shipments(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.FLEET_MANAGER, UserRole.ADMIN))
):
    return await shipment_service.get_pending_shipments(db)

@router.get("/{id}", response_model=ShipmentResponse)
async def get_shipment_endpoint(id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await shipment_service.get_shipment(db, id)

@router.patch("/{id}/status", response_model=ShipmentResponse)
async def update_shipment_status(
    id: UUID,
    status_update: ShipmentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.FLEET_MANAGER, UserRole.ADMIN))
):
    shipment = await shipment_service.update_shipment_status(db, id, status_update.status)
    await db.commit()
    return shipment
