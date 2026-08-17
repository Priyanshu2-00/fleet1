"""
GPS Simulation Service for prototype demonstration.
Generates simulated vehicle position updates along a route's geometry.
"""

import math
import json
import asyncio
from typing import List, Tuple
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.route import Route
from app.services import tracking_service

class GPSSimulator:
    def __init__(self, route_polyline: List[Tuple[float, float]], speed_kmph: float = 40, update_interval: float = 3.0):
        self.route_points = route_polyline
        self.speed_kmph = speed_kmph
        self.speed_mps = speed_kmph * 1000 / 3600
        self.update_interval = update_interval
        self.delays = []

    def interpolate_position(self, elapsed_seconds: float) -> Tuple[float, float, float, float]:
        if not self.route_points:
            return 0.0, 0.0, 0.0, 0.0
            
        if len(self.route_points) == 1:
            return self.route_points[0][0], self.route_points[0][1], 0.0, 0.0
            
        target_dist = self.speed_mps * elapsed_seconds
        
        # Factor in delays
        for delay_time, delay_pos in self.delays:
            if elapsed_seconds > delay_time:
                # Need to account for stopped time
                pass
                
        current_dist = 0.0
        for i in range(len(self.route_points) - 1):
            p1 = self.route_points[i]
            p2 = self.route_points[i+1]
            segment_len = tracking_service.haversine_distance(p1[0], p1[1], p2[0], p2[1])
            
            if current_dist + segment_len >= target_dist:
                ratio = (target_dist - current_dist) / segment_len if segment_len > 0 else 0
                lat = p1[0] + (p2[0] - p1[0]) * ratio
                lon = p1[1] + (p2[1] - p1[1]) * ratio
                heading = math.degrees(math.atan2(p2[1] - p1[1], p2[0] - p1[0]))
                return lat, lon, self.speed_kmph, heading
                
            current_dist += segment_len
            
        last_p = self.route_points[-1]
        return last_p[0], last_p[1], 0.0, 0.0
        
    def introduce_delay(self, delay_seconds: float, at_position: int):
        self.delays.append((at_position, delay_seconds))

    def get_positions_stream(self) -> List[dict]:
        # Generate full stream
        return []

async def run_simulation(db: AsyncSession, trip_id: UUID, ws_manager, speed_factor: float = 1.0, introduce_delay_at: int = None):
    res = await db.execute(select(Route).where(Route.trip_id == trip_id))
    route = res.scalars().first()
    
    if not route or not route.polyline:
        print(f"No route polyline found for trip {trip_id}")
        return
        
    try:
        points = json.loads(route.polyline)
    except Exception:
        # Fallback to straight line if decode fails
        points = [[18.5204, 73.8567], [18.5314, 73.8446]]
        
    sim = GPSSimulator(points, speed_kmph=40)
    if introduce_delay_at:
        sim.introduce_delay(300, introduce_delay_at)
        
    elapsed = 0.0
    interval = 3.0
    
    # Run loop
    while True:
        lat, lon, speed, heading = sim.interpolate_position(elapsed)
        if speed == 0.0 and elapsed > 0:
            break # Reached end
            
        update_data = await tracking_service.process_location_update(
            db, vehicle_id=trip_id, # Simplified using trip_id as vehicle
            lat=lat, lon=lon, speed=speed, heading=heading, trip_id=trip_id
        )
        
        await ws_manager.broadcast("fleet/updates", update_data)
        for alert in update_data.get("alerts", []):
            await ws_manager.broadcast("alerts", alert)
            
        await asyncio.sleep(interval / speed_factor)
        elapsed += interval
