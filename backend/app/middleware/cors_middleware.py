from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

def setup_cors(app):
    # Parse allowed origins from environment or use defaults
    if hasattr(settings, 'ALLOWED_ORIGINS') and settings.ALLOWED_ORIGINS:
        allowed_origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(',')]
    else:
        allowed_origins = [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
        ]
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allow_headers=[
            "Content-Type",
            "Authorization",
            "Accept",
            "X-Requested-With",
        ],
        max_age=600,  # Cache preflight requests for 10 minutes
        expose_headers=["Content-Disposition", "X-Total-Count"],
    )
