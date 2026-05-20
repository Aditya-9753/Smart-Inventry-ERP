import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { Badge, Button } from '../ui';

const ProductTable = ({ products, onEdit, onDelete }) => {
    const { can } = usePermissions();
    const canWrite = can('write', 'products');

    if (!products || products.length === 0) {
        return <div className="text-center py-8 text-neutral-500">No products found.</div>;
    }

    return (
        <div className="w-full">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">SKU</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Stock</th>
                        {canWrite && <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Actions</th>}
                    </tr>
                </thead>
                <tbody className="bg-neutral-0 dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-800">
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-neutral-50">
                                <span className="font-mono bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                                    {product.sku}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-neutral-50">{product.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400">{product.category_id || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-neutral-50">${product.price.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant={product.quantity <= product.min_stock ? 'critical' : 'success'} size="sm">
                                    {product.quantity}
                                </Badge>
                            </td>
                            {canWrite && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => onEdit(product)}
                                            icon={<Edit size={16} />}
                                            className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/20"
                                            aria-label="Edit product"
                                        />
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => onDelete(product.id)}
                                            icon={<Trash2 size={16} />}
                                            className="text-status-critical-600 hover:text-status-critical-700 dark:text-status-critical-400 dark:hover:text-status-critical-300 hover:bg-status-critical-50 dark:hover:bg-status-critical-900/20"
                                            aria-label="Delete product"
                                        />
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;
