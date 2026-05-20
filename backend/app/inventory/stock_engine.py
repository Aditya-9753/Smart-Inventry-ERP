from fastapi import HTTPException
from app.warehouses.models import WarehouseStock
from app.products.models import Product
from app.warehouses.repository import WarehouseRepository

warehouse_repo = WarehouseRepository()

async def validate_outward(warehouse_id: str, product_id: str, quantity: int):
    if quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than zero")
        
    stock = await warehouse_repo.get_product_stock(warehouse_id, product_id)
    available = stock.quantity if stock else 0
    
    if available < quantity:
        raise HTTPException(
            status_code=400, 
            detail=f"Insufficient stock. Requested: {quantity}, Available: {available}"
        )

async def calculate_stock(warehouse_id: str, product_id: str, quantity_change: int):
    stock = await warehouse_repo.get_product_stock(warehouse_id, product_id)
    
    if stock:
        stock.quantity += quantity_change
        await stock.save()
    else:
        if quantity_change < 0:
            raise HTTPException(status_code=400, detail="Cannot create negative stock record")
        stock = WarehouseStock(
            warehouse_id=warehouse_id,
            product_id=product_id,
            quantity=quantity_change
        )
        await warehouse_repo.create(stock)
        
    # Also update global product quantity
    product = await Product.get(product_id)
    if product:
        product.quantity += quantity_change
        await product.save()
