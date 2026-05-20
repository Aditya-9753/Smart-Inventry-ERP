import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { API_URLS } from '../../api/endpoints';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get(API_URLS.AUDIT, { params: { limit: 100 } });
                setLogs(response.data);
            } catch (error) {
                console.error("Failed to load audit logs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">System Audit Logs</h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading logs...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {logs.map(log => (
                                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{new Date(log.timestamp).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{log.user_id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">{log.module}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400">{log.action}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{log.ip_address}</td>
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

export default AuditLogs;
