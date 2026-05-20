import React, { useEffect, useState } from 'react';
import { useInventory } from '../../hooks/useInventory';
import { useDebounce } from '../../hooks/useDebounce';
import { usePermissions } from '../../hooks/usePermissions';
import ProductTable from '../../components/inventory/ProductTable';
import InventoryForm from '../../components/inventory/InventoryForm';
import LowStockAlert from '../../components/inventory/LowStockAlert';
import BarcodeInput from '../../components/inventory/BarcodeInput';
import { Plus, Search } from 'lucide-react';
import { Modal, Input, Button, SkeletonLoader, EmptyState } from '../../components/ui';

const InventoryManagement = () => {
    const { products, categories, fetchProducts, fetchCategories, createProduct, updateProduct, deleteProduct, loading } = useInventory();
    const { can } = usePermissions();
    const canWrite = can('write', 'products');

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 300);
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchProducts({ page, size: 20, search: debouncedSearch });
    }, [fetchProducts, page, debouncedSearch]);

    const lowStockCount = products?.filter(p => p.quantity <= p.min_stock)?.length || 0;

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            await deleteProduct(id);
        }
    };

    const handleSubmit = async (data) => {
        if (editingProduct) {
            await updateProduct(editingProduct.id, data);
        } else {
            await createProduct(data);
        }
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleScan = (barcode) => {
        setSearchTerm(barcode);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">Product Management</h1>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Manage your entire product catalog and track inventory levels.</p>
                </div>
                {canWrite && (
                    <Button 
                        onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                        icon={<Plus size={20} />}
                        variant="primary"
                    >
                        Add Product
                    </Button>
                )}
            </div>

            <LowStockAlert count={lowStockCount} />

            <div className="bg-neutral-0 dark:bg-neutral-900 rounded-2xl shadow-card border border-neutral-200 dark:border-neutral-800 p-5 flex flex-col md:flex-row gap-4 justify-between items-center transition-colors">
                <div className="w-full md:w-96">
                    <Input 
                        type="search" 
                        placeholder="Search by name, SKU..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={<Search size={18} />}
                    />
                </div>
                <div className="w-full md:w-64">
                    <BarcodeInput onScan={handleScan} />
                </div>
            </div>

            {loading ? (
                <div className="bg-neutral-0 dark:bg-neutral-900 rounded-2xl shadow-card border border-neutral-200 dark:border-neutral-800 p-6">
                    <SkeletonLoader type="table" count={5} />
                </div>
            ) : !products || products.length === 0 ? (
                <EmptyState 
                    title="No Products Found" 
                    message={searchTerm ? "Try adjusting your search query." : "You haven't added any products to inventory yet."}
                    action={canWrite ? { label: 'Add Product', onClick: () => { setEditingProduct(null); setIsModalOpen(true); } } : undefined}
                />
            ) : (
                <div className="bg-neutral-0 dark:bg-neutral-900 rounded-2xl shadow-card border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-colors">
                    <div className="overflow-x-auto min-w-[900px]">
                        <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
                    </div>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProduct ? 'Edit Product' : 'Add New Product'}
                size="xl"
            >
                <InventoryForm 
                    initialData={editingProduct} 
                    categories={categories} 
                    onSubmit={handleSubmit} 
                    onCancel={() => setIsModalOpen(false)} 
                />
            </Modal>
        </div>
    );
};

export default InventoryManagement;
