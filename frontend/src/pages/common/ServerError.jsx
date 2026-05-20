import React from 'react';

const ServerError = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
            <h1 className="text-6xl font-bold text-red-600 mb-4">500</h1>
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-2">Server Error</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Oops! Something went wrong on our end.</p>
            <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
                Refresh Page
            </button>
        </div>
    </div>
);

export default ServerError;
