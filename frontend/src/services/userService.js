import api from '../api/axios';
import { API_URLS } from '../api/endpoints';

export const userService = {
    getUsers: async (params) => {
        const response = await api.get(API_URLS.USERS, { params });
        return response.data;
    },
    
    createUser: async (data) => {
        const response = await api.post(API_URLS.USERS, data);
        return response.data;
    },
    
    updateUser: async (id, data) => {
        const response = await api.put(`${API_URLS.USERS}/${id}`, data);
        return response.data;
    },
    
    deleteUser: async (id) => {
        const response = await api.delete(`${API_URLS.USERS}/${id}`);
        return response.data;
    },
    
    getRoles: async () => {
        // Mocked or mapped endpoint for roles
        const response = await api.get(`${API_URLS.USERS}/roles`);
        return response.data;
    }
};
