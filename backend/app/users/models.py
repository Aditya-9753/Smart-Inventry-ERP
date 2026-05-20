from typing import Optional
from beanie import Document
from pydantic import Field
from app.database.base import BaseDocument

class Role(Document):
    name: str
    description: Optional[str] = None

    class Settings:
        name = "roles"

class Permission(Document):
    role_id: str
    module: str
    can_read: bool = False
    can_write: bool = False
    can_delete: bool = False

    class Settings:
        name = "permissions"

class User(BaseDocument):
    name: str
    email: str
    hashed_password: str
    role_id: Optional[str] = None
    is_active: bool = True

    class Settings:
        name = "users"
