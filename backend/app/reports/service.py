from datetime import datetime
from app.reports.report_builder import get_report_data
from app.reports.pdf_generator import generate_pdf
from app.reports.excel_export import generate_excel
from app.reports.csv_export import generate_csv

async def generate_report_file(format: str, report_type: str) -> str:
    title, headers, data = await get_report_data(report_type)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{report_type}_report_{timestamp}"
    
    if format == "pdf":
        return generate_pdf(title, headers, data, filename)
    elif format == "excel":
        return generate_excel(title, headers, data, filename)
    elif format == "csv":
        return generate_csv(headers, data, filename)
    else:
        raise ValueError("Invalid format")
