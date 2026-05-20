from fastapi import HTTPException
from app.warehouses.schemas import WarehouseCreate, WarehouseUpdate, WarehouseResponse, StockResponse
from app.warehouses.models import Warehouse
from app.warehouses.repository import WarehouseRepository
from app.products.repository import ProductRepository
from typing import List

warehouse_repo = WarehouseRepository()
product_repo = ProductRepository()

async def get_warehouses() -> List[WarehouseResponse]:
    warehouses = await warehouse_repo.get_all()
    return [
        WarehouseResponse(
            id=str(w.id),
            name=w.name,
            location=w.location,
            manager_id=w.manager_id
        ) for w in warehouses
    ]

async def get_warehouse(warehouse_id: str) -> WarehouseResponse:
    warehouse = await warehouse_repo.get_by_id(warehouse_id)
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
        
    return WarehouseResponse(
        id=str(warehouse.id),
        name=warehouse.name,
        location=warehouse.location,
        manager_id=warehouse.manager_id
    )

async def create_warehouse(data: WarehouseCreate) -> WarehouseResponse:
    warehouse = Warehouse(
        name=data.name,
        location=data.location,
        manager_id=data.manager_id
    )
    warehouse = await warehouse_repo.create(warehouse)
    return await get_warehouse(str(warehouse.id))

async def update_warehouse(warehouse_id: str, data: WarehouseUpdate) -> WarehouseResponse:
    warehouse = await warehouse_repo.get_by_id(warehouse_id)
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
        
    if data.name is not None:
        warehouse.name = data.name
    if data.location is not None:
        warehouse.location = data.location
    if data.manager_id is not None:
        warehouse.manager_id = data.manager_id
        
    await warehouse_repo.update(warehouse)
    return await get_warehouse(str(warehouse.id))

async def delete_warehouse(warehouse_id: str):
    warehouse = await warehouse_repo.get_by_id(warehouse_id)
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
        
    await warehouse_repo.delete(warehouse)
    return {"message": "Warehouse deleted successfully"}

async def get_warehouse_stock(warehouse_id: str) -> List[StockResponse]:
    from app.products.models import Product
    from beanie import operators
    from pydantic import PydanticObjectId
    
    warehouse = await warehouse_repo.get_by_id(warehouse_id)
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
        
    stocks = await warehouse_repo.get_stock(warehouse_id)
    
    # Batch fetch all products instead of N+1 queries
    product_ids = [PydanticObjectId(stock.product_id) for stock in stocks]
    if not product_ids:
        return []
    
    products = await Product.find(
        operators.In(Product.id, product_ids)
    ).to_list()
    product_map = {str(p.id): p.name for p in products}
    
    response = [
        StockResponse(
            product_id=stock.product_id,
            product_name=product_map.get(stock.product_id, "Unknown"),
            quantity=stock.quantity
        )
        for stock in stocks
    ]
            
    return response
