from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.database import get_db
from app.services import alert_service
from app.core.dependencies import require_role
from app.core.enums import UserRole

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("")
async def list_alerts(
    type: str = None,
    severity: str = None,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_role(UserRole.FLEET_MANAGER, UserRole.ADMIN))
):
    filters = {}
    if type: filters["type"] = type
    if severity: filters["severity"] = severity
    alerts = await alert_service.get_active_alerts(db, filters)
    return alerts

@router.get("/statistics")
async def alert_statistics(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_role(UserRole.FLEET_MANAGER, UserRole.ADMIN))
):
    return await alert_service.get_alert_statistics(db)

@router.get("/{id}")
async def get_alert(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_role(UserRole.FLEET_MANAGER, UserRole.ADMIN))
):
    from sqlalchemy.future import select
    from app.models.alert import Alert
    from app.core.exceptions import NotFoundException
    res = await db.execute(select(Alert).where(Alert.id == id))
    alert = res.scalars().first()
    if not alert:
        raise NotFoundException("Alert not found")
    return alert

@router.patch("/{id}/acknowledge")
async def acknowledge_alert(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_role(UserRole.FLEET_MANAGER, UserRole.ADMIN))
):
    return await alert_service.acknowledge_alert(db, id)

@router.patch("/{id}/resolve")
async def resolve_alert(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_role(UserRole.FLEET_MANAGER, UserRole.ADMIN))
):
    return await alert_service.resolve_alert(db, id)
