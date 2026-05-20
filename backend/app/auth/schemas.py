from typing import Optional
from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class AuthUserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role_id: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: Optional[AuthUserResponse] = None

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role_id: Optional[str] = None
    
class RefreshTokenRequest(BaseModel):
    refresh_token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
