"""
Alert and exception detection service.
Monitors fleet operations and generates alerts for anomalies.
"""

from uuid import UUID
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func

from app.models.alert import Alert
from app.core.enums import AlertType, AlertSeverity, AlertStatus

async def create_alert(db: AsyncSession, alert_type: str, severity: str, message: str, vehicle_id: UUID = None, shipment_id: UUID = None, trip_id: UUID = None, metadata: dict = None) -> Alert:
    alert = Alert(
        type=alert_type,
        severity=severity,
        message=message,
        vehicle_id=vehicle_id,
        shipment_id=shipment_id,
        trip_id=trip_id,
        metadata_=metadata,
        status=AlertStatus.ACTIVE
    )
    db.add(alert)
    return alert

async def check_delay(db: AsyncSession, trip_id: UUID, current_eta_minutes: int, planned_eta_minutes: int) -> Alert | None:
    delay_min = current_eta_minutes - planned_eta_minutes
    if delay_min > 15:
        severity = AlertSeverity.MEDIUM
        if delay_min >= 60:
            severity = AlertSeverity.CRITICAL
        elif delay_min >= 30:
            severity = AlertSeverity.HIGH
            
        alert = await create_alert(
            db, 
            alert_type=AlertType.DELAY,
            severity=severity,
            message=f"Trip delayed by {delay_min} minutes. Expected: {planned_eta_minutes}m, Current ETA: {current_eta_minutes}m",
            trip_id=trip_id,
            metadata={"delay_minutes": delay_min}
        )
        return alert
    return None

async def check_eta_risk(db: AsyncSession, trip_id: UUID, stop: dict, current_lat: float, current_lon: float, current_speed: float) -> Alert | None:
    # Simplified check
    return None

async def check_capacity(db: AsyncSession, vehicle_id: UUID, current_load: float, additional_load: float, capacity: float) -> Alert | None:
    if current_load + additional_load > capacity:
        return await create_alert(
            db,
            alert_type=AlertType.CAPACITY_ISSUE,
            severity=AlertSeverity.HIGH,
            message=f"Capacity exceeded! Load: {current_load + additional_load}, Capacity: {capacity}",
            vehicle_id=vehicle_id
        )
    return None

async def get_active_alerts(db: AsyncSession, filters: dict = None) -> list[Alert]:
    query = select(Alert).where(Alert.status == AlertStatus.ACTIVE)
    if filters:
        if "type" in filters and filters["type"]:
            query = query.where(Alert.type == filters["type"])
        if "severity" in filters and filters["severity"]:
            query = query.where(Alert.severity == filters["severity"])
            
    res = await db.execute(query)
    return res.scalars().all()

async def acknowledge_alert(db: AsyncSession, alert_id: UUID) -> Alert:
    res = await db.execute(select(Alert).where(Alert.id == alert_id))
    alert = res.scalars().first()
    if alert:
        alert.status = AlertStatus.ACKNOWLEDGED
        await db.commit()
    return alert

async def resolve_alert(db: AsyncSession, alert_id: UUID) -> Alert:
    res = await db.execute(select(Alert).where(Alert.id == alert_id))
    alert = res.scalars().first()
    if alert:
        alert.status = AlertStatus.RESOLVED
        alert.resolved_at = datetime.utcnow()
        await db.commit()
    return alert

async def get_alert_statistics(db: AsyncSession) -> dict:
    res = await db.execute(select(Alert.type, Alert.severity, Alert.status, func.count(Alert.id)).group_by(Alert.type, Alert.severity, Alert.status))
    stats = {}
    for t, s, st, c in res.all():
        key = f"{t}_{s}_{st}"
        stats[key] = c
    return stats
