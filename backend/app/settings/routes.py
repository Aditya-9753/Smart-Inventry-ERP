from fastapi import APIRouter, Depends
from typing import List
from app.settings import service
from app.settings.schemas import SettingUpdate, SettingResponse
from app.core.permissions import require_permission
from app.users.models import User

router = APIRouter(prefix="/api/settings", tags=["settings"])

@router.get("", response_model=List[SettingResponse])
async def get_settings(current_user: User = Depends(require_permission("settings", "read"))):
    return await service.get_all_settings()

@router.put("", response_model=SettingResponse)
async def update_setting(data: SettingUpdate, current_user: User = Depends(require_permission("settings", "write"))):
    return await service.update_setting(data, str(current_user.id))
