from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import FileResponse
from app.reports import service
from app.core.permissions import require_permission
from app.users.models import User
import os

router = APIRouter(prefix="/api/reports", tags=["reports"])

@router.get("/pdf")
async def get_pdf_report(
    type: str = Query(..., description="Report type: sales, inventory, warehouse, users"),
    current_user: User = Depends(require_permission("reports", "read"))
):
    try:
        file_path = await service.generate_report_file("pdf", type)
        return FileResponse(file_path, filename=os.path.basename(file_path), media_type="application/pdf")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/excel")
async def get_excel_report(
    type: str = Query(..., description="Report type: sales, inventory, warehouse, users"),
    current_user: User = Depends(require_permission("reports", "read"))
):
    try:
        file_path = await service.generate_report_file("excel", type)
        return FileResponse(file_path, filename=os.path.basename(file_path), media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/csv")
async def get_csv_report(
    type: str = Query(..., description="Report type: sales, inventory, warehouse, users"),
    current_user: User = Depends(require_permission("reports", "read"))
):
    try:
        file_path = await service.generate_report_file("csv", type)
        return FileResponse(file_path, filename=os.path.basename(file_path), media_type="text/csv")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
