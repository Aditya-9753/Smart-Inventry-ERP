import React from 'react';
import { MapPin, Box } from 'lucide-react';

const WarehouseCard = ({ warehouse, onClick }) => {
    return (
        <div 
            onClick={() => onClick(warehouse)}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition group"
        >
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition">{warehouse.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${warehouse.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {warehouse.is_active ? 'Active' : 'Inactive'}
                </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    {warehouse.location}
                </div>
                <div className="flex items-center">
                    <Box size={16} className="mr-2 text-gray-400" />
                    Capacity: {warehouse.capacity}
                </div>
            </div>
        </div>
    );
};

export default WarehouseCard;
