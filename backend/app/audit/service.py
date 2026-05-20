from typing import List, Optional
from datetime import datetime
from app.audit.models import AuditLog
from app.audit.schemas import AuditLogResponse

async def get_logs(
    skip: int = 0, 
    limit: int = 50, 
    user_id: Optional[str] = None, 
    module: Optional[str] = None,
    action: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None
) -> List[AuditLogResponse]:
    query = {}
    if user_id:
        query["user_id"] = user_id
    if module:
        query["module"] = module
    if action:
        query["action"] = action
        
    if start_date or end_date:
        query["timestamp"] = {}
        if start_date:
            query["timestamp"]["$gte"] = start_date
        if end_date:
            query["timestamp"]["$lte"] = end_date

    logs = await AuditLog.find(query).sort("-timestamp").skip(skip).limit(limit).to_list()
    return [AuditLogResponse.model_validate(l, from_attributes=True) for l in logs]
