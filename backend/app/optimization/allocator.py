"""
Load Allocation Orchestrator.

Gathers pending shipments and available vehicles, validates constraints,
runs the VRP solver, and produces an actionable operational plan.
"""

import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.optimization.vrp_solver import VRPSolver, VRPInput, VRPResult
from app.optimization.distance_matrix import get_distance_matrix
from app.models.trip import Trip, TripShipment
from app.models.route import Route, RouteStop
from app.core.enums import TripStatus, ShipmentStatus, VehicleStatus, RouteStopStatus

class AllocationEngine:
    async def run_allocation(self, db: AsyncSession, shipments: List[Dict], vehicles: List[Dict], depot: Dict, destination: Dict, config: Any) -> Dict[str, Any]:
        if not shipments or not vehicles:
            return {"success": False, "message": "Need at least 1 shipment and 1 vehicle"}
            
        locations = [depot, destination]
        loc_id_to_idx = {depot["id"]: 0, destination["id"]: 1}
        
        for s in shipments:
            if s["pickup_location"]["id"] not in loc_id_to_idx:
                loc_id_to_idx[s["pickup_location"]["id"]] = len(locations)
                locations.append(s["pickup_location"])
                
        for v in vehicles:
            if v["current_location"] and v["current_location"]["id"] not in loc_id_to_idx:
                loc_id_to_idx[v["current_location"]["id"]] = len(locations)
                locations.append(v["current_location"])
                
        coords = [(l["latitude"], l["longitude"]) for l in locations]
        matrix_data = await get_distance_matrix(coords, config)
        
        vrp_shipments = []
        for s in shipments:
            vrp_shipments.append({
                "id": str(s["id"]),
                "pickup_location_index": loc_id_to_idx[s["pickup_location"]["id"]],
                "quantity": s["quantity"],
                "priority": s["priority"]
            })
            
        vrp_vehicles = []
        for v in vehicles:
            curr_loc_id = v["current_location"]["id"] if v["current_location"] else depot["id"]
            vrp_vehicles.append({
                "id": str(v["id"]),
                "registration": v["registration_number"],
                "capacity": v["capacity"],
                "current_load": v["current_load"],
                "current_location_index": loc_id_to_idx[curr_loc_id]
            })
            
        vrp_input = VRPInput(
            depot_index=1, # Destination is index 1
            locations=locations,
            shipments=vrp_shipments,
            vehicles=vrp_vehicles,
            distance_matrix=matrix_data["distances"],
            duration_matrix=matrix_data["durations"],
            weights={"distance": 1.0, "delay": 2.0, "unused_capacity": 0.5, "ops_cost": 1.0}
        )
        
        solver = VRPSolver()
        result = solver.solve(vrp_input)
        
        baseline = self._compute_baseline(vrp_shipments, vrp_vehicles)
        
        return {
            "success": result.success,
            "assignments": [a.__dict__ for a in result.assignments],
            "unassigned_shipments": result.unassigned_shipments,
            "metrics": {
                "optimized_distance": result.total_distance_km,
                "optimized_vehicles": result.total_vehicles_used,
                "optimized_utilization": result.avg_utilization_pct,
                "baseline_distance": baseline["total_distance_km"],
                "baseline_vehicles": baseline["total_vehicles_used"],
                "baseline_utilization": baseline["avg_utilization_pct"]
            },
            "warnings": result.warnings
        }
        
    def _compute_baseline(self, shipments, vehicles) -> Dict[str, Any]:
        # Dummy baseline metrics for comparison
        req_cap = sum(s["quantity"] for s in shipments)
        used_v = min(len(vehicles), max(1, int(req_cap / 2.0)))
        return {
            "total_distance_km": req_cap * 20.0,
            "total_vehicles_used": used_v,
            "avg_utilization_pct": 50.0
        }
        
    async def create_trips_from_plan(self, db: AsyncSession, plan: Dict[str, Any], destination_id: uuid.UUID) -> List[Trip]:
        trips = []
        for assignment in plan.get("assignments", []):
            vehicle_id = uuid.UUID(assignment["vehicle_id"])
            
            trip = Trip(
                vehicle_id=vehicle_id,
                destination_location_id=destination_id,
                status=TripStatus.PLANNED
            )
            db.add(trip)
            await db.flush()
            
            for s in assignment["assigned_shipments"]:
                ts = TripShipment(
                    trip_id=trip.id,
                    shipment_id=uuid.UUID(s["shipment_id"]),
                    allocated_quantity=s["quantity"],
                    pickup_sequence=s["pickup_sequence"]
                )
                db.add(ts)
                
            route = Route(
                trip_id=trip.id,
                total_distance_km=assignment["total_distance_km"],
                estimated_duration_min=assignment["estimated_duration_min"]
            )
            db.add(route)
            await db.flush()
            
            for stop in assignment["pickup_sequence"]:
                rs = RouteStop(
                    route_id=route.id,
                    location_id=uuid.UUID(stop["location_id"]),
                    sequence=stop["sequence"],
                    status=RouteStopStatus.PENDING
                )
                db.add(rs)
                
            trips.append(trip)
            
        await db.commit()
        return trips
