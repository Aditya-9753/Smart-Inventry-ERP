import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
    const { user, loading } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    
    // In our simplified setup, user object should have role_id populated properly.
    // For now we mock the check: assumes role_id maps to 'ADMIN' string or object.
    const isAuthorized = user?.role_id === 'ADMIN' || user?.role_id === 'admin';
    
    return isAuthorized ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default AdminRoute;
