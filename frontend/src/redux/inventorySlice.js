import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    transactions: [],
    lowStockItems: [],
    loading: false,
    error: null
};

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        setTransactions: (state, action) => {
            state.transactions = action.payload;
        },
        setLowStockItems: (state, action) => {
            state.lowStockItems = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { setTransactions, setLowStockItems, setLoading, setError } = inventorySlice.actions;
export default inventorySlice.reducer;