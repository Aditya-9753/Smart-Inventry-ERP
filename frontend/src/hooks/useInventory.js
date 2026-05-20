import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { productService } from '../services/productService';
import { setProducts, setLoading, setError, setCategories } from '../redux/productSlice';
import toast from 'react-hot-toast';

export const useInventory = () => {
    const dispatch = useDispatch();
    const { products, categories, pagination, loading, error } = useSelector((state) => state.products);

    const fetchProducts = useCallback(async (params = { page: 1, size: 20 }) => {
        dispatch(setLoading(true));
        try {
            const data = await productService.getProducts(params);
            dispatch(setProducts(data));
        } catch (err) {
            dispatch(setError(err.message));
            toast.error('Failed to load products');
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await productService.getCategories();
            dispatch(setCategories(data));
        } catch (err) {
            console.error('Failed to load categories', err);
        }
    }, [dispatch]);

    const createProduct = async (data) => {
        try {
            await productService.createProduct(data);
            toast.success('Product created successfully');
            fetchProducts();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to create product');
            return false;
        }
    };

    const updateProduct = async (id, data) => {
        try {
            await productService.updateProduct(id, data);
            toast.success('Product updated successfully');
            fetchProducts();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Failed to update product');
            return false;
        }
    };

    const deleteProduct = async (id) => {
        try {
            await productService.deleteProduct(id);
            toast.success('Product deleted successfully');
            fetchProducts();
            return true;
        } catch (err) {
            toast.error('Failed to delete product');
            return false;
        }
    };

    return {
        products,
        categories,
        pagination,
        loading,
        error,
        fetchProducts,
        fetchCategories,
        createProduct,
        updateProduct,
        deleteProduct
    };
};
