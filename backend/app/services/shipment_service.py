from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from uuid import UUID
from app.models.shipment import Shipment
from app.schemas.shipment import ShipmentCreate
from app.core.enums import ShipmentStatus
from app.core.exceptions import NotFoundException, ValidationException

async def create_shipment(db: AsyncSession, data: ShipmentCreate, farmer_id: UUID) -> Shipment:
    shipment = Shipment(
        farmer_id=farmer_id,
        pickup_location_id=data.pickup_location_id,
        destination_location_id=data.destination_location_id,
        produce_type=data.produce_type,
        quantity=data.quantity,
        unit=data.unit,
        priority=data.priority,
        pickup_window_start=data.pickup_window_start,
        pickup_window_end=data.pickup_window_end,
        status=ShipmentStatus.REQUESTED
    )
    db.add(shipment)
    await db.flush()
    await db.refresh(shipment)
    return shipment

async def get_shipments(db: AsyncSession, filters: dict = None) -> list[Shipment]:
    query = select(Shipment)
    if filters:
        if "farmer_id" in filters:
            query = query.where(Shipment.farmer_id == filters["farmer_id"])
        if "status" in filters:
            query = query.where(Shipment.status == filters["status"])
        if "priority" in filters:
            query = query.where(Shipment.priority == filters["priority"])
    result = await db.execute(query)
    return result.scalars().all()

async def get_shipment(db: AsyncSession, id: UUID) -> Shipment:
    result = await db.execute(select(Shipment).where(Shipment.id == id))
    shipment = result.scalars().first()
    if not shipment:
        raise NotFoundException(f"Shipment {id} not found")
    return shipment

async def update_shipment_status(db: AsyncSession, id: UUID, new_status: ShipmentStatus) -> Shipment:
    shipment = await get_shipment(db, id)
    # Simple validation, actual would check valid transitions
    if shipment.status == ShipmentStatus.CANCELLED or shipment.status == ShipmentStatus.COMPLETED:
        raise ValidationException("Cannot update completed or cancelled shipment")
    
    shipment.status = new_status
    await db.flush()
    await db.refresh(shipment)
    return shipment

async def get_pending_shipments(db: AsyncSession) -> list[Shipment]:
    query = select(Shipment).where(Shipment.status.in_([ShipmentStatus.REQUESTED, ShipmentStatus.CONFIRMED]))
    result = await db.execute(query)
    return result.scalars().all()
