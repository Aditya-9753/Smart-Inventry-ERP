import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import ProductForm from '../../components/products/ProductForm';
import ProductTable from '../../components/products/ProductTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../redux/slices/productSlice';

const Products = () => {
    const dispatch = useDispatch();
    const { items: products, loading } = useSelector(state => state.products);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ category: '', status: '' });

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleAddProduct = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingProduct) {
                await dispatch(updateProduct({ id: editingProduct.id, data: formData }));
                toast.success('Product updated successfully');
            } else {
                await dispatch(createProduct(formData));
                toast.success('Product created successfully');
            }
            setIsFormOpen(false);
            setEditingProduct(null);
        } catch (error) {
            toast.error(error.message || 'Failed to save product');
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await dispatch(deleteProduct(productId));
                toast.success('Product deleted successfully');
            } catch (error) {
                toast.error('Failed to delete product');
            }
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.sku.toLowerCase().includes(searchQuery.toLowerCase());
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

            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search products by name or SKU..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">All Categories</option>
                        <option value="electronics">Electronics</option>
                        <option value="textiles">Textiles</option>
                        <option value="groceries">Groceries</option>
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
                    product={editingProduct}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setIsFormOpen(false)}
                    loading={loading}
                />
            </Modal>
        </div>
    );
};

export default Products;
