import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/authSlice';
import productReducer from '../redux/productSlice';
import inventoryReducer from '../redux/inventorySlice';
import dashboardReducer from '../redux/dashboardSlice';
import userReducer from '../redux/userSlice';
import notificationReducer from '../redux/notificationSlice';
import warehouseReducer from '../redux/warehouseSlice';
import analyticsReducer from '../redux/analyticsSlice';
import uiReducer from '../redux/uiSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        inventory: inventoryReducer,
        dashboard: dashboardReducer,
        users: userReducer,
        notifications: notificationReducer,
        warehouses: warehouseReducer,
        analytics: analyticsReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false // Disable if date objects cause issues
    })
});
