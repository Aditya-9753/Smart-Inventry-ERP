"""
Tests for warehouse endpoints:
  GET/POST/PUT/DELETE /api/warehouses
  GET /api/warehouses/{id}/stock
  Stock tracking after inventory transactions
"""
import pytest

pytestmark = pytest.mark.asyncio


class TestWarehouseList:
    async def test_list_warehouses_authenticated(self, client, admin_headers):
        response = await client.get("/api/warehouses", headers=admin_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    async def test_list_warehouses_unauthenticated(self, client):
        response = await client.get("/api/warehouses")
        assert response.status_code == 401


class TestWarehouseCreate:
    async def test_create_warehouse_admin(self, client, admin_headers):
        response = await client.post("/api/warehouses", json={
            "name": "Test Warehouse Alpha",
            "location": "Zone A, Row 3",
            "capacity": 3000
        }, headers=admin_headers)
        assert response.status_code in (200, 201)
        data = response.json()
        assert data["name"] == "Test Warehouse Alpha"
        assert data["is_active"] is True   # Defaults to active

    async def test_create_warehouse_missing_name(self, client, admin_headers):
        response = await client.post("/api/warehouses", json={
            "location": "Somewhere",
            "capacity": 1000
        }, headers=admin_headers)
        assert response.status_code == 422

    async def test_create_warehouse_negative_capacity(self, client, admin_headers):
        response = await client.post("/api/warehouses", json={
            "name": "Bad Capacity",
            "location": "Void",
            "capacity": -500
        }, headers=admin_headers)
        assert response.status_code == 422

    async def test_create_warehouse_staff_forbidden(self, client, staff_headers):
        response = await client.post("/api/warehouses", json={
            "name": "Staff Warehouse",
            "location": "Staff Zone",
            "capacity": 100
        }, headers=staff_headers)
        assert response.status_code in (401, 403)


class TestWarehouseGet:
    async def test_get_warehouse_by_id(self, client, admin_headers, sample_warehouse):
        response = await client.get(f"/api/warehouses/{sample_warehouse.id}", headers=admin_headers)
        assert response.status_code == 200
        assert response.json()["name"] == sample_warehouse.name

    async def test_get_nonexistent_warehouse(self, client, admin_headers):
        response = await client.get("/api/warehouses/000000000000000000000000", headers=admin_headers)
        assert response.status_code == 404


class TestWarehouseUpdate:
    async def test_update_warehouse_name(self, client, admin_headers, sample_warehouse):
        response = await client.put(
            f"/api/warehouses/{sample_warehouse.id}",
            json={"name": "Renamed Warehouse"},
            headers=admin_headers
        )
        assert response.status_code == 200
        assert response.json()["name"] == "Renamed Warehouse"

    async def test_deactivate_warehouse(self, client, admin_headers, sample_warehouse):
        response = await client.put(
            f"/api/warehouses/{sample_warehouse.id}",
            json={"is_active": False},
            headers=admin_headers
        )
        assert response.status_code == 200
        assert response.json()["is_active"] is False


class TestWarehouseDelete:
    async def test_delete_warehouse_admin(self, client, admin_headers):
        create = await client.post("/api/warehouses", json={
            "name": "To Delete",
            "location": "Temp",
            "capacity": 100
        }, headers=admin_headers)
        wh_id = create.json()["id"]

        delete = await client.delete(f"/api/warehouses/{wh_id}", headers=admin_headers)
        assert delete.status_code in (200, 204)


class TestWarehouseStock:
    async def test_stock_tracked_after_inward(self, client, admin_headers, sample_product, sample_warehouse):
        """After an inward transaction, warehouse stock must reflect the change."""
        await client.post("/api/inventory/inward", json={
            "product_id": str(sample_product.id),
            "warehouse_id": str(sample_warehouse.id),
            "quantity": 25,
        }, headers=admin_headers)

        response = await client.get(
            f"/api/warehouses/{sample_warehouse.id}/stock",
            headers=admin_headers
        )
        assert response.status_code == 200
        stock = response.json()
        product_stock = next(
            (s for s in stock if s["product_id"] == str(sample_product.id)), None
        )
        assert product_stock is not None
        assert product_stock["quantity"] >= 25

    async def test_empty_warehouse_returns_empty_stock(self, client, admin_headers):
        """A brand new warehouse should have zero stock."""
        create = await client.post("/api/warehouses", json={
            "name": "Empty Warehouse",
            "location": "Ghost Zone",
            "capacity": 500
        }, headers=admin_headers)
        wh_id = create.json()["id"]

        response = await client.get(f"/api/warehouses/{wh_id}/stock", headers=admin_headers)
        assert response.status_code == 200
        assert len(response.json()) == 0

        await client.delete(f"/api/warehouses/{wh_id}", headers=admin_headers)
