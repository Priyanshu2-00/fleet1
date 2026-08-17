from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services import analytics_service
from app.core.dependencies import require_role
from app.core.enums import UserRole

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/fleet")
async def fleet_analytics(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_role(UserRole.FLEET_MANAGER, UserRole.ADMIN))
):
    return await analytics_service.get_fleet_analytics(db)

@router.get("/trips")
async def trip_performance(
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_role(UserRole.FLEET_MANAGER, UserRole.ADMIN))
):
    return await analytics_service.get_trip_performance(db, limit)

@router.get("/comparison")
async def comparison_metrics(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_role(UserRole.FLEET_MANAGER, UserRole.ADMIN))
):
    return await analytics_service.get_comparison_metrics(db)

@router.get("/alerts")
async def alerts_statistics(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_role(UserRole.FLEET_MANAGER, UserRole.ADMIN))
):
    from app.services import alert_service
    return await alert_service.get_alert_statistics(db)
