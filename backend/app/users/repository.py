from typing import List, Optional
from app.users.models import User
from beanie import PydanticObjectId

class UserRepository:
    async def get_all(self) -> List[User]:
        return await User.find_all().to_list()

    async def get_by_id(self, user_id: str) -> Optional[User]:
        return await User.get(PydanticObjectId(user_id))

    async def get_by_email(self, email: str) -> Optional[User]:
        return await User.find_one(User.email == email)

    async def create(self, user: User) -> User:
        return await user.insert()

    async def update(self, user: User) -> User:
        return await user.save()

    async def delete(self, user: User) -> None:
        await user.delete()
