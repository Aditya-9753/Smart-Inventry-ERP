from fastapi import HTTPException
from app.products.models import Product

async def validate_price(price: float):
    if price <= 0:
        raise HTTPException(status_code=400, detail="Price must be greater than zero")

async def validate_sku_uniqueness(sku: str):
    existing = await Product.find_one(Product.sku == sku)
    if existing:
        raise HTTPException(status_code=400, detail=f"Product with SKU {sku} already exists")
