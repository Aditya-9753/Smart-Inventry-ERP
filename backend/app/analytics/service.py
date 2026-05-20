from app.analytics import calculations, charts

async def get_inventory_trends():
    data = await calculations.get_inventory_trends(30)
    return charts.format_trend_data_for_recharts(data)

async def get_fast_moving_products():
    return await calculations.get_fast_moving_products(10)

async def get_dead_stock():
    return await calculations.get_dead_stock(30)

async def get_user_activity():
    return await calculations.get_user_activity()
