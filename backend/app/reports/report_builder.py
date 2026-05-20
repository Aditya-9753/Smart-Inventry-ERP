from app.inventory.models import InventoryTransaction
from app.products.models import Product
from app.warehouses.models import Warehouse, WarehouseStock
from app.audit.models import AuditLog

async def build_sales_report_data():
    pipeline = [
        {"$match": {"type": "out"}},
        {"$group": {
            "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}},
            "total_sales": {"$sum": "$quantity"}
        }},
        {"$sort": {"_id": 1}}
    ]
    results = await InventoryTransaction.aggregate(pipeline).to_list()
    headers = ["Date", "Total Quantity Sold"]
    data = [[r["_id"], r["total_sales"]] for r in results]
    return "Sales Report", headers, data

async def build_inventory_report_data():
    products = await Product.find_all().to_list()
    headers = ["SKU", "Name", "Total Quantity", "Min Stock"]
    data = [[p.sku, p.name, p.quantity, p.min_stock] for p in products]
    return "Inventory Report", headers, data

async def build_warehouse_report_data():
    stocks = await WarehouseStock.find_all().to_list()
    headers = ["Warehouse ID", "Product ID", "Quantity"]
    data = [[str(s.warehouse_id), str(s.product_id), s.quantity] for s in stocks]
    return "Warehouse Stock Report", headers, data

async def build_users_report_data():
    logs = await AuditLog.find_all().limit(100).to_list() # limited for now
    headers = ["Date", "User ID", "Action", "Module"]
    data = [[l.timestamp.strftime("%Y-%m-%d %H:%M"), str(l.user_id), l.action, l.module] for l in logs]
    return "User Activity Report", headers, data

async def get_report_data(report_type: str):
    if report_type == "sales":
        return await build_sales_report_data()
    elif report_type == "inventory":
        return await build_inventory_report_data()
    elif report_type == "warehouse":
        return await build_warehouse_report_data()
    elif report_type == "users":
        return await build_users_report_data()
    else:
        raise ValueError("Invalid report type")
