import React from 'react';

const ActivityFeed = ({ activities = [] }) => {
    if (activities.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Activity Feed</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">No recent activities.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Activity Feed</h3>
            <div className="space-y-4">
                {activities.map((activity, idx) => (
                    <div key={idx} className="flex space-x-3">
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{activity.user}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{activity.action}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityFeed;
