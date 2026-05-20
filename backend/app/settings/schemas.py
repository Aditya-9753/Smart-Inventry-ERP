from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class SettingUpdate(BaseModel):
    key: str
    value: str

class SettingResponse(BaseModel):
    id: str
    key: str
    value: str
    updated_by: str
    updated_at: datetime
    
    class Config:
        from_attributes = True
