import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: [],
    categories: [],
    loading: false,
    error: null,
    pagination: {
        page: 1,
        size: 10,
        total: 0,
        pages: 0
    }
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload.items;
            state.pagination = {
                page: action.payload.page,
                size: action.payload.size,
                total: action.payload.total,
                pages: action.payload.pages
            };
        },
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { setProducts, setCategories, setLoading, setError } = productSlice.actions;
export default productSlice.reducer;