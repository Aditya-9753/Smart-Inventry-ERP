import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

const AlertsPanel = ({ alerts = [] }) => {
    if (alerts.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">System Alerts</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">All systems operational. No active alerts.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">System Alerts</h3>
            <div className="space-y-3">
                {alerts.map((alert, idx) => (
                    <div key={idx} className={`p-3 rounded-md flex items-start ${alert.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'}`}>
                        {alert.type === 'error' ? <AlertTriangle size={20} className="mr-3 mt-0.5" /> : <Info size={20} className="mr-3 mt-0.5" />}
                        <div>
                            <h4 className="text-sm font-medium">{alert.title}</h4>
                            <p className="text-sm mt-1 opacity-90">{alert.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlertsPanel;
