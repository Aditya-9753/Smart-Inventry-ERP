from fastapi import APIRouter, Depends, Query, Request
from typing import List, Optional
from app.inventory.schemas import InwardRequest, OutwardRequest, TransferRequest, TransactionResponse, LowStockResponse
from app.inventory import service
from app.core.permissions import require_permission
from app.users.models import User

router = APIRouter(prefix="/api/inventory", tags=["inventory"])

@router.post("/inward", response_model=TransactionResponse)
async def inward_stock(request: Request, data: InwardRequest, current_user: User = Depends(require_permission("inventory", "write"))):
    return await service.record_inward(data, str(current_user.id), request)

@router.post("/outward", response_model=TransactionResponse)
async def outward_stock(request: Request, data: OutwardRequest, current_user: User = Depends(require_permission("inventory", "write"))):
    return await service.record_outward(data, str(current_user.id), request)

@router.post("/transfer", response_model=List[TransactionResponse])
async def transfer_stock(request: Request, data: TransferRequest, current_user: User = Depends(require_permission("inventory", "write"))):
    return await service.record_transfer(data, str(current_user.id), request)

@router.get("/history", response_model=List[TransactionResponse])
async def get_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    type_filter: Optional[str] = None,
    warehouse_id: Optional[str] = None,
    current_user: User = Depends(require_permission("inventory", "read"))
):
    return await service.get_history(skip, limit, type_filter, warehouse_id)

@router.get("/low-stock", response_model=List[LowStockResponse])
async def get_low_stock(current_user: User = Depends(require_permission("inventory", "read"))):
    return await service.get_low_stock()
