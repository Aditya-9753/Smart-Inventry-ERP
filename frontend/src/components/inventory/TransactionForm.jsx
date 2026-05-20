import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { inventoryService } from '../../services/inventoryService';
import toast from 'react-hot-toast';

const schema = z.object({
    product_id: z.string().min(1, 'Product ID is required'),
    warehouse_id: z.string().min(1, 'Warehouse ID is required'),
    type: z.enum(['inward', 'outward']),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    remarks: z.string().optional()
});

const TransactionForm = ({ onSuccess }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { type: 'inward', quantity: 1 }
    });

    const onSubmit = async (data) => {
        try {
            if (data.type === 'inward') {
                await inventoryService.recordInward(data);
            } else {
                await inventoryService.recordOutward(data);
            }
            toast.success(`Successfully recorded ${data.type} transaction`);
            reset();
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Transaction failed');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium dark:text-white mb-4">Record Movement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Transaction Type</label>
                    <select {...register('type')} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white">
                        <option value="inward">Inward (Add Stock)</option>
                        <option value="outward">Outward (Remove Stock)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product ID</label>
                    <input {...register('product_id')} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white" />
                    {errors.product_id && <p className="text-red-500 text-xs mt-1">{errors.product_id.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Warehouse ID</label>
                    <input {...register('warehouse_id')} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white" />
                    {errors.warehouse_id && <p className="text-red-500 text-xs mt-1">{errors.warehouse_id.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                    <input type="number" {...register('quantity', { valueAsNumber: true })} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white" />
                    {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Remarks / Notes</label>
                    <textarea {...register('remarks')} rows="2" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white" />
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50">
                    {isSubmitting ? 'Recording...' : 'Record Transaction'}
                </button>
            </div>
        </form>
    );
};

export default TransactionForm;
