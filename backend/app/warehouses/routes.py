from fastapi import APIRouter, Depends
from typing import List
from app.warehouses.schemas import WarehouseCreate, WarehouseUpdate, WarehouseResponse, StockResponse
from app.warehouses import service
from app.core.permissions import require_permission
from app.users.models import User

router = APIRouter(prefix="/api/warehouses", tags=["warehouses"])

@router.get("", response_model=List[WarehouseResponse])
async def get_warehouses(current_user: User = Depends(require_permission("warehouses", "read"))):
    return await service.get_warehouses()

@router.post("", response_model=WarehouseResponse)
async def create_warehouse(data: WarehouseCreate, current_user: User = Depends(require_permission("warehouses", "write"))):
    return await service.create_warehouse(data)

@router.get("/{id}", response_model=WarehouseResponse)
async def get_warehouse(id: str, current_user: User = Depends(require_permission("warehouses", "read"))):
    return await service.get_warehouse(id)

@router.put("/{id}", response_model=WarehouseResponse)
async def update_warehouse(id: str, data: WarehouseUpdate, current_user: User = Depends(require_permission("warehouses", "write"))):
    return await service.update_warehouse(id, data)

@router.delete("/{id}")
async def delete_warehouse(id: str, current_user: User = Depends(require_permission("warehouses", "delete"))):
    return await service.delete_warehouse(id)

@router.get("/{id}/stock", response_model=List[StockResponse])
async def get_warehouse_stock(id: str, current_user: User = Depends(require_permission("warehouses", "read"))):
    return await service.get_warehouse_stock(id)
