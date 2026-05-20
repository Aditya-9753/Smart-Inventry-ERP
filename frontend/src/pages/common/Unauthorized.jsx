import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
            <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-2">Access Denied</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">You don't have permission to view this page.</p>
            <Link to="/" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                Return Home
            </Link>
        </div>
    </div>
);

export default Unauthorized;
