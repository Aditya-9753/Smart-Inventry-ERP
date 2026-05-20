from typing import Optional
from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    category_id: Optional[str] = None
    price: float
    min_stock: int = 10
    image: Optional[str] = None
    # note: SKU and barcode are auto-generated

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[str] = None
    price: Optional[float] = None
    min_stock: Optional[int] = None
    image: Optional[str] = None

class ProductResponse(BaseModel):
    id: str
    name: str
    sku: str
    barcode: Optional[str]
    category_id: Optional[str]
    quantity: int
    price: float
    min_stock: int
    image: Optional[str]

    class Config:
        from_attributes = True

class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    
    class Config:
        from_attributes = True
