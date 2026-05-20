from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from datetime import datetime
from app.audit import service
from app.audit.schemas import AuditLogResponse
from app.core.permissions import require_permission
from app.users.models import User

router = APIRouter(prefix="/api/audit", tags=["audit"])

@router.get("/logs", response_model=List[AuditLogResponse])
async def get_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    user_id: Optional[str] = None,
    module: Optional[str] = None,
    action: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: User = Depends(require_permission("audit", "read")) # Admin only mapping implies Admin role has this permission
):
    return await service.get_logs(skip, limit, user_id, module, action, start_date, end_date)
