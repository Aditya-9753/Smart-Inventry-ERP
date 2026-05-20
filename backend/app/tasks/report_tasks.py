import logging
from app.reports.service import generate_report_file

logger = logging.getLogger(__name__)

async def generate_weekly_reports():
    logger.info("Running weekly report generation task")
    
    try:
        await generate_report_file("pdf", "sales")
        await generate_report_file("pdf", "inventory")
        await generate_report_file("excel", "warehouse")
        logger.info("Weekly reports generated successfully")
    except Exception as e:
        logger.error(f"Failed to generate weekly reports: {e}")
