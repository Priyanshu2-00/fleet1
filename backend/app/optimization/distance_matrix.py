"""
OSRM Distance Matrix Client.

Builds NxN distance and duration matrices using the OSRM Table API.
Falls back to Haversine distances if OSRM is unavailable.
"""

import math
import logging
import httpx
from typing import List, Tuple, Dict, Any

logger = logging.getLogger(__name__)

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371000  # Earth radius in meters
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def build_fallback_matrix(coordinates: List[Tuple[float, float]]) -> Dict[str, List[List[float]]]:
    n = len(coordinates)
    dist_matrix = [[0.0] * n for _ in range(n)]
    dur_matrix = [[0.0] * n for _ in range(n)]
    speed_mps = 40.0 * 1000 / 3600  # 40 km/h in m/s
    
    for i in range(n):
        for j in range(n):
            if i != j:
                d = haversine_distance(coordinates[i][0], coordinates[i][1], coordinates[j][0], coordinates[j][1])
                dist_matrix[i][j] = d
                dur_matrix[i][j] = d / speed_mps
                
    return {"distances": dist_matrix, "durations": dur_matrix}

async def get_distance_matrix(coordinates: List[Tuple[float, float]], config: Any) -> Dict[str, List[List[float]]]:
    if not coordinates:
        return {"distances": [], "durations": []}
        
    coords_str = ";".join([f"{lon},{lat}" for lat, lon in coordinates])
    url = f"{config.OSRM_BASE_URL}/table/v1/driving/{coords_str}?annotations=distance,duration"
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            if data.get("code") == "Ok":
                return {"distances": data["distances"], "durations": data["durations"]}
            else:
                logger.warning(f"OSRM returned non-Ok code: {data.get('code')}")
    except Exception as e:
        logger.warning(f"OSRM request failed: {e}. Using fallback Haversine matrix.")
        
    return build_fallback_matrix(coordinates)
