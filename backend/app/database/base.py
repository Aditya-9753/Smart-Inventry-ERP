from datetime import datetime, timezone
from beanie import Document
from pydantic import Field

class BaseDocument(Document):
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
