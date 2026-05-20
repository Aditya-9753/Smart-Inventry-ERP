import React from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import StatsCards from '../../components/dashboard/StatsCards';
import InventoryChart from '../../components/charts/InventoryChart';
import SalesChart from '../../components/charts/SalesChart';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import AlertsPanel from '../../components/dashboard/AlertsPanel';
import QuickActions from '../../components/dashboard/QuickActions';
import { SkeletonLoader, EmptyState } from '../../components/ui';

const ControlCenter = () => {
    const { stats, charts, loading, error } = useAnalytics();

    if (loading && !stats) return (
        <div className="p-6 space-y-6">
            <SkeletonLoader type="card" count={4} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SkeletonLoader type="card" className="lg:col-span-2 h-80" />
                <SkeletonLoader type="card" className="h-80" />
            </div>
        </div>
    );
    
    if (error) return (
        <div className="p-6">
            <EmptyState 
                type="error" 
                title="Failed to Load Dashboard" 
                message={`Error: ${error}`} 
            />
        </div>
    );

    // For mock data purposes if chart isn't returning correct format yet
    const safeCharts = charts || { inventory_movement: [], sales: [] };
    const mockAlerts = stats?.low_stock_items > 0 
        ? [{ type: 'error', title: 'Low Stock', message: `${stats.low_stock_items} products are below minimum stock.` }]
        : [];

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">Admin Control Center</h1>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Welcome to the Smart Inventory ERP overview.</p>
            </div>

            <StatsCards stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-neutral-0 dark:bg-neutral-900 p-6 rounded-2xl shadow-card border border-neutral-200 dark:border-neutral-800 transition-colors">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">Inventory Movement</h3>
                    <InventoryChart data={safeCharts.inventory_movement} />
                </div>
                <div className="space-y-6 flex flex-col">
                    <QuickActions />
                    <AlertsPanel alerts={mockAlerts} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-neutral-0 dark:bg-neutral-900 p-6 rounded-2xl shadow-card border border-neutral-200 dark:border-neutral-800 transition-colors">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">Sales Volume</h3>
                    <SalesChart data={safeCharts.sales || []} />
                </div>
                <div>
                    <ActivityFeed />
                </div>
            </div>
        </div>
    );
};

export default ControlCenter;
