from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status
from app.auth.schemas import LoginRequest, RegisterRequest, TokenResponse, RefreshTokenRequest, ForgotPasswordRequest, ResetPasswordRequest, AuthUserResponse
from app.users.models import User
from app.users.models import Role
from app.auth.models import Session
from app.core.security import verify_password, get_password_hash
from app.core.jwt_handler import create_access_token, create_refresh_token, decode_token
from app.auth.utils import send_reset_password_email
from app.config import settings
from beanie import PydanticObjectId
import redis.asyncio as redis

# Redis setup for token blacklist
redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)

async def resolve_role(role_id: str | None, default_name: str = "VIEWER") -> Role | None:
    role = None
    if role_id:
        try:
            role = await Role.get(PydanticObjectId(role_id))
        except Exception:
            role = await Role.find_one(Role.name == role_id.upper())

    if role:
        return role

    return await Role.find_one(Role.name == default_name)

async def register(data: RegisterRequest):
    existing_user = await User.find_one(User.email == data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    role = await resolve_role(data.role_id)
    role_id = str(role.id) if role else None
    
    user = User(
        name=data.name,
        email=data.email,
        hashed_password=get_password_hash(data.password),
        role_id=role_id,
        is_active=True
    )
    await user.insert()
    return {"message": "User created successfully"}

async def login(data: LoginRequest) -> TokenResponse:
    user = await User.find_one(User.email == data.email)
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    
    access_token = create_access_token(subject=str(user.id))
    refresh_token = create_refresh_token(subject=str(user.id))
    
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    session = Session(
        user_id=str(user.id),
        token=refresh_token,
        expires_at=expires_at
    )
    await session.insert()
    
    role = await resolve_role(user.role_id)
    if role and user.role_id != str(role.id):
        user.role_id = str(role.id)
        await user.save()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=AuthUserResponse(
            id=str(user.id),
            name=user.name,
            email=user.email,
            role_id=role.name if role else user.role_id,
        ),
    )

async def refresh_token(data: RefreshTokenRequest) -> TokenResponse:
    is_blacklisted = await redis_client.get(f"blacklist:{data.refresh_token}")
    if is_blacklisted:
        raise HTTPException(status_code=401, detail="Token blacklisted")

    payload = decode_token(data.refresh_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
        
    user_id = payload.get("sub")
    session = await Session.find_one(Session.token == data.refresh_token)
    
    if not session or session.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Refresh token expired or invalid")
        
    access_token = create_access_token(subject=user_id)
    return TokenResponse(access_token=access_token, refresh_token=data.refresh_token)

async def logout(token: str):
    payload = decode_token(token)
    if payload:
        exp = payload.get("exp", 0)
        now = datetime.now(timezone.utc).timestamp()
        ttl = max(0, int(exp - now))
        if ttl > 0:
            await redis_client.setex(f"blacklist:{token}", ttl, "true")
            
    session = await Session.find_one(Session.token == token)
    if session:
        await session.delete()
    return {"message": "Logged out successfully"}

async def forgot_password(data: ForgotPasswordRequest):
    user = await User.find_one(User.email == data.email)
    if not user:
        # Don't reveal that the user doesn't exist
        return {"message": "If the email is registered, a password reset link has been sent."}
    
    reset_token = create_access_token(subject=str(user.id), expires_delta=timedelta(minutes=15))
    send_reset_password_email(data.email, user.email, reset_token)
    return {"message": "If the email is registered, a password reset link has been sent."}

async def reset_password(data: ResetPasswordRequest):
    payload = decode_token(data.token)
    if not payload:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
        
    user_id = payload.get("sub")
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid user")
        
    user.hashed_password = get_password_hash(data.new_password)
    await user.save()
    
    # Blacklist the reset token after successful use to prevent reuse
    exp = payload.get("exp", 0)
    now = datetime.now(timezone.utc).timestamp()
    ttl = max(0, int(exp - now))
    if ttl > 0:
        await redis_client.setex(f"blacklist:{data.token}", ttl, "true")
    
    return {"message": "Password reset successfully"}
