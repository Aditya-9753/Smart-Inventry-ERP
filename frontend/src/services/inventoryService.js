import api from '../api/axios';
import { API_URLS } from '../api/endpoints';

export const inventoryService = {
    recordInward: async (data) => {
        const response = await api.post(API_URLS.INVENTORY.INWARD, data);
        return response.data;
    },
    
    recordOutward: async (data) => {
        const response = await api.post(API_URLS.INVENTORY.OUTWARD, data);
        return response.data;
    },
    
    recordTransfer: async (data) => {
        const response = await api.post(API_URLS.INVENTORY.TRANSFER, data);
        return response.data;
    },
    
    getHistory: async (params) => {
        // params: page, size, type
        const response = await api.get(API_URLS.INVENTORY.HISTORY, { params });
        return response.data;
    }
};
