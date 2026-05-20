import React, { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analyticsService';
import AnalyticsChart from '../../components/charts/AnalyticsChart';
import { ArrowUp, ArrowDown } from 'lucide-react';

const Analytics = () => {
    const [trends, setTrends] = useState([]);
    const [fastMoving, setFastMoving] = useState([]);
    const [deadStock, setDeadStock] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [trendData, fmData, dsData] = await Promise.all([
                    analyticsService.getInventoryTrends(),
                    analyticsService.getFastMoving(),
                    analyticsService.getDeadStock()
                ]);
                setTrends(trendData);
                setFastMoving(fmData);
                setDeadStock(dsData);
            } catch (error) {
                console.error("Error fetching analytics", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <div className="p-6">Loading analytics data...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Advanced Analytics</h1>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Inventory vs Sales Trend</h3>
                <AnalyticsChart data={trends} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <ArrowUp className="text-green-500 mr-2" />
                        Fast Moving Products
                    </h3>
                    <ul className="space-y-3">
                        {fastMoving.map((item, idx) => (
                            <li key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-700">
                                <span className="font-medium text-gray-900 dark:text-gray-200">{item.name}</span>
                                <span className="text-green-600 font-bold">{item.sales} sold</span>
                            </li>
                        ))}
                        {fastMoving.length === 0 && <li className="text-gray-500">No fast moving items found.</li>}
                    </ul>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <ArrowDown className="text-red-500 mr-2" />
                        Dead Stock Alerts
                    </h3>
                    <ul className="space-y-3">
                        {deadStock.map((item, idx) => (
                            <li key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md border border-gray-100 dark:border-gray-700">
                                <div>
                                    <span className="font-medium text-gray-900 dark:text-gray-200 block">{item.name}</span>
                                    <span className="text-xs text-gray-500">{item.days_untouched} days untouched</span>
                                </div>
                                <span className="text-red-600 font-bold">{item.quantity} in stock</span>
                            </li>
                        ))}
                        {deadStock.length === 0 && <li className="text-gray-500">No dead stock found.</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
