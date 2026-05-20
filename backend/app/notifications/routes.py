from fastapi import APIRouter, Depends, Query
from typing import List
from app.notifications import service
from app.notifications.schemas import NotificationResponse
from app.core.permissions import require_permission
from app.users.models import User

router = APIRouter(prefix="/api/notifications", tags=["notifications"])

@router.get("", response_model=List[NotificationResponse])
async def get_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_permission("notifications", "read")) # Adjust module name as needed, or assume default auth
):
    return await service.get_user_notifications(str(current_user.id), skip, limit)

@router.put("/{id}/read", response_model=NotificationResponse)
async def mark_read(id: str, current_user: User = Depends(require_permission("notifications", "write"))):
    return await service.mark_as_read(id, str(current_user.id))

@router.put("/read-all")
async def mark_all_read(current_user: User = Depends(require_permission("notifications", "write"))):
    return await service.mark_all_as_read(str(current_user.id))
