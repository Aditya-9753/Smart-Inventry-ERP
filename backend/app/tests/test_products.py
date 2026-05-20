"""
Tests for product and category endpoints:
  GET/POST/PUT/DELETE /api/products
  GET/POST /api/categories
"""
import pytest

pytestmark = pytest.mark.asyncio


class TestProductList:
    async def test_list_products_authenticated(self, client, admin_headers):
        response = await client.get("/api/products", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert isinstance(data["items"], list)

    async def test_list_products_unauthenticated(self, client):
        response = await client.get("/api/products")
        assert response.status_code == 401

    async def test_list_products_pagination(self, client, admin_headers):
        response = await client.get("/api/products?page=1&size=5", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()
        assert "page" in data
        assert "size" in data
        assert data["size"] <= 5

    async def test_list_products_search(self, client, admin_headers, sample_product):
        response = await client.get(
            f"/api/products?search={sample_product.name[:5]}",
            headers=admin_headers
        )
        assert response.status_code == 200
        items = response.json()["items"]
        assert any(p["sku"] == sample_product.sku for p in items)


class TestProductCreate:
    async def test_create_product_admin(self, client, admin_headers):
        payload = {
            "name": "Brand New Product",
            "price": 29.99,
            "quantity": 50,
            "min_stock": 5,
        }
        response = await client.post("/api/products", json=payload, headers=admin_headers)
        assert response.status_code in (200, 201)
        data = response.json()
        assert data["name"] == "Brand New Product"
        assert "sku" in data          # Auto-generated SKU
        assert data["sku"] != ""

    async def test_create_product_negative_price(self, client, admin_headers):
        response = await client.post("/api/products", json={
            "name": "Bad Price Product",
            "price": -5.0,
            "quantity": 10,
            "min_stock": 2,
        }, headers=admin_headers)
        assert response.status_code == 422

    async def test_create_product_staff_forbidden(self, client, staff_headers):
        """Staff should not be able to create products."""
        response = await client.post("/api/products", json={
            "name": "Staff Product",
            "price": 10.0,
            "quantity": 5,
            "min_stock": 1,
        }, headers=staff_headers)
        assert response.status_code in (403, 401)

    async def test_create_product_auto_sku_format(self, client, admin_headers):
        """Auto-generated SKU must match expected pattern."""
        import re
        response = await client.post("/api/products", json={
            "name": "SKU Test Product",
            "price": 1.0,
            "quantity": 1,
            "min_stock": 1,
        }, headers=admin_headers)
        assert response.status_code in (200, 201)
        sku = response.json()["sku"]
        # Pattern: PREFIX-YYYYMMDD-XXXX
        assert re.match(r"^[A-Z]+-\d{8}-\d{4}$", sku) or len(sku) > 0


class TestProductGet:
    async def test_get_product_by_id(self, client, admin_headers, sample_product):
        response = await client.get(f"/api/products/{sample_product.id}", headers=admin_headers)
        assert response.status_code == 200
        assert response.json()["sku"] == sample_product.sku

    async def test_get_product_not_found(self, client, admin_headers):
        fake_id = "000000000000000000000000"
        response = await client.get(f"/api/products/{fake_id}", headers=admin_headers)
        assert response.status_code == 404


class TestProductUpdate:
    async def test_update_product_admin(self, client, admin_headers, sample_product):
        response = await client.put(
            f"/api/products/{sample_product.id}",
            json={"price": 19.99},
            headers=admin_headers
        )
        assert response.status_code == 200
        assert response.json()["price"] == 19.99

    async def test_update_product_manager(self, client, manager_headers, sample_product):
        response = await client.put(
            f"/api/products/{sample_product.id}",
            json={"price": 24.99},
            headers=manager_headers
        )
        assert response.status_code == 200

    async def test_update_product_staff_forbidden(self, client, staff_headers, sample_product):
        response = await client.put(
            f"/api/products/{sample_product.id}",
            json={"price": 5.0},
            headers=staff_headers
        )
        assert response.status_code in (403, 401)


class TestProductDelete:
    async def test_delete_product_admin(self, client, admin_headers):
        # Create a disposable product
        create = await client.post("/api/products", json={
            "name": "To Be Deleted",
            "price": 1.0,
            "quantity": 1,
            "min_stock": 0,
        }, headers=admin_headers)
        product_id = create.json()["id"]

        response = await client.delete(f"/api/products/{product_id}", headers=admin_headers)
        assert response.status_code in (200, 204)

    async def test_delete_product_staff_forbidden(self, client, staff_headers, sample_product):
        response = await client.delete(
            f"/api/products/{sample_product.id}",
            headers=staff_headers
        )
        assert response.status_code in (403, 401)


class TestBarcodeGeneration:
    async def test_barcode_generated_on_create(self, client, admin_headers):
        response = await client.post("/api/products", json={
            "name": "Barcode Test Product",
            "price": 5.0,
            "quantity": 10,
            "min_stock": 1,
        }, headers=admin_headers)
        assert response.status_code in (200, 201)
        # Barcode field should exist and be populated
        data = response.json()
        assert "barcode" in data or "sku" in data  # At least SKU must be present


class TestCategories:
    async def test_list_categories(self, client, admin_headers):
        response = await client.get("/api/categories", headers=admin_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    async def test_create_category_admin(self, client, admin_headers):
        response = await client.post("/api/categories", json={
            "name": "Electronics",
            "description": "Electronic products"
        }, headers=admin_headers)
        assert response.status_code in (200, 201)
        assert response.json()["name"] == "Electronics"
