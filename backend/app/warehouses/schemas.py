from typing import Optional, List
from pydantic import BaseModel

class WarehouseCreate(BaseModel):
    name: str
    location: str
    manager_id: Optional[str] = None

class WarehouseUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    manager_id: Optional[str] = None

class WarehouseResponse(BaseModel):
    id: str
    name: str
    location: str
    manager_id: Optional[str]

    class Config:
        from_attributes = True

class StockResponse(BaseModel):
    product_id: str
    product_name: str
    quantity: int
