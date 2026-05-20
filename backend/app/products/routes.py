from fastapi import APIRouter, Depends, Query
from app.products.schemas import ProductCreate, ProductUpdate, ProductResponse, CategoryCreate, CategoryResponse
from app.products import service
from app.core.permissions import require_permission
from app.users.models import User
from app.utils.pagination import Pagination
from typing import List, Optional

router = APIRouter(prefix="/api/products", tags=["products"])
categories_router = APIRouter(prefix="/api/categories", tags=["categories"])

@router.get("", response_model=Pagination[ProductResponse])
async def get_products(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    category_id: Optional[str] = None,
    current_user: User = Depends(require_permission("products", "read"))
):
    return await service.get_products(page, size, search, category_id)

@router.get("/{id}", response_model=ProductResponse)
async def get_product(id: str, current_user: User = Depends(require_permission("products", "read"))):
    return await service.get_product(id)

@router.post("", response_model=ProductResponse)
async def create_product(data: ProductCreate, current_user: User = Depends(require_permission("products", "write"))):
    return await service.create_product(data)

@router.put("/{id}", response_model=ProductResponse)
async def update_product(id: str, data: ProductUpdate, current_user: User = Depends(require_permission("products", "write"))):
    return await service.update_product(id, data)

@router.delete("/{id}")
async def delete_product(id: str, current_user: User = Depends(require_permission("products", "delete"))):
    return await service.delete_product(id)

@categories_router.get("", response_model=List[CategoryResponse])
async def get_categories(current_user: User = Depends(require_permission("products", "read"))):
    return await service.get_categories()

@categories_router.post("", response_model=CategoryResponse)
async def create_category(data: CategoryCreate, current_user: User = Depends(require_permission("products", "write"))):
    return await service.create_category(data)
