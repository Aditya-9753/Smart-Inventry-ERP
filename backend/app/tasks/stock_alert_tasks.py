import logging
from app.products.models import Product
from app.users.models import User
from app.core.roles import RoleEnum
from app.notifications.service import create_notification

logger = logging.getLogger(__name__)

async def check_low_stock():
    logger.info("Running low stock check task")
    # Using aggregation or simple python iteration based on previous constraints
    products = await Product.find_all().to_list()
    low_stock_products = [p for p in products if p.quantity < p.min_stock]
    
    if not low_stock_products:
        return
        
    # Get users with Manager or Admin roles to notify
    # For simplicity, sending to a generic group or finding those users
    # We would need to query roles first
    from app.users.models import Role
    manager_roles = await Role.find({"name": {"$in": [RoleEnum.ADMIN.value, RoleEnum.MANAGER.value]}}).to_list()
    role_ids = [str(r.id) for r in manager_roles]
    
    managers = await User.find({"role_id": {"$in": role_ids}}).to_list()
    
    for product in low_stock_products:
        msg = f"Product {product.name} ({product.sku}) is below min stock! Current: {product.quantity}, Min: {product.min_stock}"
        for manager in managers:
            await create_notification(str(manager.id), "Low Stock Alert", msg, "low_stock")
