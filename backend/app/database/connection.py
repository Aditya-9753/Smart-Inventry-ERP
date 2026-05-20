from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

# Create a single shared Motor client
# Motor 3.3.x is compatible with Beanie 1.26.x
client: AsyncIOMotorClient = AsyncIOMotorClient(
    settings.MONGODB_URL,
    serverSelectionTimeoutMS=5000,    # Fail fast if MongoDB unreachable
    connectTimeoutMS=5000,
)

# This is an AsyncIOMotorDatabase object — correct type for init_beanie(database=...)
db = client[settings.DATABASE_NAME]
