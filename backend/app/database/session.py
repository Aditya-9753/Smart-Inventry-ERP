from typing import AsyncGenerator
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.connection import db

async def get_db() -> AsyncGenerator[AsyncIOMotorDatabase, None]:
    yield db
