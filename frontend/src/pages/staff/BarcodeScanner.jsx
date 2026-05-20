import React from 'react';
import ProductSearch from './ProductSearch';

const BarcodeScanner = () => {
    // This could integrate HTML5 device camera APIs in the future.
    // For now, relies on the keyboard wedge scanner (which acts as keyboard input) via ProductSearch wrapper
    return (
        <div className="p-6">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 p-4 rounded-md mb-6">
                Connect your bluetooth or USB barcode scanner. Make sure this window is active and start scanning.
            </div>
            <ProductSearch />
        </div>
    );
};

export default BarcodeScanner;
