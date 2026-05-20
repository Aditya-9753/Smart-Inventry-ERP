import React, { useState } from 'react';
import BarcodeInput from '../../components/inventory/BarcodeInput';
import { productService } from '../../services/productService';
import toast from 'react-hot-toast';

const ProductSearch = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (searchTerm) => {
        setLoading(true);
        try {
            // Ideally we pass search param or barcode
            const data = await productService.getProducts({ search: searchTerm });
            const items = data.items || data;
            if (items.length > 0) {
                setProduct(items[0]);
            } else {
                setProduct(null);
                toast.error('Product not found');
            }
        } catch (error) {
            toast.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Product Lookup</h1>
            <div className="max-w-md mb-8">
                <BarcodeInput onScan={handleSearch} />
            </div>

            {loading && <p>Searching...</p>}

            {product && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 max-w-2xl">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">SKU</p>
                            <p className="font-medium dark:text-white">{product.sku}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="font-medium dark:text-white">${product.price}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Current Stock</p>
                            <p className={`font-medium ${product.quantity <= product.min_stock ? 'text-red-500' : 'text-green-500'}`}>
                                {product.quantity}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-medium dark:text-white">Warehouse 1</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductSearch;
