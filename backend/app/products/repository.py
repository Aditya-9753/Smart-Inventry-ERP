from typing import List, Tuple, Optional
from beanie import PydanticObjectId
from app.products.models import Product, Category

class ProductRepository:
    async def get_all(self, skip: int = 0, limit: int = 10, search: Optional[str] = None, category_id: Optional[str] = None) -> Tuple[List[Product], int]:
        query = {}
        if search:
            query["name"] = {"$regex": search, "$options": "i"}
        if category_id:
            query["category_id"] = category_id
            
        products_cursor = Product.find(query)
        total = await products_cursor.count()
        products = await products_cursor.skip(skip).limit(limit).to_list()
        
        return products, total

    async def get_by_id(self, product_id: str) -> Optional[Product]:
        return await Product.get(PydanticObjectId(product_id))

    async def create(self, product: Product) -> Product:
        return await product.insert()

    async def update(self, product: Product) -> Product:
        return await product.save()

    async def delete(self, product: Product) -> None:
        await product.delete()

class CategoryRepository:
    async def get_all(self) -> List[Category]:
        return await Category.find_all().to_list()
        
    async def get_by_id(self, category_id: str) -> Optional[Category]:
        return await Category.get(PydanticObjectId(category_id))
        
    async def create(self, category: Category) -> Category:
        return await category.insert()
