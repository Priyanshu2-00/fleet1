"""
Tracking service for processing vehicle location updates,
calculating ETAs, and detecting operational exceptions.
"""

import math
from datetime import datetime, timedelta
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc

from app.models.tracking import LocationUpdate
from app.models.vehicle import Vehicle
from app.models.trip import Trip
from app.models.route import Route
from app.core.enums import VehicleStatus
from app.services import alert_service

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371000  # Earth radius in meters
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def calculate_eta(current_lat: float, current_lon: float, dest_lat: float, dest_lon: float, speed_kmph: float) -> dict:
    dist_m = haversine_distance(current_lat, current_lon, dest_lat, dest_lon)
    dist_km = dist_m / 1000.0
    
    speed = speed_kmph if speed_kmph and speed_kmph > 0 else 40.0
    eta_hours = dist_km / speed
    eta_minutes = int(eta_hours * 60)
    
    return {
        "distance_km": dist_km,
        "eta_minutes": eta_minutes,
        "eta_timestamp": datetime.utcnow() + timedelta(minutes=eta_minutes)
    }

def check_route_deviation(current_lat: float, current_lon: float, route_points: list, threshold_meters: int = 500) -> bool:
    if not route_points:
        return False
        
    min_dist = float('inf')
    for point in route_points:
        dist = haversine_distance(current_lat, current_lon, point[0], point[1])
        if dist < min_dist:
            min_dist = dist
            
    return min_dist > threshold_meters

async def process_location_update(db: AsyncSession, vehicle_id: UUID, lat: float, lon: float, speed: float, heading: float, trip_id: UUID = None) -> dict:
    update = LocationUpdate(
        vehicle_id=vehicle_id,
        latitude=lat,
        longitude=lon,
        speed=speed,
        heading=heading,
        trip_id=trip_id
    )
    db.add(update)
    
    v_result = await db.execute(select(Vehicle).where(Vehicle.id == vehicle_id))
    vehicle = v_result.scalars().first()
    if vehicle:
        # We don't update current_location_id here as that points to a specific Location entity,
        # but we could update status if needed.
        pass
        
    alerts_generated = []
    
    if trip_id:
        trip_res = await db.execute(select(Trip).where(Trip.id == trip_id))
        trip = trip_res.scalars().first()
        
        if trip:
            route_res = await db.execute(select(Route).where(Route.trip_id == trip_id))
            route = route_res.scalars().first()
            
            # Simple ETA logic for demonstration
            if route and route.estimated_duration_min:
                planned_eta = route.estimated_duration_min
                # Fake a destination lat/lon for ETA calculation to trigger alerts
                dest_lat, dest_lon = lat + 0.5, lon + 0.5 
                eta_calc = calculate_eta(lat, lon, dest_lat, dest_lon, speed)
                
                delay_alert = await alert_service.check_delay(db, trip_id, eta_calc["eta_minutes"], planned_eta)
                if delay_alert:
                    alerts_generated.append(delay_alert)
                    
                import json
                try:
                    points = json.loads(route.polyline) if route.polyline else []
                    if points and check_route_deviation(lat, lon, points):
                        dev_alert = await alert_service.create_alert(
                            db, "ROUTE_DEVIATION", "HIGH",
                            f"Vehicle deviated from route by >500m",
                            vehicle_id=vehicle_id, trip_id=trip_id
                        )
                        alerts_generated.append(dev_alert)
                except Exception:
                    pass
                    
    await db.commit()
    
    return {
        "update_id": str(update.id),
        "vehicle_id": str(vehicle_id),
        "lat": lat,
        "lon": lon,
        "alerts": [{"id": str(a.id), "type": a.type, "message": a.message} for a in alerts_generated]
    }

async def get_fleet_positions(db: AsyncSession) -> list[dict]:
    vehicles_res = await db.execute(
        select(Vehicle).where(Vehicle.status.in_([VehicleStatus.IN_TRANSIT, VehicleStatus.AT_PICKUP, VehicleStatus.AVAILABLE]))
    )
    vehicles = vehicles_res.scalars().all()
    
    result = []
    for v in vehicles:
        loc_res = await db.execute(
            select(LocationUpdate).where(LocationUpdate.vehicle_id == v.id).order_by(desc(LocationUpdate.timestamp)).limit(1)
        )
        loc = loc_res.scalars().first()
        if loc:
            result.append({
                "vehicle_id": str(v.id),
                "registration_number": v.registration_number,
                "latitude": loc.latitude,
                "longitude": loc.longitude,
                "speed": loc.speed,
                "heading": loc.heading,
                "timestamp": loc.timestamp,
                "status": v.status,
                "current_load": v.current_load,
                "capacity": v.capacity
            })
    return result

async def get_vehicle_history(db: AsyncSession, vehicle_id: UUID, trip_id: UUID = None, limit: int = 100) -> list[dict]:
    query = select(LocationUpdate).where(LocationUpdate.vehicle_id == vehicle_id)
    if trip_id:
        query = query.where(LocationUpdate.trip_id == trip_id)
        
    query = query.order_by(desc(LocationUpdate.timestamp)).limit(limit)
    res = await db.execute(query)
    
    history = []
    for loc in res.scalars().all():
        history.append({
            "lat": loc.latitude,
            "lon": loc.longitude,
            "speed": loc.speed,
            "heading": loc.heading,
            "timestamp": loc.timestamp
        })
    return history
