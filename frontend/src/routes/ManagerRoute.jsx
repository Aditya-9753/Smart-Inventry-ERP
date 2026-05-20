import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ManagerRoute = () => {
    const { user, loading } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    
    const role = user?.role_id?.toUpperCase();
    const isAuthorized = role === 'ADMIN' || role === 'MANAGER';
    
    return isAuthorized ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default ManagerRoute;
