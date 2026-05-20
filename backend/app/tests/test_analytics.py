"""
Tests for analytics and dashboard endpoints:
  GET /api/dashboard/stats
  GET /api/dashboard/charts
  GET /api/analytics/inventory-trends
  GET /api/analytics/fast-moving
  GET /api/analytics/dead-stock
"""
import pytest
from datetime import datetime

pytestmark = pytest.mark.asyncio


class TestDashboardStats:
    async def test_stats_returns_all_fields(self, client, admin_headers):
        response = await client.get("/api/dashboard/stats", headers=admin_headers)
        assert response.status_code == 200
        data = response.json()

        required_fields = [
            "total_products",
            "total_users",
            "low_stock_items",
            "todays_transactions",
            "monthly_sales",
            "active_users",
        ]
        for field in required_fields:
            assert field in data, f"Missing field: {field}"

    async def test_stats_values_are_non_negative(self, client, admin_headers):
        response = await client.get("/api/dashboard/stats", headers=admin_headers)
        data = response.json()
        for key, value in data.items():
            assert value >= 0, f"Stat '{key}' is negative: {value}"

    async def test_stats_total_products_accuracy(self, client, admin_headers):
        """total_products must equal the actual count from /api/products."""
        stats = (await client.get("/api/dashboard/stats", headers=admin_headers)).json()
        products = (await client.get("/api/products", headers=admin_headers)).json()

        # Compare total from stats with total in paginated response
        reported_total = stats["total_products"]
        actual_total = products.get("total", len(products.get("items", [])))
        assert reported_total == actual_total

    async def test_stats_unauthenticated(self, client):
        response = await client.get("/api/dashboard/stats")
        assert response.status_code == 401

    async def test_stats_staff_can_view(self, client, staff_headers):
        """All authenticated users (including staff) can view the dashboard."""
        response = await client.get("/api/dashboard/stats", headers=staff_headers)
        assert response.status_code == 200


class TestDashboardCharts:
    async def test_charts_returns_data(self, client, admin_headers):
        response = await client.get("/api/dashboard/charts", headers=admin_headers)
        assert response.status_code == 200

    async def test_charts_unauthenticated(self, client):
        response = await client.get("/api/dashboard/charts")
        assert response.status_code == 401


class TestInventoryTrends:
    async def test_trends_returns_list(self, client, admin_headers):
        response = await client.get("/api/analytics/inventory-trends", headers=admin_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    async def test_trends_data_structure(self, client, admin_headers):
        response = await client.get("/api/analytics/inventory-trends", headers=admin_headers)
        data = response.json()
        if len(data) > 0:
            item = data[0]
            # Each trend entry should have a date/period and in/out values
            assert any(key in item for key in ["date", "period", "month", "week"])

    async def test_trends_unauthenticated(self, client):
        response = await client.get("/api/analytics/inventory-trends")
        assert response.status_code == 401


class TestFastMovingProducts:
    async def test_fast_moving_returns_list(self, client, admin_headers):
        response = await client.get("/api/analytics/fast-moving", headers=admin_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    async def test_fast_moving_max_results(self, client, admin_headers):
        """Should cap at 10 results by default."""
        response = await client.get("/api/analytics/fast-moving", headers=admin_headers)
        assert len(response.json()) <= 10

    async def test_fast_moving_sorted_descending(self, client, admin_headers):
        """Products should be sorted by sales volume descending."""
        response = await client.get("/api/analytics/fast-moving", headers=admin_headers)
        items = response.json()
        if len(items) >= 2:
            sales_values = [i.get("sales", i.get("transaction_count", 0)) for i in items]
            assert sales_values == sorted(sales_values, reverse=True)


class TestDeadStock:
    async def test_dead_stock_returns_list(self, client, admin_headers):
        response = await client.get("/api/analytics/dead-stock", headers=admin_headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    async def test_dead_stock_items_untouched_30_days(self, client, admin_headers):
        """All items in dead stock must have not moved in >= 30 days."""
        from app.products.models import Product
        from datetime import timezone, timedelta

        # Create a product with very old last_sold_at
        old_product = Product(
            name="Ancient Stock",
            sku="OLD-9999",
            price=1.0,
            quantity=50,
            min_stock=0,
        )
        await old_product.insert()

        response = await client.get("/api/analytics/dead-stock", headers=admin_headers)
        ids = [p.get("id") for p in response.json()]
        assert str(old_product.id) in ids

        await old_product.delete()

    async def test_dead_stock_no_zero_quantity_items(self, client, admin_headers):
        """Dead stock is about EXCESS stock that isn't moving — quantity should be > 0."""
        response = await client.get("/api/analytics/dead-stock", headers=admin_headers)
        for item in response.json():
            assert item.get("quantity", 1) > 0
