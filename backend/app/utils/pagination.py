from typing import TypeVar, Generic, Sequence
from pydantic import BaseModel

T = TypeVar('T')

class Pagination(BaseModel, Generic[T]):
    items: Sequence[T]
    total: int
    page: int
    size: int
    pages: int

def paginate(items: Sequence[T], total: int, page: int, size: int) -> Pagination[T]:
    pages = (total + size - 1) // size if size > 0 else 0
    return Pagination(
        items=items,
        total=total,
        page=page,
        size=size,
        pages=pages
    )
