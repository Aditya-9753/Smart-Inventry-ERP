from typing import List
from fastapi import HTTPException
from app.settings.models import SettingsModel
from app.settings.schemas import SettingUpdate, SettingResponse

async def get_all_settings() -> List[SettingResponse]:
    settings = await SettingsModel.find_all().to_list()
    return [SettingResponse.model_validate(s, from_attributes=True) for s in settings]

async def update_setting(data: SettingUpdate, user_id: str) -> SettingResponse:
    setting = await SettingsModel.find_one(SettingsModel.key == data.key)
    
    if setting:
        setting.value = data.value
        setting.updated_by = user_id
        await setting.save()
    else:
        setting = SettingsModel(
            key=data.key,
            value=data.value,
            updated_by=user_id
        )
        await setting.insert()
        
    return SettingResponse.model_validate(setting, from_attributes=True)
