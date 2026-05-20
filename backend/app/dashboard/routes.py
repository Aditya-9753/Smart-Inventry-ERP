from fastapi import APIRouter, Depends
from app.dashboard import service
from app.core.permissions import require_permission
from app.users.models import User

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats")
async def get_stats(current_user: User = Depends(require_permission("dashboard", "read"))):
    return await service.get_dashboard_stats()

@router.get("/charts")
async def get_charts(current_user: User = Depends(require_permission("dashboard", "read"))):
    return await service.get_dashboard_charts()
