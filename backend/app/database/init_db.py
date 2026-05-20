from beanie import init_beanie
from app.database.connection import db
from app.users.models import User, Role, Permission
from app.products.models import Product, Category
from app.inventory.models import InventoryTransaction
from app.warehouses.models import Warehouse, WarehouseStock
from app.notifications.models import Notification
from app.audit.models import AuditLog
from app.auth.models import Session
from app.reports.models import Report
from app.settings.models import SettingsModel
from app.core.security import get_password_hash

ROLE_PERMISSIONS = {
    "MANAGER": {
        "dashboard": (True, False, False),
        "products": (True, True, False),
        "inventory": (True, True, False),
        "warehouses": (True, True, False),
        "analytics": (True, False, False),
        "reports": (True, False, False),
        "notifications": (True, True, False),
    },
    "STAFF": {
        "dashboard": (True, False, False),
        "products": (True, False, False),
        "inventory": (True, True, False),
        "warehouses": (True, False, False),
        "notifications": (True, True, False),
    },
    "VIEWER": {
        "dashboard": (True, False, False),
        "products": (True, False, False),
        "inventory": (True, False, False),
        "warehouses": (True, False, False),
        "reports": (True, False, False),
        "notifications": (True, True, False),
    },
}

DEFAULT_USERS = [
    ("Test Admin", "admin@test.com", "Admin@1234", "ADMIN"),
    ("Test Manager", "manager@test.com", "Manager@1234", "MANAGER"),
    ("Test Staff", "staff@test.com", "Staff@1234", "STAFF"),
    ("Test Viewer", "viewer@test.com", "Viewer@1234", "VIEWER"),
]

async def init_db():
    await init_beanie(
        database=db,
        document_models=[
            User,
            Role,
            Permission,
            Product,
            Category,
            InventoryTransaction,
            Warehouse,
            WarehouseStock,
            Notification,
            AuditLog,
            Session,
            Report,
            SettingsModel,
        ],
    )

    await seed_default_auth_data()


async def get_or_create_role(name: str, description: str) -> Role:
    role = await Role.find_one(Role.name == name)
    if role:
        return role

    role = Role(name=name, description=description)
    await role.insert()
    return role


async def seed_role_permissions(role: Role, permission_map: dict):
    for module, permissions in permission_map.items():
        can_read, can_write, can_delete = permissions
        permission = await Permission.find_one(
            Permission.role_id == str(role.id),
            Permission.module == module,
        )

        if permission:
            permission.can_read = can_read
            permission.can_write = can_write
            permission.can_delete = can_delete
            await permission.save()
            continue

        await Permission(
            role_id=str(role.id),
            module=module,
            can_read=can_read,
            can_write=can_write,
            can_delete=can_delete,
        ).insert()


async def seed_default_user(name: str, email: str, password: str, role: Role):
    user = await User.find_one(User.email == email)
    if user:
        if user.role_id != str(role.id):
            user.role_id = str(role.id)
            await user.save()
        return

    await User(
        name=name,
        email=email,
        hashed_password=get_password_hash(password),
        role_id=str(role.id),
        is_active=True,
    ).insert()


async def seed_default_auth_data():
    roles = {
        "ADMIN": await get_or_create_role("ADMIN", "Full access"),
        "MANAGER": await get_or_create_role("MANAGER", "Manager access"),
        "STAFF": await get_or_create_role("STAFF", "Inventory access"),
        "VIEWER": await get_or_create_role("VIEWER", "Read-only access"),
    }

    for role_name, permission_map in ROLE_PERMISSIONS.items():
        await seed_role_permissions(roles[role_name], permission_map)

    for name, email, password, role_name in DEFAULT_USERS:
        await seed_default_user(name, email, password, roles[role_name])
