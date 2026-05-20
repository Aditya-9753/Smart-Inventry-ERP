import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { Check, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationList = ({ onClose }) => {
    const { notifications, markAsRead, markAllAsRead } = useNotifications();

    const displayNotifications = notifications.slice(0, 5); // Show latest 5

    return (
        <div className="flex flex-col max-h-96">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
                <button 
                    onClick={markAllAsRead} 
                    className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                >
                    Mark all as read
                </button>
            </div>
            
            <div className="overflow-y-auto">
                {displayNotifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">No new notifications</div>
                ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {displayNotifications.map(notification => (
                            <li 
                                key={notification.id} 
                                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${!notification.is_read ? 'bg-indigo-50 dark:bg-indigo-900/10' : ''}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 cursor-pointer" onClick={() => markAsRead(notification.id)}>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{notification.title}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                                        <p className="text-xs text-gray-400 mt-2">{new Date(notification.created_at).toLocaleString()}</p>
                                    </div>
                                    {!notification.is_read && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                                            className="text-gray-400 hover:text-green-500 ml-2"
                                            title="Mark as read"
                                        >
                                            <CheckCircle2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 p-2 text-center">
                <Link to="/admin/notifications" onClick={onClose} className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-medium">
                    View All Notifications
                </Link>
            </div>
        </div>
    );
};

export default NotificationList;
