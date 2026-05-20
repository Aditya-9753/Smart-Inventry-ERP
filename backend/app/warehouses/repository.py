from typing import List, Optional
from beanie import PydanticObjectId
from app.warehouses.models import Warehouse, WarehouseStock

class WarehouseRepository:
    async def get_all(self) -> List[Warehouse]:
        return await Warehouse.find_all().to_list()

    async def get_by_id(self, warehouse_id: str) -> Optional[Warehouse]:
        return await Warehouse.get(PydanticObjectId(warehouse_id))

    async def create(self, warehouse: Warehouse) -> Warehouse:
        return await warehouse.insert()

    async def update(self, warehouse: Warehouse) -> Warehouse:
        return await warehouse.save()

    async def delete(self, warehouse: Warehouse) -> None:
        await warehouse.delete()

    async def get_stock(self, warehouse_id: str) -> List[WarehouseStock]:
        return await WarehouseStock.find(WarehouseStock.warehouse_id == warehouse_id).to_list()
        
    async def get_product_stock(self, warehouse_id: str, product_id: str) -> Optional[WarehouseStock]:
        return await WarehouseStock.find_one(
            WarehouseStock.warehouse_id == warehouse_id,
            WarehouseStock.product_id == product_id
        )
