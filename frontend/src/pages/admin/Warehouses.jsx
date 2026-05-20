import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { warehouseService } from '../../services/warehouseService';

const StockTransferForm = ({ onSuccess }) => {

    // =========================================
    // DUMMY WAREHOUSE DATA
    // =========================================

    const warehouses = [
        {
            id: 'wh-001',
            name: 'Delhi Central Warehouse'
        },
        {
            id: 'wh-002',
            name: 'Mumbai Storage Hub'
        },
        {
            id: 'wh-003',
            name: 'Bangalore Tech Warehouse'
        },
        {
            id: 'wh-004',
            name: 'Hyderabad Distribution Center'
        },
        {
            id: 'wh-005',
            name: 'Chennai Supply Warehouse'
        },
        {
            id: 'wh-006',
            name: 'Pune Inventory Hub'
        },
        {
            id: 'wh-007',
            name: 'Kolkata Main Storage'
        }
    ];

    // =========================================
    // FORM STATE
    // =========================================

    const [formData, setFormData] = useState({
        product_id: '',
        quantity: '',
        from_warehouse_id: '',
        to_warehouse_id: ''
    });

    const [loading, setLoading] = useState(false);

    // =========================================
    // HANDLE INPUT CHANGE
    // =========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =========================================
    // HANDLE FORM SUBMIT
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.product_id.trim()) {
            return toast.error('Product ID required');
        }

        if (!formData.quantity || Number(formData.quantity) <= 0) {
            return toast.error('Valid quantity required');
        }

        if (!formData.from_warehouse_id) {
            return toast.error('Source warehouse required');
        }

        if (!formData.to_warehouse_id) {
            return toast.error('Destination warehouse required');
        }

        if (
            formData.from_warehouse_id ===
            formData.to_warehouse_id
        ) {
            return toast.error(
                'Source and destination warehouse cannot be same'
            );
        }

        try {

            setLoading(true);

            // API CALL
            await warehouseService.transferStock({
                product_id: formData.product_id,
                quantity: Number(formData.quantity),
                from_warehouse_id: formData.from_warehouse_id,
                to_warehouse_id: formData.to_warehouse_id
            });

            toast.success('Stock transferred successfully');

            // RESET FORM

            setFormData({
                product_id: '',
                quantity: '',
                from_warehouse_id: '',
                to_warehouse_id: ''
            });

            if (onSuccess) {
                onSuccess();
            }

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.detail ||
                'Transfer failed'
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="
            bg-white
            dark:bg-gray-800
            p-6
            rounded-xl
            shadow-md
            border
            border-gray-200
            dark:border-gray-700
        ">

            <h2 className="
                text-2xl
                font-bold
                text-gray-900
                dark:text-white
                mb-6
            ">
                Transfer Stock Between Warehouses
            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                {/* PRODUCT ID */}

                <div>

                    <label className="
                        block
                        text-sm
                        font-medium
                        text-gray-700
                        dark:text-gray-300
                        mb-2
                    ">
                        Product ID
                    </label>

                    <input
                        type="text"
                        name="product_id"
                        value={formData.product_id}
                        onChange={handleChange}
                        placeholder="Enter Product ID"
                        className="
                            w-full
                            border
                            border-gray-300
                            dark:border-gray-600
                            rounded-lg
                            px-4
                            py-3
                            bg-white
                            dark:bg-gray-900
                            text-gray-900
                            dark:text-white
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "
                    />

                </div>

                {/* QUANTITY */}

                <div>

                    <label className="
                        block
                        text-sm
                        font-medium
                        text-gray-700
                        dark:text-gray-300
                        mb-2
                    ">
                        Quantity
                    </label>

                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Enter quantity"
                        className="
                            w-full
                            border
                            border-gray-300
                            dark:border-gray-600
                            rounded-lg
                            px-4
                            py-3
                            bg-white
                            dark:bg-gray-900
                            text-gray-900
                            dark:text-white
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "
                    />

                </div>

                {/* FROM WAREHOUSE */}

                <div>

                    <label className="
                        block
                        text-sm
                        font-medium
                        text-gray-700
                        dark:text-gray-300
                        mb-2
                    ">
                        From Warehouse
                    </label>

                    <select
                        name="from_warehouse_id"
                        value={formData.from_warehouse_id}
                        onChange={handleChange}
                        className="
                            w-full
                            border
                            border-gray-300
                            dark:border-gray-600
                            rounded-lg
                            px-4
                            py-3
                            bg-white
                            dark:bg-gray-900
                            text-gray-900
                            dark:text-white
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "
                    >

                        <option value="">
                            Select source warehouse
                        </option>

                        {warehouses.map((warehouse) => (

                            <option
                                key={warehouse.id}
                                value={warehouse.id}
                            >
                                {warehouse.name}
                            </option>

                        ))}

                    </select>

                </div>

                {/* TO WAREHOUSE */}

                <div>

                    <label className="
                        block
                        text-sm
                        font-medium
                        text-gray-700
                        dark:text-gray-300
                        mb-2
                    ">
                        To Warehouse
                    </label>

                    <select
                        name="to_warehouse_id"
                        value={formData.to_warehouse_id}
                        onChange={handleChange}
                        className="
                            w-full
                            border
                            border-gray-300
                            dark:border-gray-600
                            rounded-lg
                            px-4
                            py-3
                            bg-white
                            dark:bg-gray-900
                            text-gray-900
                            dark:text-white
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "
                    >

                        <option value="">
                            Select destination warehouse
                        </option>

                        {warehouses.map((warehouse) => (

                            <option
                                key={warehouse.id}
                                value={warehouse.id}
                            >
                                {warehouse.name}
                            </option>

                        ))}

                    </select>

                </div>

                {/* SUBMIT BUTTON */}

                <button
                    type="submit"
                    disabled={loading}
                    className="
                        w-full
                        bg-blue-600
                        hover:bg-blue-700
                        disabled:bg-blue-400
                        text-white
                        py-3
                        rounded-lg
                        font-semibold
                        transition-all
                    "
                >

                    {loading
                        ? 'Transferring Stock...'
                        : 'Transfer Stock'}

                </button>

            </form>

        </div>
    );
};

export default StockTransferForm; 