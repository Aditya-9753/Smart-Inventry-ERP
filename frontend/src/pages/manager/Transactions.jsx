import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PageHeader, Button } from '../../components/ui';
import StockMovement from '../../components/inventory/StockMovement';
import { inventoryService } from '../../services/inventoryService';
import { setTransactions, setLoading, setError } from '../../redux/inventorySlice';

const Transactions = () => {
    const dispatch = useDispatch();
    const { transactions, loading } = useSelector(state => state.inventory);
    const [filters, setFilters] = useState({
        type: '',
        warehouse: '',
        startDate: '',
        endDate: ''
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(20);

    useEffect(() => {
        const fetchHistory = async () => {
            dispatch(setLoading(true));
            try {
                const data = await inventoryService.getHistory({
                    page,
                    size: limit,
                    type: filters.type || undefined,
                    warehouse_id: filters.warehouse || undefined
                });
                dispatch(setTransactions(data.items || data));
            } catch (err) {
                dispatch(setError(err.message || 'Failed to fetch transaction history'));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchHistory();
    }, [dispatch, filters, page, limit]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const handleExport = () => {
        const filteredTransactions = transactions.filter(t =>
            (t.type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.product_id || '').includes(searchQuery)
        );
        
        const csv = [
            ['Date', 'Type', 'Product ID', 'Quantity', 'Warehouse', 'User', 'Note'],
            ...filteredTransactions.map(t => [
                new Date(t.created_at || t.timestamp).toLocaleDateString(),
                t.type,
                t.product_id,
                t.quantity,
                t.warehouse_id,
                t.user_id,
                t.note || t.remarks || ''
            ])
        ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions-${new Date().toISOString()}.csv`;
        a.click();
    };

    const filteredTransactions = transactions.filter(t =>
        (t.type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.product_id || '').includes(searchQuery)
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Transaction History"
                description="View and manage inventory transactions"
                action={
                    <Button variant="secondary" onClick={handleExport}>
                        📥 Export CSV
                    </Button>
                }
            />

            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm p-6 border border-neutral-200 dark:border-neutral-800 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-neutral-800 dark:text-neutral-50"
                    />
                    <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-neutral-800 dark:text-neutral-50"
                    >
                        <option value="">All Types</option>
                        <option value="in">Inward</option>
                        <option value="out">Outward</option>
                        <option value="transfer">Transfer</option>
                    </select>
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-neutral-800 dark:text-neutral-50"
                    />
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-neutral-800 dark:text-neutral-50"
                    />
                </div>

                {loading ? (
                    <div className="text-center py-8 text-neutral-500">Loading transactions...</div>
                ) : (
                    <>
                        <StockMovement transactions={filteredTransactions} />
                        {transactions.length > 0 && (
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={page === 1 || loading}
                                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                                    className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Page {page}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={transactions.length < limit || loading}
                                    onClick={() => setPage(p => p + 1)}
                                    className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Transactions;
