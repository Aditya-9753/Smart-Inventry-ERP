from datetime import datetime, timezone
from beanie import Document
from pydantic import Field

class SettingsModel(Document):
    key: str
    value: str
    updated_by: str
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "settings"
