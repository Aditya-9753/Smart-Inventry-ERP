import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../../components/common/PageHeader';
import TransactionTable from '../../components/transactions/TransactionTable';
import Button from '../../components/common/Button';
import { fetchTransactions } from '../../redux/slices/transactionSlice';

const Transactions = () => {
    const dispatch = useDispatch();
    const { items: transactions, loading } = useSelector(state => state.transactions);
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
        dispatch(fetchTransactions({
            skip: (page - 1) * limit,
            limit,
            typeFilter: filters.type || undefined,
            warehouseId: filters.warehouse || undefined
        }));
    }, [dispatch, filters, page, limit]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const handleExport = () => {
        const filteredTransactions = transactions.filter(t =>
            t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.product_id.includes(searchQuery)
        );
        
        const csv = [
            ['Date', 'Type', 'Product ID', 'Quantity', 'Warehouse', 'User', 'Note'],
            ...filteredTransactions.map(t => [
                new Date(t.created_at).toLocaleDateString(),
                t.type,
                t.product_id,
                t.quantity,
                t.warehouse_id,
                t.user_id,
                t.note || ''
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
        t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.product_id.includes(searchQuery)
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

            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <TransactionTable
                    transactions={filteredTransactions}
                    loading={loading}
                    onPageChange={setPage}
                    currentPage={page}
                />
            </div>
        </div>
    );
};

export default Transactions;
