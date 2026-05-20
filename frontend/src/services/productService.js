import api from '../api/axios';
import { API_URLS } from '../api/endpoints';

export const productService = {
    getProducts: async (params) => {
        // params: page, size, search, category_id
        const response = await api.get(API_URLS.PRODUCTS, { params });
        return response.data;
    },
    
    getProduct: async (id) => {
        const response = await api.get(`${API_URLS.PRODUCTS}/${id}`);
        return response.data;
    },
    
    createProduct: async (data) => {
        const response = await api.post(API_URLS.PRODUCTS, data);
        return response.data;
    },
    
    updateProduct: async (id, data) => {
        const response = await api.put(`${API_URLS.PRODUCTS}/${id}`, data);
        return response.data;
    },
    
    deleteProduct: async (id) => {
        const response = await api.delete(`${API_URLS.PRODUCTS}/${id}`);
        return response.data;
    },
    
    getCategories: async () => {
        const response = await api.get(API_URLS.CATEGORIES);
        return response.data;
    }
};
