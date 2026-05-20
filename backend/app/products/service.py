from fastapi import HTTPException
from app.products.schemas import ProductCreate, ProductUpdate, ProductResponse, CategoryCreate, CategoryResponse
from app.products.models import Product, Category
from app.products.repository import ProductRepository, CategoryRepository
from app.products.validators import validate_price, validate_sku_uniqueness
from app.utils.sku_generator import generate_sku
from app.utils.barcode_utils import generate_barcode, generate_qr_code
from app.utils.pagination import paginate, Pagination
from typing import Optional

product_repo = ProductRepository()
category_repo = CategoryRepository()

async def get_products(page: int = 1, size: int = 10, search: Optional[str] = None, category_id: Optional[str] = None) -> Pagination[ProductResponse]:
    skip = (page - 1) * size
    products, total = await product_repo.get_all(skip=skip, limit=size, search=search, category_id=category_id)
    
    product_responses = [
        ProductResponse(
            id=str(p.id),
            name=p.name,
            sku=p.sku,
            barcode=p.barcode,
            category_id=p.category_id,
            quantity=p.quantity,
            price=p.price,
            min_stock=p.min_stock,
            image=p.image
        ) for p in products
    ]
    
    return paginate(items=product_responses, total=total, page=page, size=size)

async def get_product(product_id: str) -> ProductResponse:
    product = await product_repo.get_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    return ProductResponse(
        id=str(product.id),
        name=product.name,
        sku=product.sku,
        barcode=product.barcode,
        category_id=product.category_id,
        quantity=product.quantity,
        price=product.price,
        min_stock=product.min_stock,
        image=product.image
    )

async def create_product(data: ProductCreate) -> ProductResponse:
    await validate_price(data.price)
    
    cat_prefix = "GEN"
    if data.category_id:
        category = await category_repo.get_by_id(data.category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        cat_prefix = category.name
        
    sku = generate_sku(cat_prefix)
    await validate_sku_uniqueness(sku)
    
    product = Product(
        name=data.name,
        sku=sku,
        category_id=data.category_id,
        price=data.price,
        min_stock=data.min_stock,
        image=data.image
    )
    product = await product_repo.create(product)
    
    # Generate barcode and QR code after product is created (need ID for QR)
    barcode_path = generate_barcode(sku)
    qr_path = generate_qr_code(str(product.id), sku)
    
    product.barcode = barcode_path
    product = await product_repo.update(product)
    
    return await get_product(str(product.id))

async def update_product(product_id: str, data: ProductUpdate) -> ProductResponse:
    product = await product_repo.get_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    if data.price is not None:
        await validate_price(data.price)
        product.price = data.price
        
    if data.category_id is not None:
        category = await category_repo.get_by_id(data.category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        product.category_id = data.category_id
        
    if data.name is not None:
        product.name = data.name
    if data.min_stock is not None:
        product.min_stock = data.min_stock
    if data.image is not None:
        product.image = data.image
        
    await product_repo.update(product)
    return await get_product(str(product.id))

async def delete_product(product_id: str):
    product = await product_repo.get_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    await product_repo.delete(product)
    return {"message": "Product deleted successfully"}

# Category Service methods
async def get_categories():
    categories = await category_repo.get_all()
    return [CategoryResponse(id=str(c.id), name=c.name, description=c.description) for c in categories]

async def create_category(data: CategoryCreate):
    category = Category(name=data.name, description=data.description)
    category = await category_repo.create(category)
    return CategoryResponse(id=str(category.id), name=category.name, description=category.description)
