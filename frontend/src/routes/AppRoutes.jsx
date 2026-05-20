import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import ManagerRoute from './ManagerRoute';
import StaffRoute from './StaffRoute';
import ViewerRoute from './ViewerRoute';
import { useAuth } from '../context/AuthContext';

import AdminLayout from '../layouts/AdminLayout';
import ManagerLayout from '../layouts/ManagerLayout';
import StaffLayout from '../layouts/StaffLayout';
import ViewerLayout from '../layouts/ViewerLayout';

import NotFound from '../pages/common/NotFound';
import Unauthorized from '../pages/common/Unauthorized';
import ServerError from '../pages/common/ServerError';

// Auth Pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));

const ComingSoon = () => <div className="p-8 text-center text-gray-500">Page Coming Soon</div>;

const RoleDashboardRedirect = () => {
    const { user } = useAuth();
    const role = user?.role_id?.toLowerCase();
    const path = ['admin', 'manager', 'staff', 'viewer'].includes(role)
        ? `/${role}/dashboard`
        : '/viewer/dashboard';

    return <Navigate to={path} replace />;
};

// Admin Pages
const ControlCenter = lazy(() => import('../pages/admin/ControlCenter'));
const AdminInventoryManagement = lazy(() => import('../pages/admin/InventoryManagement'));
const AdminProducts = lazy(() => import('../pages/admin/Products'));
const Warehouses = lazy(() => import('../pages/admin/Warehouses'));
const Analytics = lazy(() => import('../pages/admin/Analytics'));
const Reports = lazy(() => import('../pages/admin/Reports'));
const Notifications = lazy(() => import('../pages/admin/Notifications'));
const AuditLogs = lazy(() => import('../pages/admin/AuditLogs'));
const Settings = lazy(() => import('../pages/admin/Settings'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));

// Manager Pages
const ManagerInventory = lazy(() => import('../pages/manager/Inventory'));
const ManagerProducts = lazy(() => import('../pages/manager/Products'));
const ManagerTransactions = lazy(() => import('../pages/manager/Transactions'));
const ManagerAnalytics = lazy(() => import('../pages/manager/Analytics'));
const ManagerReports = lazy(() => import('../pages/manager/Reports'));
const StaffMonitoring = lazy(() => import('../pages/manager/StaffMonitoring'));

// Staff Pages
const InventoryEntry = lazy(() => import('../pages/staff/InventoryEntry'));
const BarcodeScanner = lazy(() => import('../pages/staff/BarcodeScanner'));
const StaffTransactions = lazy(() => import('../pages/staff/Transactions'));

// Viewer Pages
const ViewerInventory = lazy(() => import('../pages/viewer/InventoryView'));
const ViewerReports = lazy(() => import('../pages/viewer/ReportsView'));

const AppRoutes = () => {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <Routes>
                {/* Public / Auth Routes */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                </Route>

                {/* Common Error Pages */}
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/server-error" element={<ServerError />} />

                {/* Protected Route Wrapper */}
                <Route element={<ProtectedRoute />}>
                    
                    <Route path="/" element={<RoleDashboardRedirect />} />
                    <Route path="/dashboard" element={<RoleDashboardRedirect />} />

                    {/* ADMIN ROUTES */}
                    <Route path="/admin" element={<AdminRoute />}>
                        <Route element={<AdminLayout />}>
                            <Route path="dashboard" element={<ControlCenter />} />
                            <Route path="inventory" element={<AdminInventoryManagement />} />
                            <Route path="transactions" element={<AdminInventoryManagement />} />
                            <Route path="products" element={<AdminProducts />} />
                            <Route path="warehouses" element={<Warehouses />} />
                            <Route path="reports" element={<Reports />} />
                            <Route path="analytics" element={<Analytics />} />
                            <Route path="users" element={<UserManagement />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="notifications" element={<Notifications />} />
                            <Route path="audit" element={<AuditLogs />} />
                        </Route>
                    </Route>

                    {/* MANAGER ROUTES */}
                    <Route path="/manager" element={<ManagerRoute />}>
                        <Route element={<ManagerLayout />}>
                            <Route path="dashboard" element={<ManagerAnalytics />} />
                            <Route path="inventory" element={<ManagerInventory />} />
                            <Route path="transactions" element={<ManagerTransactions />} />
                            <Route path="products" element={<ManagerProducts />} />
                            <Route path="warehouses" element={<Warehouses />} />
                            <Route path="reports" element={<ManagerReports />} />
                            <Route path="analytics" element={<ManagerAnalytics />} />
                            <Route path="monitoring" element={<StaffMonitoring />} />
                        </Route>
                    </Route>

                    {/* STAFF ROUTES */}
                    <Route path="/staff" element={<StaffRoute />}>
                        <Route element={<StaffLayout />}>
                            <Route path="dashboard" element={<InventoryEntry />} />
                            <Route path="inventory" element={<BarcodeScanner />} />
                            <Route path="transactions" element={<StaffTransactions />} />
                        </Route>
                    </Route>

                    {/* VIEWER ROUTES */}
                    <Route path="/viewer" element={<ViewerRoute />}>
                        <Route element={<ViewerLayout />}>
                            <Route path="dashboard" element={<ViewerInventory />} />
                            <Route path="inventory" element={<ViewerInventory />} />
                            <Route path="reports" element={<ViewerReports />} />
                        </Route>
                    </Route>

                </Route>

                {/* Catch all */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
