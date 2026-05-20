import api from '../api/axios';
import { API_URLS } from '../api/endpoints';
import { setTokens, clearTokens } from '../utils/localStorage';

export const authService = {
    login: async (credentials) => {
        const response = await api.post(API_URLS.AUTH.LOGIN, credentials);
        if (response.data.access_token) {
            setTokens(response.data.access_token, response.data.refresh_token, response.data.user);
        }
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post(API_URLS.AUTH.REGISTER, userData);
        return response.data;
    },

    logout: async () => {
        try {
            await api.post(API_URLS.AUTH.LOGOUT);
        } finally {
            clearTokens();
        }
    },

    forgotPassword: async (email) => {
        const response = await api.post(API_URLS.AUTH.FORGOT_PASSWORD, { email });
        return response.data;
    },

    resetPassword: async (token, new_password) => {
        const response = await api.post(API_URLS.AUTH.RESET_PASSWORD, { token, new_password });
        return response.data;
    }
};
