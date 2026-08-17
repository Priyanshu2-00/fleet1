import uuid
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.shipment import Shipment
from app.models.vehicle import Vehicle
from app.models.location import Location
from app.core.enums import ShipmentStatus, VehicleStatus, LocationType

async def get_allocation_data(db: AsyncSession) -> Dict[str, Any]:
    shipments_result = await db.execute(
        select(Shipment, Location)
        .join(Location, Shipment.pickup_location_id == Location.id)
        .where(Shipment.status.in_([ShipmentStatus.REQUESTED, ShipmentStatus.CONFIRMED]))
    )
    
    shipments_data = []
    for s, l in shipments_result.all():
        shipments_data.append({
            "id": str(s.id),
            "quantity": s.quantity,
            "priority": s.priority,
            "pickup_location": {
                "id": str(l.id),
                "name": l.name,
                "latitude": l.latitude,
                "longitude": l.longitude
            }
        })
        
    vehicles_result = await db.execute(
        select(Vehicle)
        .where(Vehicle.status == VehicleStatus.AVAILABLE)
    )
    
    vehicles_data = []
    for v in vehicles_result.scalars().all():
        loc_data = None
        if v.current_location_id:
            loc_result = await db.execute(select(Location).where(Location.id == v.current_location_id))
            loc = loc_result.scalars().first()
            if loc:
                loc_data = {
                    "id": str(loc.id),
                    "name": loc.name,
                    "latitude": loc.latitude,
                    "longitude": loc.longitude
                }
                
        vehicles_data.append({
            "id": str(v.id),
            "registration_number": v.registration_number,
            "capacity": v.capacity,
            "current_load": v.current_load,
            "current_location": loc_data
        })
        
    depot_result = await db.execute(select(Location).where(Location.type == LocationType.DEPOT).limit(1))
    depot_loc = depot_result.scalars().first()
    depot_data = None
    if depot_loc:
        depot_data = {
            "id": str(depot_loc.id),
            "name": depot_loc.name,
            "latitude": depot_loc.latitude,
            "longitude": depot_loc.longitude
        }
        
    return {
        "shipments": shipments_data,
        "vehicles": vehicles_data,
        "depot": depot_data
    }
