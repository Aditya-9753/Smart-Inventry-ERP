import os
from openpyxl import Workbook

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads", "reports")
os.makedirs(UPLOAD_DIR, exist_ok=True)

def generate_excel(title: str, headers: list, data: list, filename: str) -> str:
    file_path = os.path.join(UPLOAD_DIR, f"{filename}.xlsx")
    wb = Workbook()
    ws = wb.active
    ws.title = title[:31] # Excel sheet titles max 31 chars
    
    ws.append(headers)
    for row in data:
        ws.append(row)
        
    wb.save(file_path)
    return file_path
