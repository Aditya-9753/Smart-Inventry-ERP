import React from 'react';
import TransactionForm from '../../components/inventory/TransactionForm';

const InventoryEntry = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Inventory Entry</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Manually record stock movements.</p>
            <div className="max-w-3xl mx-auto">
                <TransactionForm />
            </div>
        </div>
    );
};

export default InventoryEntry;
