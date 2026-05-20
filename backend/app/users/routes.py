from typing import List
from fastapi import APIRouter, Depends
from app.users.schemas import UserCreate, UserUpdate, UserResponse
from app.users import service
from app.core.permissions import require_permission
from app.users.models import User

router = APIRouter(prefix="/api/users", tags=["users"])

# Only Admins should be able to access these routes. We can use the permission checker.
# As a simplified approach from require_permission(module, action):
# Admin role implicitly passes all permission checks in `require_permission`

@router.get("", response_model=List[UserResponse])
async def get_users(current_user: User = Depends(require_permission("users", "read"))):
    return await service.get_users()

@router.post("", response_model=UserResponse)
async def create_user(data: UserCreate, current_user: User = Depends(require_permission("users", "write"))):
    return await service.create_user(data)

@router.get("/{id}", response_model=UserResponse)
async def get_user(id: str, current_user: User = Depends(require_permission("users", "read"))):
    return await service.get_user(id)

@router.put("/{id}", response_model=UserResponse)
async def update_user(id: str, data: UserUpdate, current_user: User = Depends(require_permission("users", "write"))):
    return await service.update_user(id, data)

@router.delete("/{id}")
async def delete_user(id: str, current_user: User = Depends(require_permission("users", "delete"))):
    return await service.delete_user(id)
