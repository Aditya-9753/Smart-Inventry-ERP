import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Download, FileText, Settings } from 'lucide-react';

const QuickActions = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
                <Link to="/admin/products" className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <Plus size={18} className="text-indigo-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Product</span>
                </Link>
                <Link to="/admin/inventory" className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <Download size={18} className="text-green-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Receive Stock</span>
                </Link>
                <Link to="/admin/reports" className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <FileText size={18} className="text-orange-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Generate Report</span>
                </Link>
                <Link to="/admin/settings" className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <Settings size={18} className="text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Settings</span>
                </Link>
            </div>
        </div>
    );
};

export default QuickActions;
