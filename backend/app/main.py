from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.database.init_db import init_db
from app.config import settings

from app.middleware.cors_middleware import setup_cors
from app.middleware.auth_middleware import AuthMiddleware
from app.middleware.logging_middleware import LoggingMiddleware
from app.middleware.rate_limit_middleware import RateLimitMiddleware

from app.auth.routes import router as auth_router
from app.users.routes import router as users_router
from app.products.routes import (
    router as products_router,
    categories_router
)
from app.warehouses.routes import router as warehouses_router
from app.inventory.routes import router as inventory_router
from app.dashboard.routes import router as dashboard_router
from app.analytics.routes import router as analytics_router
from app.reports.routes import router as reports_router
from app.notifications.routes import router as notifications_router
from app.audit.routes import router as audit_router
from app.settings.routes import router as settings_router

from app.websocket.inventory_socket import router as ws_inventory_router
from app.websocket.notifications_socket import router as ws_notifications_router
from app.websocket.user_socket import router as ws_user_router

from app.tasks.scheduler import start_scheduler


# =========================
# APPLICATION LIFESPAN
# =========================

@asynccontextmanager
async def lifespan(app: FastAPI):

    print("🚀 Starting Smart Inventory ERP...")

    # Initialize Database
    await init_db()

    # Start Background Scheduler
    start_scheduler()

    yield

    print("🛑 Shutting down application...")


# =========================
# FASTAPI APP
# =========================

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    lifespan=lifespan
)


# =========================
# CUSTOM MIDDLEWARES
# =========================

app.add_middleware(RateLimitMiddleware)

app.add_middleware(AuthMiddleware)

app.add_middleware(LoggingMiddleware)


# =========================
# CORS CONFIGURATION (Must be last - executes first)
# =========================

setup_cors(app)


# =========================
# API ROUTES
# =========================

app.include_router(auth_router)

app.include_router(users_router)

app.include_router(products_router)

app.include_router(categories_router)

app.include_router(warehouses_router)

app.include_router(inventory_router)

app.include_router(dashboard_router)

app.include_router(analytics_router)

app.include_router(reports_router)

app.include_router(notifications_router)

app.include_router(audit_router)

app.include_router(settings_router)


# =========================
# WEBSOCKET ROUTES
# =========================

app.include_router(ws_inventory_router)

app.include_router(ws_notifications_router)

app.include_router(ws_user_router)


# =========================
# ROOT & HEALTH ROUTES
# =========================

@app.get("/")
async def root():

    return {
        "message": "Welcome to Smart Inventory ERP",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "ok"}