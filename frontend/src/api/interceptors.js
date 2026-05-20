// axios raw import (for refresh call — avoids interceptor loop)
import axios from 'axios';
import api from './axios';
import { API_URLS } from './endpoints';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../utils/localStorage';
import { store } from '../app/store';
import { logout } from '../redux/authSlice';

export const setupInterceptors = () => {
    api.interceptors.request.use(
        (config) => {
            const token = getAccessToken();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (
                error.response?.status === 401 &&
                !originalRequest._retry &&
                originalRequest.url !== API_URLS.AUTH.LOGIN
            ) {
                originalRequest._retry = true;
                try {
                    const refreshToken = getRefreshToken();
                    if (!refreshToken) {
                        store.dispatch(logout());
                        return Promise.reject(error);
                    }

                    const response = await axios.post(
                        `${api.defaults.baseURL}${API_URLS.AUTH.REFRESH}`,
                        { refresh_token: refreshToken }
                    );

                    const { access_token, refresh_token: new_refresh_token } = response.data;
                    setTokens(access_token, new_refresh_token);

                    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    clearTokens();
                    store.dispatch(logout());
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );
};

