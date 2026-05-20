import React from 'react';

const WarehouseOverview = ({ stock }) => {
    if (!stock || stock.length === 0) {
        return <div className="p-4 text-center text-gray-500">No stock recorded in this warehouse.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Product ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Quantity in Stock</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {stock.map((item, idx) => (
                        <tr key={idx}>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{item.product_id}</td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default WarehouseOverview;
