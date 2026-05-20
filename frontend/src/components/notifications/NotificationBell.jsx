import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationList from './NotificationList';

const NotificationBell = () => {
    const { unreadCount } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative group cursor-pointer">
            <button 
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition relative"
                aria-label="Notifications"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-gray-800">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>
            
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                        <NotificationList onClose={() => setIsOpen(false)} />
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;
