from fastapi import APIRouter, Depends, Header
from app.auth.schemas import LoginRequest, RegisterRequest, TokenResponse, RefreshTokenRequest, ForgotPasswordRequest, ResetPasswordRequest
from app.auth import service

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    return await service.login(data)

@router.post("/register")
async def register(data: RegisterRequest):
    return await service.register(data)

@router.post("/refresh", response_model=TokenResponse)
async def refresh(data: RefreshTokenRequest):
    return await service.refresh_token(data)

@router.post("/logout")
async def logout(authorization: str = Header(None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        return await service.logout(token)
    return {"message": "Logged out successfully"}

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest):
    return await service.forgot_password(data)

@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest):
    return await service.reset_password(data)
