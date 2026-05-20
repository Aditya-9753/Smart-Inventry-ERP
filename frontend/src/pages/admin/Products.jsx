import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PageHeader, Button, Modal } from '../../components/ui';
import ProductForm from '../../components/inventory/InventoryForm';
import ProductTable from '../../components/inventory/ProductTable';
import { useInventory } from '../../hooks/useInventory';

const Products = () => {
    const {
        products,
        categories,
        loading,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        fetchCategories
    } = useInventory();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ category: '', status: '' });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [fetchProducts, fetchCategories]);

    const handleAddProduct = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (formData) => {
        let success = false;
        if (editingProduct) {
            success = await updateProduct(editingProduct.id, formData);
        } else {
            success = await createProduct(formData);
        }
        if (success) {
            setIsFormOpen(false);
            setEditingProduct(null);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(productId);
        }
    };

    const filteredProducts = products.filter(product => {
        const nameMatch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
        const skuMatch = product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
        const matchesSearch = nameMatch || skuMatch;
        const matchesCategory = !filters.category || product.category_id === filters.category;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <PageHeader
                title="Products Management"
                description="Manage your product catalog"
                action={
                    <Button variant="primary" onClick={handleAddProduct}>
                        + Add Product
                    </Button>
                }
            />

            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm p-6 border border-neutral-200 dark:border-neutral-800 transition-colors">
                <div className="flex gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search products by name or SKU..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-neutral-800 dark:text-neutral-50"
                    />
                    <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-neutral-800 dark:text-neutral-50"
                    >
                        <option value="">All Categories</option>
                        {categories?.map(c => (
                            <option key={c.id || c.name} value={c.id || c.name}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <ProductTable
                    products={filteredProducts}
                    loading={loading}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                />
            </div>

            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingProduct ? 'Edit Product' : 'Add New Product'}>
                <ProductForm
                    initialData={editingProduct}
                    categories={categories}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setIsFormOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default Products;
