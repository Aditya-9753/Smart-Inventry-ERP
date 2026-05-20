import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    stats: {
        total_products: 0,
        total_users: 0,
        low_stock_items: 0,
        todays_transactions: 0,
        monthly_sales: 0,
        active_users: 0
    },
    charts: null,
    loading: false,
    error: null
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setStats: (state, action) => {
            state.stats = action.payload;
        },
        setCharts: (state, action) => {
            state.charts = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { setStats, setCharts, setLoading, setError } = dashboardSlice.actions;
export default dashboardSlice.reducer;