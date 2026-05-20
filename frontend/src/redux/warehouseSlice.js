import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    warehouses: [],
    currentWarehouseStock: [],
    loading: false,
    error: null
};

const warehouseSlice = createSlice({
    name: 'warehouses',
    initialState,
    reducers: {
        setWarehouses: (state, action) => {
            state.warehouses = action.payload;
        },
        setCurrentWarehouseStock: (state, action) => {
            state.currentWarehouseStock = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { setWarehouses, setCurrentWarehouseStock, setLoading, setError } = warehouseSlice.actions;
export default warehouseSlice.reducer;