from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
import logging

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()

def start_scheduler():
    from app.tasks.stock_alert_tasks import check_low_stock
    from app.tasks.cleanup_tasks import purge_expired_sessions
    from app.tasks.report_tasks import generate_weekly_reports

    scheduler.add_job(check_low_stock, CronTrigger(minute='*/10'))
    scheduler.add_job(purge_expired_sessions, CronTrigger(hour=0, minute=0)) # Daily at midnight
    scheduler.add_job(generate_weekly_reports, CronTrigger(day_of_week='sun', hour=2, minute=0))
    
    scheduler.start()
    logger.info("Scheduler started successfully")
