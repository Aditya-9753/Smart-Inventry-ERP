from datetime import datetime, timezone
from beanie import Document
from pydantic import Field

class AuditLog(Document):
    user_id: str
    action: str
    module: str
    ip_address: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "audit_logs"
