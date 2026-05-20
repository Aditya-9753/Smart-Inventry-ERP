"""
pytest configuration: shared fixtures for all test modules.
Uses an in-memory test MongoDB via mongomock-motor, isolated Redis,
and a fresh FastAPI TestClient with pre-seeded admin / staff users.
"""
import asyncio
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

# Import all document models so Beanie registers them
from app.users.models import User, Role, Permission
from app.products.models import Product, Category
from app.inventory.models import InventoryTransaction
from app.warehouses.models import Warehouse, WarehouseStock
from app.notifications.models import Notification
from app.audit.models import AuditLog
from app.auth.models import Session
from app.settings.models import SettingsModel
from app.reports.models import Report

from app.main import app
from app.core.security import get_password_hash
from app.core.jwt_handler import create_access_token
from app.database.init_db import ROLE_PERMISSIONS


# ── Event loop ────────────────────────────────────────────────────────────────
@pytest.fixture(scope="session")
def event_loop():
    """Single event loop shared across all session-scoped async fixtures."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


# ── Test MongoDB ──────────────────────────────────────────────────────────────
@pytest_asyncio.fixture(scope="session")
async def test_db():
    """Initialise an isolated in-memory MongoDB for the test session."""
    client = AsyncIOMotorClient("mongodb://localhost:27017/erp_test_db")
    db = client["erp_test_db"]

    await init_beanie(
        database=db,
        document_models=[
            User, Role, Permission,
            Product, Category,
            InventoryTransaction,
            Warehouse, WarehouseStock,
            Notification, AuditLog,
            Session, SettingsModel, Report,
        ],
    )
    yield db
    # Teardown: drop test database
    await client.drop_database("erp_test_db")
    client.close()


# ── Seed Roles ────────────────────────────────────────────────────────────────
@pytest_asyncio.fixture(scope="session")
async def seeded_roles(test_db):
    """Create ADMIN and STAFF roles once per session."""
    admin_role = Role(name="ADMIN", description="Full access")
    staff_role = Role(name="STAFF", description="Inventory access")
    manager_role = Role(name="MANAGER", description="Manager access")
    viewer_role = Role(name="VIEWER", description="Read-only access")

    await admin_role.insert()
    await staff_role.insert()
    await manager_role.insert()
    await viewer_role.insert()

    for role, permission_map in [
        (staff_role, ROLE_PERMISSIONS["STAFF"]),
        (manager_role, ROLE_PERMISSIONS["MANAGER"]),
        (viewer_role, ROLE_PERMISSIONS["VIEWER"]),
    ]:
        for module, permissions in permission_map.items():
            can_read, can_write, can_delete = permissions
            await Permission(
                role_id=str(role.id),
                module=module,
                can_read=can_read,
                can_write=can_write,
                can_delete=can_delete,
            ).insert()

    return {
        "admin": admin_role,
        "staff": staff_role,
        "manager": manager_role,
        "viewer": viewer_role,
    }


# ── Seed Users ────────────────────────────────────────────────────────────────
@pytest_asyncio.fixture(scope="session")
async def seeded_users(test_db, seeded_roles):
    """Create one user per role."""
    admin = User(
        name="Test Admin",
        email="admin@test.com",
        hashed_password=get_password_hash("Admin@1234"),
        role_id=str(seeded_roles["admin"].id),
        is_active=True,
    )
    staff = User(
        name="Test Staff",
        email="staff@test.com",
        hashed_password=get_password_hash("Staff@1234"),
        role_id=str(seeded_roles["staff"].id),
        is_active=True,
    )
    manager = User(
        name="Test Manager",
        email="manager@test.com",
        hashed_password=get_password_hash("Manager@1234"),
        role_id=str(seeded_roles["manager"].id),
        is_active=True,
    )
    viewer = User(
        name="Test Viewer",
        email="viewer@test.com",
        hashed_password=get_password_hash("Viewer@1234"),
        role_id=str(seeded_roles["viewer"].id),
        is_active=True,
    )

    await admin.insert()
    await staff.insert()
    await manager.insert()
    await viewer.insert()

    return {"admin": admin, "staff": staff, "manager": manager, "viewer": viewer}


# ── Auth Headers ──────────────────────────────────────────────────────────────
@pytest_asyncio.fixture(scope="session")
async def admin_headers(seeded_users):
    token = create_access_token(str(seeded_users["admin"].id))
    return {"Authorization": f"Bearer {token}"}


@pytest_asyncio.fixture(scope="session")
async def staff_headers(seeded_users):
    token = create_access_token(str(seeded_users["staff"].id))
    return {"Authorization": f"Bearer {token}"}


@pytest_asyncio.fixture(scope="session")
async def manager_headers(seeded_users):
    token = create_access_token(str(seeded_users["manager"].id))
    return {"Authorization": f"Bearer {token}"}


# ── HTTP Test Client ──────────────────────────────────────────────────────────
@pytest_asyncio.fixture(scope="session")
async def client(test_db):
    """AsyncClient wired to the FastAPI ASGI app."""
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://testserver",
    ) as ac:
        yield ac


# ── Seed a single Product ─────────────────────────────────────────────────────
@pytest_asyncio.fixture
async def sample_product(test_db, seeded_roles):
    product = Product(
        name="Test Widget",
        sku="TEST-001",
        price=9.99,
        quantity=100,
        min_stock=10,
    )
    await product.insert()
    yield product
    await product.delete()


# ── Seed a single Warehouse ───────────────────────────────────────────────────
@pytest_asyncio.fixture
async def sample_warehouse(test_db):
    wh = Warehouse(
        name="Main Warehouse",
        location="Building A",
        capacity=5000,
        is_active=True,
    )
    await wh.insert()
    yield wh
    await wh.delete()
