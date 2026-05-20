import api from '../api/axios';
import { API_URLS } from '../api/endpoints';

export const analyticsService = {
    getInventoryTrends: async (params) => {
        const response = await api.get(API_URLS.ANALYTICS.INVENTORY_TRENDS, { params });
        return response.data;
    },
    getFastMoving: async () => {
        const response = await api.get(API_URLS.ANALYTICS.FAST_MOVING);
        return response.data;
    },
    getDeadStock: async () => {
        const response = await api.get(API_URLS.ANALYTICS.DEAD_STOCK);
        return response.data;
    }
};
