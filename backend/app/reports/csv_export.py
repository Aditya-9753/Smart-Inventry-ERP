import os
import csv

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads", "reports")
os.makedirs(UPLOAD_DIR, exist_ok=True)

def generate_csv(headers: list, data: list, filename: str) -> str:
    file_path = os.path.join(UPLOAD_DIR, f"{filename}.csv")
    
    with open(file_path, mode='w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        for row in data:
            writer.writerow(row)
            
    return file_path
