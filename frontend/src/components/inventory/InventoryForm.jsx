import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
    name: z.string().min(2, 'Name is required'),
    description: z.string().optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    category_id: z.string().optional(),
    price: z.number().min(0, 'Price must be positive'),
    quantity: z.number().min(0, 'Quantity cannot be negative'),
    min_stock: z.number().min(0, 'Min stock cannot be negative')
});

const InventoryForm = ({ initialData, categories, onSubmit, onCancel }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            description: '',
            sku: '',
            barcode: '',
            category_id: '',
            price: 0,
            quantity: 0,
            min_stock: 5
        }
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        } else {
            reset();
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
                    <input {...register('name')} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <select {...register('category_id')} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white">
                        <option value="">Select Category</option>
                        {categories?.map(c => (
                            <option key={c.id || c.name} value={c.id || c.name}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                    <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white" />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Initial Quantity</label>
                    <input type="number" {...register('quantity', { valueAsNumber: true })} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Stock Alert Level</label>
                    <input type="number" {...register('min_stock', { valueAsNumber: true })} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SKU (Auto-generated if empty)</label>
                    <input {...register('sku')} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white placeholder-gray-400" placeholder="Optional" />
                </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
            </div>
        </form>
    );
};

export default InventoryForm;
