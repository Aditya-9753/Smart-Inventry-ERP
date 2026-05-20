import React from 'react';
import InventoryManagement from '../admin/InventoryManagement';

const Products = () => {
    // For manager role, they can use the same component logic since permissions hook handles action visibility
    return <InventoryManagement />;
};

export default Products;
