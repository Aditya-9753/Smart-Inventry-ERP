import api from '../api/axios';
import { API_URLS } from '../api/endpoints';

export const dashboardService = {
    getStats: async () => {
        const response = await api.get(API_URLS.DASHBOARD.STATS);
        return response.data;
    },
    getCharts: async () => {
        const response = await api.get(API_URLS.DASHBOARD.CHARTS);
        return response.data;
    }
};
