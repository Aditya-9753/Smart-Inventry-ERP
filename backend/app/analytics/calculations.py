from datetime import datetime, timezone, timedelta
from app.products.models import Product
from app.inventory.models import InventoryTransaction
from app.users.models import User

async def get_inventory_trends(days: int = 30):
    start_date = datetime.now(timezone.utc) - timedelta(days=days)
    transactions = await InventoryTransaction.find(
        InventoryTransaction.created_at >= start_date
    ).to_list()
    
    trends = {}
    for transaction in transactions:
        date_str = transaction.created_at.strftime("%Y-%m-%d")
        t_type = transaction.type
        
        if date_str not in trends:
            trends[date_str] = {"date": date_str, "inward": 0, "outward": 0}
            
        if t_type == "in":
            trends[date_str]["inward"] += transaction.quantity
        elif t_type == "out":
            trends[date_str]["outward"] += transaction.quantity
            
    return sorted(list(trends.values()), key=lambda x: x["date"])

async def get_fast_moving_products(limit: int = 10):
    transactions = await InventoryTransaction.find(
        InventoryTransaction.type == "out"
    ).to_list()

    product_totals = {}
    for transaction in transactions:
        product_id = str(transaction.product_id)
        if product_id not in product_totals:
            product_totals[product_id] = {"count": 0, "total_qty": 0}

        product_totals[product_id]["count"] += 1
        product_totals[product_id]["total_qty"] += transaction.quantity

    results = sorted(
        product_totals.items(),
        key=lambda item: (item[1]["count"], item[1]["total_qty"]),
        reverse=True,
    )[:limit]
    
    fast_moving = []
    for product_id, totals in results:
        product = await Product.get(product_id)
        if product:
            fast_moving.append({
                "product_id": str(product.id),
                "name": product.name,
                "transaction_count": totals["count"],
                "total_quantity_out": totals["total_qty"]
            })
            
    return fast_moving

async def get_dead_stock(days: int = 30):
    cutoff_date = datetime.now(timezone.utc) - timedelta(days=days)
    
    # Get products that had no transactions since cutoff_date
    recent_transactions = await InventoryTransaction.find(InventoryTransaction.created_at >= cutoff_date).to_list()
    active_product_ids = {str(t.product_id) for t in recent_transactions}
    
    all_products = await Product.find(Product.quantity > 0).to_list()
    
    dead_stock = []
    for p in all_products:
        if str(p.id) not in active_product_ids:
            dead_stock.append({
                "product_id": str(p.id),
                "name": p.name,
                "quantity": p.quantity,
                "days_idle": days # minimum days idle
            })
            
    return dead_stock

async def get_user_activity():
    from beanie import operators
    
    transactions = await InventoryTransaction.find_all().to_list()

    user_totals = {}
    for transaction in transactions:
        user_id = str(transaction.user_id)
        user_totals[user_id] = user_totals.get(user_id, 0) + 1

    results = sorted(user_totals.items(), key=lambda item: item[1], reverse=True)
    
    # Batch fetch all users instead of N+1 queries
    user_ids = [uid for uid, _ in results]
    if not user_ids:
        return []
    
    from bson import ObjectId
    from pydantic import PydanticObjectId
    users = await User.find(
        operators.In(User.id, [PydanticObjectId(uid) for uid in user_ids])
    ).to_list()
    user_map = {str(u.id): u.name for u in users}
    
    activity = []
    for user_id, transaction_count in results:
        user_name = user_map.get(user_id, "Unknown")
        activity.append({
            "user_id": user_id,
            "name": user_name,
            "transaction_count": transaction_count
        })
            
    return activity
