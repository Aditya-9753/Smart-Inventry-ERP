from typing import Optional
from pydantic import Field
from app.database.base import BaseDocument

class InventoryTransaction(BaseDocument):
    product_id: str
    warehouse_id: str
    type: str # 'in', 'out', 'adjustment'
    quantity: int
    note: Optional[str] = None
    user_id: str

    class Settings:
        name = "inventory_transactions"
