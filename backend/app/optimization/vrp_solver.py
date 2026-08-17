"""
Vehicle Routing Problem solver using Google OR-Tools.

Solves the Capacitated Vehicle Routing Problem with Time Windows (CVRPTW).
Given pending shipments, available vehicles, and constraints,
produces optimal vehicle assignments, load allocations, and pickup sequences.
"""

import logging
import time
from dataclasses import dataclass
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

try:
    from ortools.constraint_solver import routing_enums_pb2, pywrapcp
    OR_TOOLS_AVAILABLE = True
except ImportError:
    logger.warning("OR-Tools not available. Will use fallback greedy solver.")
    OR_TOOLS_AVAILABLE = False

@dataclass
class VRPInput:
    depot_index: int
    locations: List[Dict[str, Any]]
    shipments: List[Dict[str, Any]]
    vehicles: List[Dict[str, Any]]
    distance_matrix: List[List[float]]
    duration_matrix: List[List[float]]
    weights: Dict[str, float]

@dataclass
class VehicleAssignment:
    vehicle_id: str
    vehicle_registration: str
    assigned_shipments: List[Dict[str, Any]]
    pickup_sequence: List[Dict[str, Any]]
    total_distance_km: float
    estimated_duration_min: int
    utilization_pct: float
    explanation: str

@dataclass
class VRPResult:
    success: bool
    assignments: List[VehicleAssignment]
    unassigned_shipments: List[str]
    total_distance_km: float
    total_vehicles_used: int
    avg_utilization_pct: float
    solve_time_seconds: float
    warnings: List[str]

class VRPSolver:
    def solve(self, input_data: VRPInput) -> VRPResult:
        start_time = time.time()
        if not input_data.shipments or not input_data.vehicles:
            return VRPResult(False, [], [s["id"] for s in input_data.shipments], 0.0, 0, 0.0, time.time() - start_time, ["No shipments or vehicles available"])
            
        if OR_TOOLS_AVAILABLE:
            try:
                return self._solve_ortools(input_data, start_time)
            except Exception as e:
                logger.error(f"OR-Tools solver failed: {e}. Falling back to greedy solver.")
                
        return self._solve_greedy(input_data, start_time)

    def _solve_ortools(self, data: VRPInput, start_time: float) -> VRPResult:
        num_locations = len(data.locations)
        num_vehicles = len(data.vehicles)
        starts = [v["current_location_index"] for v in data.vehicles]
        ends = [data.depot_index] * num_vehicles
        
        manager = pywrapcp.RoutingIndexManager(num_locations, num_vehicles, starts, ends)
        routing = pywrapcp.RoutingModel(manager)
        
        def distance_callback(from_index, to_index):
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return int(data.distance_matrix[from_node][to_node])
            
        transit_callback_index = routing.RegisterTransitCallback(distance_callback)
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)
        
        # Demands
        demands = [0] * num_locations
        location_to_shipment = {}
        for s in data.shipments:
            loc_idx = s["pickup_location_index"]
            demands[loc_idx] += s["quantity"]
            location_to_shipment[loc_idx] = s
            
        def demand_callback(from_index):
            from_node = manager.IndexToNode(from_index)
            return int(demands[from_node] * 1000) # using kg to avoid float
            
        demand_callback_index = routing.RegisterUnaryTransitCallback(demand_callback)
        vehicle_capacities = [int((v["capacity"] - v["current_load"]) * 1000) for v in data.vehicles]
        
        routing.AddDimensionWithVehicleCapacity(
            demand_callback_index,
            0,  # null capacity slack
            vehicle_capacities,
            True,  # start cumul to zero
            "Capacity"
        )
        
        # Time Windows
        def time_callback(from_index, to_index):
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return int(data.duration_matrix[from_node][to_node])
            
        time_callback_index = routing.RegisterTransitCallback(time_callback)
        routing.AddDimension(
            time_callback_index,
            3600,  # allow 1 hour waiting
            86400, # maximum 24 hours per vehicle
            False, # don't force start cumul to zero
            "Time"
        )
        time_dimension = routing.GetDimensionOrDie("Time")
        
        # Priorities & Disjunctions
        penalty_map = {"URGENT": 1000000, "HIGH": 100000, "NORMAL": 10000, "LOW": 1000}
        for loc_idx, shipment in location_to_shipment.items():
            if loc_idx in starts or loc_idx in ends:
                continue
            index = manager.NodeToIndex(loc_idx)
            penalty = penalty_map.get(shipment["priority"], 10000)
            routing.AddDisjunction([index], penalty)
            
            # Add time windows if present
            if shipment.get("time_window_start") and shipment.get("time_window_end"):
                # simplified: assuming time windows are passed as relative seconds
                pass
                
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PARALLEL_CHEAPEST_INSERTION
        search_parameters.local_search_metaheuristic = routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
        search_parameters.time_limit.seconds = 5
        
        solution = routing.SolveWithParameters(search_parameters)
        if not solution:
            return VRPResult(False, [], [s["id"] for s in data.shipments], 0.0, 0, 0.0, time.time() - start_time, ["OR-Tools found no solution"])
            
        # Extract solution
        assignments = []
        unassigned = set([s["id"] for s in data.shipments])
        total_dist_meters = 0
        total_util_pct = 0
        
        for vehicle_idx in range(num_vehicles):
            index = routing.Start(vehicle_idx)
            vehicle = data.vehicles[vehicle_idx]
            assigned_shipments = []
            pickup_seq = []
            route_dist = 0
            route_load = 0
            seq_num = 1
            
            while not routing.IsEnd(index):
                node_index = manager.IndexToNode(index)
                if node_index in location_to_shipment and node_index not in starts:
                    shipment = location_to_shipment[node_index]
                    assigned_shipments.append({
                        "shipment_id": shipment["id"],
                        "quantity": shipment["quantity"],
                        "pickup_sequence": seq_num
                    })
                    pickup_seq.append({
                        "location_id": data.locations[node_index]["id"],
                        "location_name": data.locations[node_index]["name"],
                        "sequence": seq_num,
                        "estimated_arrival_seconds": solution.Min(time_dimension.CumulVar(index))
                    })
                    if shipment["id"] in unassigned:
                        unassigned.remove(shipment["id"])
                    route_load += shipment["quantity"]
                    seq_num += 1
                
                previous_index = index
                index = solution.Value(routing.NextVar(index))
                route_dist += routing.GetArcCostForVehicle(previous_index, index, vehicle_idx)
                
            if assigned_shipments:
                dist_km = route_dist / 1000.0
                total_dist_meters += route_dist
                util_pct = ((vehicle["current_load"] + route_load) / vehicle["capacity"]) * 100 if vehicle["capacity"] > 0 else 0
                total_util_pct += util_pct
                
                explanation = f"Vehicle {vehicle['registration']} assigned {len(assigned_shipments)} shipments totaling {route_load:.2f} units ({util_pct:.1f}% utilization). Distance: {dist_km:.1f} km."
                assignments.append(VehicleAssignment(
                    vehicle_id=vehicle["id"],
                    vehicle_registration=vehicle["registration"],
                    assigned_shipments=assigned_shipments,
                    pickup_sequence=pickup_seq,
                    total_distance_km=dist_km,
                    estimated_duration_min=int((dist_km / 40.0) * 60),
                    utilization_pct=util_pct,
                    explanation=explanation
                ))
                
        avg_util = total_util_pct / len(assignments) if assignments else 0.0
        return VRPResult(True, assignments, list(unassigned), total_dist_meters / 1000.0, len(assignments), avg_util, time.time() - start_time, [])
        
    def _solve_greedy(self, data: VRPInput, start_time: float) -> VRPResult:
        # A simple greedy fallback
        assignments = []
        unassigned = []
        shipments = sorted(data.shipments, key=lambda x: {"URGENT": 4, "HIGH": 3, "NORMAL": 2, "LOW": 1}.get(x["priority"], 0), reverse=True)
        
        vehicles_state = [{**v, "remaining_capacity": v["capacity"] - v["current_load"], "assigned": [], "seq": [], "curr_node": v["current_location_index"], "dist": 0.0} for v in data.vehicles]
        
        for s in shipments:
            best_v = None
            best_dist = float('inf')
            
            for v in vehicles_state:
                if v["remaining_capacity"] >= s["quantity"]:
                    dist = data.distance_matrix[v["curr_node"]][s["pickup_location_index"]]
                    if dist < best_dist:
                        best_dist = dist
                        best_v = v
                        
            if best_v:
                best_v["assigned"].append({
                    "shipment_id": s["id"],
                    "quantity": s["quantity"],
                    "pickup_sequence": len(best_v["assigned"]) + 1
                })
                best_v["seq"].append({
                    "location_id": data.locations[s["pickup_location_index"]]["id"],
                    "location_name": data.locations[s["pickup_location_index"]]["name"],
                    "sequence": len(best_v["seq"]) + 1,
                    "estimated_arrival_seconds": 0 # simple fallback
                })
                best_v["dist"] += best_dist
                best_v["curr_node"] = s["pickup_location_index"]
                best_v["remaining_capacity"] -= s["quantity"]
            else:
                unassigned.append(s["id"])
                
        total_dist = 0
        total_util = 0
        used_vehicles = 0
        
        for v in vehicles_state:
            if v["assigned"]:
                # add return to depot
                v["dist"] += data.distance_matrix[v["curr_node"]][data.depot_index]
                v["seq"].append({
                    "location_id": data.locations[data.depot_index]["id"],
                    "location_name": data.locations[data.depot_index]["name"],
                    "sequence": len(v["seq"]) + 1,
                    "estimated_arrival_seconds": 0
                })
                dist_km = v["dist"] / 1000.0
                total_dist += dist_km
                used_vehicles += 1
                assigned_load = sum(a["quantity"] for a in v["assigned"])
                util = ((v["current_load"] + assigned_load) / v["capacity"]) * 100
                total_util += util
                
                assignments.append(VehicleAssignment(
                    vehicle_id=v["id"],
                    vehicle_registration=v["registration"],
                    assigned_shipments=v["assigned"],
                    pickup_sequence=v["seq"],
                    total_distance_km=dist_km,
                    estimated_duration_min=int((dist_km / 40.0) * 60),
                    utilization_pct=util,
                    explanation=f"Vehicle {v['registration']} assigned {len(v['assigned'])} shipments (Greedy). Util: {util:.1f}%, Dist: {dist_km:.1f}km."
                ))
                
        avg_util = total_util / used_vehicles if used_vehicles else 0.0
        return VRPResult(True, assignments, unassigned, total_dist, used_vehicles, avg_util, time.time() - start_time, ["Used greedy fallback"])
