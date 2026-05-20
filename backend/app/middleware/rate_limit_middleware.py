from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import redis.asyncio as redis
from app.config import settings

# This is a very simple token bucket rate limiting using Redis
class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.redis = redis.from_url(settings.REDIS_URL, decode_responses=True)
        self.rate_limit = 100 # requests per minute
        self.window = 60

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        key = f"rate_limit:{client_ip}"
        
        try:
            current_count = await self.redis.get(key)
            if current_count and int(current_count) > self.rate_limit:
                return HTTPException(status_code=429, detail="Too many requests")
                
            pipe = self.redis.pipeline()
            pipe.incr(key, 1)
            pipe.expire(key, self.window)
            await pipe.execute()
        except Exception:
            # If Redis is down, we can either fail open or closed. Failing open for now.
            pass
            
        return await call_next(request)
