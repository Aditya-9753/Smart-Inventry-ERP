from datetime import datetime, timezone, timedelta
from app.products.models import Product
from app.users.models import User
from app.inventory.models import InventoryTransaction
from app.auth.models import Session

async def get_total_products() -> int:
    return await Product.count()

async def get_total_users() -> int:
    return await User.count()

async def get_low_stock_items_count() -> int:
    return await Product.find(Product.quantity < Product.min_stock).count()

async def get_todays_transactions_count() -> int:
    now = datetime.now(timezone.utc)
    start_of_day = datetime(now.year, now.month, now.day, tzinfo=timezone.utc)
    return await InventoryTransaction.find(InventoryTransaction.created_at >= start_of_day).count()

async def get_monthly_sales() -> float:
    # Calculate revenue (quantity * price) from outward transactions for current month
    now = datetime.now(timezone.utc)
    start_of_month = datetime(now.year, now.month, 1, tzinfo=timezone.utc)
    
    transactions = await InventoryTransaction.find(
        InventoryTransaction.type == "out",
        InventoryTransaction.created_at >= start_of_month,
    ).to_list()
    
    total_revenue = 0.0
    for transaction in transactions:
        product = await Product.get(str(transaction.product_id))
        if product:
            total_revenue += transaction.quantity * product.price
    
    return total_revenue

async def get_active_users_count() -> int:
    now = datetime.now(timezone.utc)
    thirty_mins_ago = now - timedelta(minutes=30)
    # Count unique users who have a session updated/created recently, or just valid sessions
    # Since we don't update session on every request currently, we can check sessions created in last 30 mins
    # OR active valid sessions that aren't expired. Let's assume valid sessions count.
    return await Session.find(Session.expires_at > now).count()
