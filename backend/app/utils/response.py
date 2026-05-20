from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel

T = TypeVar("T")

class StandardResponse(BaseModel, Generic[T]):
    success: bool
    message: str
    data: Optional[T] = None
    
def success_response(data: Any, message: str = "Success") -> StandardResponse:
    return StandardResponse(success=True, message=message, data=data)

def error_response(message: str, data: Any = None) -> StandardResponse:
    return StandardResponse(success=False, message=message, data=data)
