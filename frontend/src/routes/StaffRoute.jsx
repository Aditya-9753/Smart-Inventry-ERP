import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StaffRoute = () => {
    const { user, loading } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    
    const role = user?.role_id?.toUpperCase();
    const isAuthorized = ['ADMIN', 'MANAGER', 'STAFF'].includes(role);
    
    return isAuthorized ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default StaffRoute;
