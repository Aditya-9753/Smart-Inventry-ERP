from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class NotificationResponse(BaseModel):

    id: str
    user_id: str
    title: str
    message: str
    type: str
    is_read: bool = False
    created_at: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes=True
    )