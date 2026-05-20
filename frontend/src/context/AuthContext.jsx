import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../services/authService';
import { loginStart, loginSuccess, loginFailure, logout, setUser } from '../redux/authSlice';
import { getAccessToken, getStoredUser } from '../utils/localStorage';
import { setupInterceptors } from '../api/interceptors';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        // Run once on app startup
        setupInterceptors();
        const token = getAccessToken();
        if (token) {
            dispatch(setUser({ ...getStoredUser(), token }));
        }
    }, [dispatch]);

    const login = async (credentials) => {
        dispatch(loginStart());
        try {
            const data = await authService.login(credentials);
            dispatch(loginSuccess({ ...data.user, token: data.access_token }));
            return data;
        } catch (error) {
            const msg = error.response?.data?.detail || "Login failed";
            dispatch(loginFailure(msg));
            throw new Error(msg);
        }
    };

    const register = async (userData) => {
        return await authService.register(userData);
    };

    const performLogout = async () => {
        await authService.logout();
        dispatch(logout());
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout: performLogout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
