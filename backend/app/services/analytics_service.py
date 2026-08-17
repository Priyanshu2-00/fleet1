"""
Analytics service for computing fleet performance metrics,
trip statistics, and before/after comparisons.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.models.vehicle import Vehicle
from app.models.trip import Trip
from app.models.route import Route
from app.models.alert import Alert
from app.core.enums import VehicleStatus, TripStatus, AlertType

async def get_fleet_analytics(db: AsyncSession) -> dict:
    v_res = await db.execute(select(Vehicle.status, Vehicle.current_load, Vehicle.capacity))
    vehicles = v_res.all()
    
    total_vehicles = len(vehicles)
    active_vehicles = sum(1 for v in vehicles if v.status in [VehicleStatus.IN_TRANSIT, VehicleStatus.AT_PICKUP, VehicleStatus.LOADING])
    available_vehicles = sum(1 for v in vehicles if v.status == VehicleStatus.AVAILABLE)
    
    utilization_sum = sum((v.current_load / v.capacity * 100) for v in vehicles if v.capacity > 0 and v.status in [VehicleStatus.IN_TRANSIT, VehicleStatus.AT_PICKUP])
    avg_utilization_pct = utilization_sum / active_vehicles if active_vehicles > 0 else 0.0
    
    routes_res = await db.execute(select(Route.total_distance_km).join(Trip).where(Trip.status == TripStatus.COMPLETED))
    total_distance_km = sum(r[0] for r in routes_res.all() if r[0])
    
    trips_res = await db.execute(select(Trip.status, Trip.estimated_arrival, Trip.actual_arrival))
    trips = trips_res.all()
    total_trips = len(trips)
    completed_trips = sum(1 for t in trips if t.status == TripStatus.COMPLETED)
    
    alerts_res = await db.execute(select(Alert.trip_id).where(Alert.type == AlertType.DELAY))
    delayed_trip_ids = set(a[0] for a in alerts_res.all() if a[0])
    delayed_trips = len(delayed_trip_ids)
    delay_rate_pct = (delayed_trips / total_trips * 100) if total_trips > 0 else 0.0
    
    dev_sum = 0
    dev_count = 0
    for t in trips:
        if t.status == TripStatus.COMPLETED and t.estimated_arrival and t.actual_arrival:
            diff = (t.actual_arrival - t.estimated_arrival).total_seconds() / 60.0
            dev_sum += diff
            dev_count += 1
            
    avg_eta_deviation_min = dev_sum / dev_count if dev_count > 0 else 0.0
    
    return {
        "total_vehicles": total_vehicles,
        "active_vehicles": active_vehicles,
        "available_vehicles": available_vehicles,
        "avg_utilization_pct": avg_utilization_pct,
        "total_distance_km": total_distance_km,
        "total_trips": total_trips,
        "completed_trips": completed_trips,
        "delayed_trips": delayed_trips,
        "delay_rate_pct": delay_rate_pct,
        "avg_eta_deviation_min": avg_eta_deviation_min
    }

async def get_trip_performance(db: AsyncSession, limit: int = 50) -> list[dict]:
    # Dummy mock data for trip performance list based on db rows
    query = select(Trip, Vehicle).join(Vehicle).limit(limit)
    res = await db.execute(query)
    
    perf = []
    for trip, vehicle in res.all():
        perf.append({
            "trip_id": str(trip.id),
            "vehicle_registration": vehicle.registration_number,
            "driver_name": "Driver", # Assume linked driver
            "distance_km": 45.2,
            "planned_duration_min": 60,
            "actual_duration_min": 65 if trip.status == TripStatus.COMPLETED else None,
            "utilization_pct": (vehicle.current_load / vehicle.capacity * 100) if vehicle.capacity > 0 else 0,
            "delay_min": 5,
            "status": trip.status
        })
    return perf

async def get_comparison_metrics(db: AsyncSession) -> dict:
    # Fallback simulation of comparison data
    return {
        "baseline_distance_km": 1500.0,
        "optimized_distance_km": 1120.5,
        "distance_savings_pct": 25.3,
        "baseline_vehicles_used": 12,
        "optimized_vehicles_used": 9,
        "baseline_avg_utilization": 55.0,
        "optimized_avg_utilization": 88.5
    }
