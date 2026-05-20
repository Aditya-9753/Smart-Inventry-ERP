import api from '../api/axios';
import { API_URLS } from '../api/endpoints';

export const notificationService = {
    getNotifications: async (params = { skip: 0, limit: 20 }) => {
        const response = await api.get(API_URLS.NOTIFICATIONS.GET_ALL, { params });
        return response.data;
    },
    
    markAsRead: async (id) => {
        const response = await api.put(`${API_URLS.NOTIFICATIONS.GET_ALL}/${id}/read`);
        return response.data;
    },
    
    markAllAsRead: async () => {
        const response = await api.put(API_URLS.NOTIFICATIONS.READ_ALL);
        return response.data;
    }
};
