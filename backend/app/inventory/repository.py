from typing import List, Optional
from beanie import PydanticObjectId
from app.inventory.models import InventoryTransaction

class InventoryRepository:
    async def get_all(self, skip: int = 0, limit: int = 50, type_filter: Optional[str] = None, warehouse_id: Optional[str] = None) -> List[InventoryTransaction]:
        query = {}
        if type_filter:
            query["type"] = type_filter
        if warehouse_id:
            query["warehouse_id"] = warehouse_id
            
        return await InventoryTransaction.find(query).sort("-created_at").skip(skip).limit(limit).to_list()

    async def create(self, transaction: InventoryTransaction) -> InventoryTransaction:
        return await transaction.insert()
