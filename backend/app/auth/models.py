from typing import Optional
from datetime import datetime, timezone
from pydantic import Field
from beanie import Document

class Session(Document):
    user_id: str
    token: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: datetime

    class Settings:
        name = "sessions"
