import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { CheckCircle2, BellRing } from 'lucide-react';

const Notifications = () => {
    const { notifications, markAsRead, markAllAsRead } = useNotifications();

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Notifications</h1>
                    <p className="text-gray-500 dark:text-gray-400">View and manage your alerts.</p>
                </div>
                <button 
                    onClick={markAllAsRead}
                    className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                    <CheckCircle2 size={18} className="mr-2 text-green-500" />
                    Mark all as read
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                        <BellRing size={48} className="text-gray-300 mb-4" />
                        <p>No notifications found.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {notifications.map(notification => (
                            <li key={notification.id} className={`p-6 ${!notification.is_read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start">
                                        <div className={`p-2 rounded-full mr-4 ${!notification.is_read ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                                            <BellRing size={20} />
                                        </div>
                                        <div>
                                            <h3 className={`text-base font-medium ${!notification.is_read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {notification.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                                            <p className="text-sm text-gray-500 mt-2">{new Date(notification.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    {!notification.is_read && (
                                        <button 
                                            onClick={() => markAsRead(notification.id)}
                                            className="px-3 py-1 text-sm border border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-md transition dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                                        >
                                            Mark read
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Notifications;
