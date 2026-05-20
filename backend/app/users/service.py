from typing import List
from fastapi import HTTPException
from app.users.schemas import UserCreate, UserUpdate, UserResponse
from app.users.models import User
from app.users.repository import UserRepository
from app.core.security import get_password_hash

user_repo = UserRepository()

async def get_users() -> List[UserResponse]:
    users = await user_repo.get_all()
    return [
        UserResponse(
            id=str(user.id),
            name=user.name,
            email=user.email,
            role_id=user.role_id,
            is_active=user.is_active
        ) for user in users
    ]

async def create_user(data: UserCreate) -> UserResponse:
    existing_user = await user_repo.get_by_email(data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    user = User(
        name=data.name,
        email=data.email,
        hashed_password=get_password_hash(data.password),
        role_id=data.role_id,
        is_active=True
    )
    user = await user_repo.create(user)
    
    return UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        role_id=user.role_id,
        is_active=user.is_active
    )

async def get_user(user_id: str) -> UserResponse:
    user = await user_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        role_id=user.role_id,
        is_active=user.is_active
    )

async def update_user(user_id: str, data: UserUpdate) -> UserResponse:
    user = await user_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if data.name is not None:
        user.name = data.name
    if data.email is not None and data.email != user.email:
        existing_user = await user_repo.get_by_email(data.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        user.email = data.email
    if data.role_id is not None:
        user.role_id = data.role_id
    if data.is_active is not None:
        user.is_active = data.is_active
        
    user = await user_repo.update(user)
    
    return UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        role_id=user.role_id,
        is_active=user.is_active
    )

async def delete_user(user_id: str):
    user = await user_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    await user_repo.delete(user)
    return {"message": "User deleted successfully"}
