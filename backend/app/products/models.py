from typing import Optional
from beanie import Document
from pydantic import Field
from app.database.base import BaseDocument

class Category(Document):
    name: str
    description: Optional[str] = None

    class Settings:
        name = "categories"

class Product(BaseDocument):
    name: str
    sku: str
    barcode: Optional[str] = None
    category_id: Optional[str] = None
    quantity: int = 0
    price: float = 0.0
    min_stock: int = 0
    image: Optional[str] = None

    class Settings:
        name = "products"
