from app.dashboard import stats

async def get_dashboard_stats():
    return {
        "total_products": await stats.get_total_products(),
        "total_users": await stats.get_total_users(),
        "low_stock_items": await stats.get_low_stock_items_count(),
        "todays_transactions": await stats.get_todays_transactions_count(),
        "monthly_sales": await stats.get_monthly_sales(),
        "active_users": await stats.get_active_users_count()
    }

async def get_dashboard_charts():
    # Simple mock for now, analytics/charts.py will have detailed logic
    return {
        "inventory_movement": [
            {"date": "2026-05-18", "in": 120, "out": 80},
            {"date": "2026-05-19", "in": 50, "out": 100}
        ]
    }
