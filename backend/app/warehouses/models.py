from typing import Optional
from beanie import Document
from pydantic import Field
from app.database.base import BaseDocument

class Warehouse(BaseDocument):
    name: str
    location: str
    manager_id: Optional[str] = None

    class Settings:
        name = "warehouses"

class WarehouseStock(Document):
    warehouse_id: str
    product_id: str
    quantity: int = 0

    class Settings:
        name = "warehouse_stock"
