from fastapi import HTTPException, Request
from typing import List, Optional
from app.inventory.schemas import InwardRequest, OutwardRequest, TransferRequest, TransactionResponse, LowStockResponse
from app.inventory.models import InventoryTransaction
from app.inventory.repository import InventoryRepository
from app.inventory.stock_engine import validate_outward, calculate_stock
from app.products.repository import ProductRepository
from app.audit.logger import write_audit_log

inventory_repo = InventoryRepository()
product_repo = ProductRepository()


async def record_inward(data: InwardRequest, user_id: str, request: Request) -> TransactionResponse:
    if data.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than zero")
    
    ip_address = request.client.host if request.client else "unknown"
    
    await calculate_stock(data.warehouse_id, data.product_id, data.quantity)
    
    transaction = InventoryTransaction(
        product_id=data.product_id,
        warehouse_id=data.warehouse_id,
        type="in",
        quantity=data.quantity,
        note=data.note,
        user_id=user_id
    )
    transaction = await inventory_repo.create(transaction)
    
    await write_audit_log(user_id, f"Inward stock: {data.quantity} of product {data.product_id}", "inventory", ip_address)
    
    return TransactionResponse.model_validate(transaction, from_attributes=True)

async def record_outward(data: OutwardRequest, user_id: str, request: Request) -> TransactionResponse:
    ip_address = request.client.host if request.client else "unknown"
    
    await validate_outward(data.warehouse_id, data.product_id, data.quantity)
    
    await calculate_stock(data.warehouse_id, data.product_id, -data.quantity)
    
    transaction = InventoryTransaction(
        product_id=data.product_id,
        warehouse_id=data.warehouse_id,
        type="out",
        quantity=data.quantity,
        note=data.note,
        user_id=user_id
    )
    transaction = await inventory_repo.create(transaction)
    
    await write_audit_log(user_id, f"Outward stock: {data.quantity} of product {data.product_id}", "inventory", ip_address)
    
    return TransactionResponse.model_validate(transaction, from_attributes=True)

async def record_transfer(data: TransferRequest, user_id: str, request: Request) -> List[TransactionResponse]:
    ip_address = request.client.host if request.client else "unknown"
    
    # Validate stock exists in source
    await validate_outward(data.source_warehouse_id, data.product_id, data.quantity)
    
    # Process Outward from Source
    await calculate_stock(data.source_warehouse_id, data.product_id, -data.quantity)
    out_transaction = InventoryTransaction(
        product_id=data.product_id,
        warehouse_id=data.source_warehouse_id,
        type="out",
        quantity=data.quantity,
        note=f"Transfer to {data.destination_warehouse_id} - {data.note}",
        user_id=user_id
    )
    out_transaction = await inventory_repo.create(out_transaction)
    
    # Process Inward to Destination
    await calculate_stock(data.destination_warehouse_id, data.product_id, data.quantity)
    in_transaction = InventoryTransaction(
        product_id=data.product_id,
        warehouse_id=data.destination_warehouse_id,
        type="in",
        quantity=data.quantity,
        note=f"Transfer from {data.source_warehouse_id} - {data.note}",
        user_id=user_id
    )
    in_transaction = await inventory_repo.create(in_transaction)
    
    await write_audit_log(user_id, f"Transfer stock: {data.quantity} of product {data.product_id} from {data.source_warehouse_id} to {data.destination_warehouse_id}", "inventory", ip_address)
    
    return [
        TransactionResponse.model_validate(out_transaction, from_attributes=True),
        TransactionResponse.model_validate(in_transaction, from_attributes=True)
    ]

async def get_history(skip: int = 0, limit: int = 50, type_filter: Optional[str] = None, warehouse_id: Optional[str] = None) -> List[TransactionResponse]:
    transactions = await inventory_repo.get_all(skip, limit, type_filter, warehouse_id)
    return [TransactionResponse.model_validate(t, from_attributes=True) for t in transactions]

async def get_low_stock() -> List[LowStockResponse]:
    # Direct MongoDB query for products with low stock - avoids N+1
    from app.products.models import Product
    from beanie import operators
    
    low_stock_products_raw = await Product.find(
        Product.quantity < Product.min_stock
    ).to_list()
    
    low_stock_products = [
        LowStockResponse(
            product_id=str(p.id),
            product_name=p.name,
            sku=p.sku,
            current_quantity=p.quantity,
            min_stock=p.min_stock
        )
        for p in low_stock_products_raw
    ]
    
    return low_stock_products
