from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class FleetAnalytics(BaseModel):
    total_vehicles: int
    active_vehicles: int
    available_vehicles: int
    avg_utilization: float
    total_distance_km: float
    total_trips: int
    completed_trips: int
    delayed_trips: int
    delay_rate: float
    avg_eta_deviation_min: float

class TripPerformance(BaseModel):
    trip_id: UUID
    vehicle_reg: str
    distance_km: float
    planned_duration_min: int
    actual_duration_min: Optional[int]
    utilization_pct: float
    delay_min: float
    status: str

class ComparisonMetrics(BaseModel):
    baseline_distance: float
    optimized_distance: float
    distance_savings_pct: float
    baseline_vehicles: int
    optimized_vehicles: int
    vehicle_savings: int
    baseline_utilization: float
    optimized_utilization: float
