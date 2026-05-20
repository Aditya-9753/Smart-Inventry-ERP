import React from 'react';

const ReportFilters = ({ reportType, setReportType }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6 flex flex-col md:flex-row items-center gap-4">
            <div className="flex flex-col">
                <label className="text-sm text-gray-500 mb-1">Report Data Type</label>
                <select 
                    value={reportType} 
                    onChange={(e) => setReportType(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                    <option value="sales">Sales & Revenue</option>
                    <option value="inventory">Inventory Master List</option>
                    <option value="warehouse">Warehouse Capacity</option>
                    <option value="users">User Activity</option>
                </select>
            </div>
            
            <div className="flex flex-col">
                <label className="text-sm text-gray-500 mb-1">Time Range</label>
                <select className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                </select>
            </div>
        </div>
    );
};

export default ReportFilters;
