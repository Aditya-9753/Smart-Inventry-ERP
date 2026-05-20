from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class TransactionBase(BaseModel):
    product_id: str
    quantity: int
    note: Optional[str] = None

class InwardRequest(TransactionBase):
    warehouse_id: str

class OutwardRequest(TransactionBase):
    warehouse_id: str

class TransferRequest(TransactionBase):
    source_warehouse_id: str
    destination_warehouse_id: str

class TransactionResponse(BaseModel):
    id: str
    product_id: str
    warehouse_id: str
    type: str
    quantity: int
    note: Optional[str]
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True

class LowStockResponse(BaseModel):
    product_id: str
    product_name: str
    sku: str
    current_quantity: int
    min_stock: int
