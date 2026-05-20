import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    inventoryTrends: [],
    fastMoving: [],
    deadStock: [],
    userActivity: [],
    dateRange: {
        startDate: null,
        endDate: null
    },
    loading: false,
    error: null
};

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        setInventoryTrends: (state, action) => {
            state.inventoryTrends = action.payload;
        },
        setFastMoving: (state, action) => {
            state.fastMoving = action.payload;
        },
        setDeadStock: (state, action) => {
            state.deadStock = action.payload;
        },
        setUserActivity: (state, action) => {
            state.userActivity = action.payload;
        },
        setDateRange: (state, action) => {
            state.dateRange = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { setInventoryTrends, setFastMoving, setDeadStock, setUserActivity, setDateRange, setLoading, setError } = analyticsSlice.actions;
export default analyticsSlice.reducer;