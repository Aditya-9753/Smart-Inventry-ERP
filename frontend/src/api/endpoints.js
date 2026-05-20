export const API_URLS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        REFRESH: '/api/auth/refresh',
        LOGOUT: '/api/auth/logout',
        FORGOT_PASSWORD: '/api/auth/forgot-password',
        RESET_PASSWORD: '/api/auth/reset-password'
    },
    PRODUCTS: '/api/products',
    CATEGORIES: '/api/categories',
    INVENTORY: {
        INWARD: '/api/inventory/inward',
        OUTWARD: '/api/inventory/outward',
        TRANSFER: '/api/inventory/transfer',
        HISTORY: '/api/inventory/history',
        LOW_STOCK: '/api/inventory/low-stock'
    },
    WAREHOUSES: '/api/warehouses',
    USERS: '/api/users',
    DASHBOARD: {
        STATS: '/api/dashboard/stats',
        CHARTS: '/api/dashboard/charts'
    },
    ANALYTICS: {
        INVENTORY_TRENDS: '/api/analytics/inventory-trends',
        FAST_MOVING: '/api/analytics/fast-moving',
        DEAD_STOCK: '/api/analytics/dead-stock',
        USER_ACTIVITY: '/api/analytics/user-activity'
    },
    REPORTS: {
        PDF: '/api/reports/pdf',
        EXCEL: '/api/reports/excel',
        CSV: '/api/reports/csv'
    },
    NOTIFICATIONS: {
        GET_ALL: '/api/notifications',
        READ_ALL: '/api/notifications/read-all'
    },
    AUDIT: '/api/audit/logs',
    SETTINGS: '/api/settings'
};
