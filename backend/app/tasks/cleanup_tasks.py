import logging
from datetime import datetime, timezone
from app.auth.models import Session

logger = logging.getLogger(__name__)

async def purge_expired_sessions():
    logger.info("Running expired sessions cleanup task")
    now = datetime.now(timezone.utc)
    result = await Session.find(Session.expires_at < now).delete()
    logger.info(f"Purged {result.deleted_count} expired sessions")
