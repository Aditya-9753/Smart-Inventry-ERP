import React from 'react';
import { Package, Users, AlertTriangle, ShoppingCart, DollarSign, Activity } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
        <div className={`p-4 rounded-full mr-4 ${colorClass}`}>
            <Icon size={24} className="text-white" />
        </div>
        <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const StatsCards = ({ stats }) => {
    if (!stats) return null;

    const cards = [
        { title: 'Total Products', value: stats.total_products, icon: Package, colorClass: 'bg-blue-500' },
        { title: 'Total Users', value: stats.total_users, icon: Users, colorClass: 'bg-green-500' },
        { title: 'Low Stock Items', value: stats.low_stock_items, icon: AlertTriangle, colorClass: 'bg-red-500' },
        { title: 'Today\'s Transactions', value: stats.todays_transactions, icon: ShoppingCart, colorClass: 'bg-yellow-500' },
        { title: 'Monthly Sales', value: stats.monthly_sales, icon: DollarSign, colorClass: 'bg-purple-500' },
        { title: 'Active Users', value: stats.active_users, icon: Activity, colorClass: 'bg-indigo-500' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {cards.map((card, idx) => (
                <StatsCard key={idx} {...card} />
            ))}
        </div>
    );
};

export default StatsCards;
