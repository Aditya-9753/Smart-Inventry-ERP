import React from 'react';
import InventoryManagement from '../admin/InventoryManagement';

const InventoryView = () => {
    // Reuses the admin view. Actions are automatically hidden because `can('write', 'products')` returns false for viewers.
    return <InventoryManagement />;
};

export default InventoryView;
