import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { API_URLS } from '../../api/endpoints';

const StaffMonitoring = () => {
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                // Filter audit logs for staff role interactions
                const response = await api.get(API_URLS.AUDIT, { params: { limit: 50, role: 'STAFF' } });
                setActivity(response.data);
            } catch (error) {
                console.error("Failed to load staff activity", error);
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Staff Monitoring</h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading activity...</div>
                ) : activity.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No recent staff activity.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff Member</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action Taken</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {activity.map(log => (
                                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{new Date(log.timestamp).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{log.user_id}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400">{log.action}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{log.module}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffMonitoring;
