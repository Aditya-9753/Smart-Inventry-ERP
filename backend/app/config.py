from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Smart Inventory ERP"
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "smart_inventory"
    SECRET_KEY: str = "dev-secret-key-change-before-production-minimum-32-chars-required"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_PASSWORD: Optional[str] = None
    FRONTEND_URL: str = "http://localhost:5173"
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    
    # Email settings
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM_NAME: str = "Smart Inventory ERP"
    EMAILS_ENABLED: bool = False

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="allow"
    )
    
    @field_validator("SECRET_KEY", mode="before")
    @classmethod
    def validate_secret_key(cls, v):
        if not v:
            raise ValueError("SECRET_KEY must be set in environment variables")
        if len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters long")
        
        # Prevent using default dev key in production
        is_prod = os.getenv("APP_ENV", "development").lower() == "production"
        is_default = v == "dev-secret-key-change-before-production-minimum-32-chars-required"
        if is_prod and is_default:
            raise ValueError("SECRET_KEY must be changed to a secure, unique key in production")
            
        return v

settings = Settings()

