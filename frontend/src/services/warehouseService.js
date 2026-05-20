import api from '../api/axios';
import { API_URLS } from '../api/endpoints';

export const warehouseService = {

    // =========================================
    // GET ALL WAREHOUSES
    // =========================================

    getWarehouses: async () => {

        const response = await api.get(
            API_URLS.WAREHOUSES
        );

        return response.data;
    },

    // =========================================
    // GET SINGLE WAREHOUSE STOCK
    // =========================================

    getWarehouseStock: async (warehouseId) => {

        const response = await api.get(
            `${API_URLS.WAREHOUSES}/${warehouseId}/stock`
        );

        return response.data;
    },

    // =========================================
    // CREATE WAREHOUSE
    // =========================================

    createWarehouse: async (data) => {

        const response = await api.post(
            API_URLS.WAREHOUSES,
            data
        );

        return response.data;
    },

    // =========================================
    // UPDATE WAREHOUSE
    // =========================================

    updateWarehouse: async (id, data) => {

        const response = await api.put(
            `${API_URLS.WAREHOUSES}/${id}`,
            data
        );

        return response.data;
    },

    // =========================================
    // DELETE WAREHOUSE
    // =========================================

    deleteWarehouse: async (id) => {

        const response = await api.delete(
            `${API_URLS.WAREHOUSES}/${id}`
        );

        return response.data;
    },

    // =========================================
    // TRANSFER STOCK
    // =========================================

    transferStock: async (data) => {

        const response = await api.post(
            '/inventory/transfer',
            data
        );

        return response.data;
    }
};