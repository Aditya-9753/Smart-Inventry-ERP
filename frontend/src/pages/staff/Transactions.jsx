import React, { useEffect, useState } from 'react';
import { inventoryService } from '../../services/inventoryService';
import StockMovement from '../../components/inventory/StockMovement';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await inventoryService.getHistory({ page: 1, size: 50 });
                // If the backend returns paginated data inside an 'items' array, adjust accordingly.
                // Assuming data.items or data itself is an array.
                setTransactions(data.items || data);
            } catch (error) {
                console.error("Failed to load transactions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Transactions</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                {loading ? <p>Loading...</p> : <StockMovement transactions={transactions} />}
            </div>
        </div>
    );
};

export default Transactions;
