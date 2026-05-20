from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from app.core.jwt_handler import decode_token
from app.core.exceptions import CredentialsException, InvalidTokenException
from app.users.models import User
from beanie import PydanticObjectId

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    payload = decode_token(token)
    if payload is None:
        raise InvalidTokenException()
    
    user_id: str = payload.get("sub")
    if user_id is None:
        raise CredentialsException()
    
    try:
        user = await User.get(PydanticObjectId(user_id))
    except Exception:
        user = None

    if user is None:
        raise CredentialsException()
    
    if not user.is_active:
        raise CredentialsException()
        
    return user
