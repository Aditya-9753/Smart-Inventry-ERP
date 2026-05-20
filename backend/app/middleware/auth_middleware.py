from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.jwt_handler import decode_token
from app.users.models import User
from beanie import PydanticObjectId

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Allow requests without auth headers to proceed to normal routes which might not need auth
        # Or routes will have Depends(get_current_user).
        # We can attach the user to request.state.user
        request.state.user = None
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            payload = decode_token(token)
            if payload:
                user_id = payload.get("sub")
                if user_id:
                    try:
                        user = await User.get(PydanticObjectId(user_id))
                        if user and user.is_active:
                            request.state.user = user
                    except Exception:
                        pass
        
        response = await call_next(request)
        return response
