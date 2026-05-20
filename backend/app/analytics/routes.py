from fastapi import APIRouter, Depends
from app.analytics import service
from app.core.permissions import require_permission
from app.users.models import User

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/inventory-trends")
async def get_inventory_trends(current_user: User = Depends(require_permission("analytics", "read"))):
    return await service.get_inventory_trends()

@router.get("/fast-moving")
async def get_fast_moving(current_user: User = Depends(require_permission("analytics", "read"))):
    return await service.get_fast_moving_products()

@router.get("/dead-stock")
async def get_dead_stock(current_user: User = Depends(require_permission("analytics", "read"))):
    return await service.get_dead_stock()

@router.get("/user-activity")
async def get_user_activity(current_user: User = Depends(require_permission("analytics", "read"))):
    return await service.get_user_activity()
