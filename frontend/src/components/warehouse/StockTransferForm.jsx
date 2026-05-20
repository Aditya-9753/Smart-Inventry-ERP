import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { inventoryService } from '../../services/inventoryService';
import toast from 'react-hot-toast';

const schema = z.object({
    product_id: z.string().min(1, 'Product ID required'),
    from_warehouse_id: z.string().min(1, 'Source warehouse required'),
    to_warehouse_id: z.string().min(1, 'Destination warehouse required'),
    quantity: z.number().min(1, 'Must transfer at least 1 item')
});

const StockTransferForm = ({ warehouses, onSuccess }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data) => {
        if (data.from_warehouse_id === data.to_warehouse_id) {
            toast.error("Source and destination cannot be the same");
            return;
        }

        try {
            await inventoryService.recordTransfer(data);
            toast.success("Stock transferred successfully");
            reset();
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.detail || "Transfer failed");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Transfer Stock Between Warehouses</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product ID</label>
                    <input {...register('product_id')} className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                    {errors.product_id && <p className="text-red-500 text-xs mt-1">{errors.product_id.message}</p>}
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                    <input type="number" {...register('quantity', { valueAsNumber: true })} className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                    {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">From Warehouse</label>
                    <select {...register('from_warehouse_id')} className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600">
                        <option value="">Select source</option>
                        {warehouses?.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                    {errors.from_warehouse_id && <p className="text-red-500 text-xs mt-1">{errors.from_warehouse_id.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">To Warehouse</label>
                    <select {...register('to_warehouse_id')} className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600">
                        <option value="">Select destination</option>
                        {warehouses?.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                    {errors.to_warehouse_id && <p className="text-red-500 text-xs mt-1">{errors.to_warehouse_id.message}</p>}
                </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50">
                Execute Transfer
            </button>
        </form>
    );
};

export default StockTransferForm;
