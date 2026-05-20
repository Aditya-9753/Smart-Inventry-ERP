import React, { useState } from 'react';
import { Search } from 'lucide-react';

const BarcodeInput = ({ onScan }) => {
    const [barcode, setBarcode] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && barcode.trim() !== '') {
            onScan(barcode);
            setBarcode('');
        }
    };

    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition"
                placeholder="Scan or type barcode..."
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
            />
        </div>
    );
};

export default BarcodeInput;
