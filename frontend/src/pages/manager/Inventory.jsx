import React, { useEffect, useState } from 'react';
import { inventoryService } from '../../services/inventoryService';
import StockMovement from '../../components/inventory/StockMovement';
import TransactionForm from '../../components/inventory/TransactionForm';

const Inventory = () => {
    const [transactions, setTransactions] = useState([]);

    const fetchHistory = async () => {
        try {
            const data = await inventoryService.getHistory({ page: 1, size: 50 });
            setTransactions(data.items || data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Full Inventory Movement</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-1">
                    <TransactionForm onSuccess={fetchHistory} />
                </div>
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 h-full p-4 overflow-y-auto">
                        <h3 className="text-lg font-medium dark:text-white mb-4">Recent History</h3>
                        <StockMovement transactions={transactions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
