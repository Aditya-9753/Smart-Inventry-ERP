"""
Tests for inventory transaction endpoints:
  POST /api/inventory/inward
  POST /api/inventory/outward
  POST /api/inventory/transfer
  GET  /api/inventory/history
  GET  /api/inventory/low-stock
"""
import pytest

pytestmark = pytest.mark.asyncio


class TestInwardTransaction:
    async def test_inward_success(self, client, admin_headers, sample_product, sample_warehouse):
        payload = {
            "product_id": str(sample_product.id),
            "warehouse_id": str(sample_warehouse.id),
            "quantity": 20,
            "remarks": "Initial stock receipt"
        }
        response = await client.post("/api/inventory/inward", json=payload, headers=admin_headers)
        assert response.status_code in (200, 201)
        data = response.json()
        assert data["type"] == "inward"
        assert data["quantity"] == 20

    async def test_inward_updates_stock(self, client, admin_headers, sample_product, sample_warehouse):
        """Stock quantity must increase after inward transaction."""
        # Fetch initial stock
        product_before = await client.get(
            f"/api/products/{sample_product.id}",
            headers=admin_headers
        )
        qty_before = product_before.json()["quantity"]

        await client.post("/api/inventory/inward", json={
            "product_id": str(sample_product.id),
            "warehouse_id": str(sample_warehouse.id),
            "quantity": 15,
        }, headers=admin_headers)

        product_after = await client.get(
            f"/api/products/{sample_product.id}",
            headers=admin_headers
        )
        qty_after = product_after.json()["quantity"]
        assert qty_after == qty_before + 15

    async def test_inward_zero_quantity_rejected(self, client, admin_headers, sample_product, sample_warehouse):
        response = await client.post("/api/inventory/inward", json={
            "product_id": str(sample_product.id),
            "warehouse_id": str(sample_warehouse.id),
            "quantity": 0,
        }, headers=admin_headers)
        assert response.status_code == 422

    async def test_inward_invalid_product_rejected(self, client, admin_headers, sample_warehouse):
        response = await client.post("/api/inventory/inward", json={
            "product_id": "000000000000000000000000",
            "warehouse_id": str(sample_warehouse.id),
            "quantity": 5,
        }, headers=admin_headers)
        assert response.status_code in (404, 400)


class TestOutwardTransaction:
    async def test_outward_success(self, client, admin_headers, sample_product, sample_warehouse):
        # First add stock
        await client.post("/api/inventory/inward", json={
            "product_id": str(sample_product.id),
            "warehouse_id": str(sample_warehouse.id),
            "quantity": 50,
        }, headers=admin_headers)

        response = await client.post("/api/inventory/outward", json={
            "product_id": str(sample_product.id),
            "warehouse_id": str(sample_warehouse.id),
            "quantity": 10,
            "remarks": "Customer order"
        }, headers=admin_headers)
        assert response.status_code in (200, 201)
        assert response.json()["type"] == "outward"

    async def test_outward_insufficient_stock_rejected(self, client, admin_headers, sample_warehouse):
        """Cannot ship more than available stock."""
        from app.products.models import Product
        product = Product(name="Empty Product", sku="EMPTY-001", price=1.0, quantity=0, min_stock=0)
        await product.insert()

        response = await client.post("/api/inventory/outward", json={
            "product_id": str(product.id),
            "warehouse_id": str(sample_warehouse.id),
            "quantity": 100,
        }, headers=admin_headers)
        assert response.status_code in (400, 422)
        await product.delete()

    async def test_outward_updates_stock(self, client, admin_headers, sample_product, sample_warehouse):
        """Stock must decrease after outward."""
        # Ensure there's enough stock
        await client.post("/api/inventory/inward", json={
            "product_id": str(sample_product.id),
            "warehouse_id": str(sample_warehouse.id),
            "quantity": 100,
        }, headers=admin_headers)

        before = (await client.get(f"/api/products/{sample_product.id}", headers=admin_headers)).json()["quantity"]

        await client.post("/api/inventory/outward", json={
            "product_id": str(sample_product.id),
            "warehouse_id": str(sample_warehouse.id),
            "quantity": 5,
        }, headers=admin_headers)

        after = (await client.get(f"/api/products/{sample_product.id}", headers=admin_headers)).json()["quantity"]
        assert after == before - 5


class TestTransferTransaction:
    async def test_transfer_between_warehouses(self, client, admin_headers, sample_product):
        from app.warehouses.models import Warehouse

        wh_b = Warehouse(name="Secondary Warehouse", location="Building B", capacity=2000, is_active=True)
        await wh_b.insert()

        wh_a = Warehouse(name="Primary Warehouse", location="Building A", capacity=5000, is_active=True)
        await wh_a.insert()

        # Stock up wh_a
        await client.post("/api/inventory/inward", json={
            "product_id": str(sample_product.id),
            "warehouse_id": str(wh_a.id),
            "quantity": 80,
        }, headers=admin_headers)

        response = await client.post("/api/inventory/transfer", json={
            "product_id": str(sample_product.id),
            "from_warehouse_id": str(wh_a.id),
            "to_warehouse_id": str(wh_b.id),
            "quantity": 30,
        }, headers=admin_headers)
        assert response.status_code in (200, 201)

        await wh_a.delete()
        await wh_b.delete()

    async def test_transfer_same_warehouse_rejected(self, client, admin_headers, sample_product, sample_warehouse):
        response = await client.post("/api/inventory/transfer", json={
            "product_id": str(sample_product.id),
            "from_warehouse_id": str(sample_warehouse.id),
            "to_warehouse_id": str(sample_warehouse.id),
            "quantity": 5,
        }, headers=admin_headers)
        assert response.status_code == 400


class TestTransactionHistory:
    async def test_history_returns_list(self, client, admin_headers):
        response = await client.get("/api/inventory/history", headers=admin_headers)
        assert response.status_code == 200

    async def test_history_pagination(self, client, admin_headers):
        response = await client.get("/api/inventory/history?page=1&size=5", headers=admin_headers)
        assert response.status_code == 200

    async def test_history_unauthenticated(self, client):
        response = await client.get("/api/inventory/history")
        assert response.status_code == 401


class TestLowStockCheck:
    async def test_low_stock_endpoint(self, client, admin_headers):
        response = await client.get("/api/inventory/low-stock", headers=admin_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    async def test_low_stock_includes_critical_items(self, client, admin_headers):
        """Products with quantity < min_stock must appear in low-stock list."""
        from app.products.models import Product
        critical = Product(name="Critical Stock", sku="CRIT-001", price=5.0, quantity=1, min_stock=50)
        await critical.insert()

        response = await client.get("/api/inventory/low-stock", headers=admin_headers)
        ids = [p["id"] for p in response.json()]
        assert str(critical.id) in ids

        await critical.delete()
