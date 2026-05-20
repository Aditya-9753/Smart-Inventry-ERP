import React from 'react';
import { AlertTriangle } from 'lucide-react';

const LowStockAlert = ({ count }) => {
    if (!count || count <= 0) return null;

    return (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 rounded-r-md flex items-start">
            <AlertTriangle className="text-red-500 mr-3 flex-shrink-0" size={24} />
            <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Action Required: Low Stock</h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                    You have {count} products currently below their minimum stock threshold. Please restock soon.
                </p>
            </div>
        </div>
    );
};

export default LowStockAlert;
