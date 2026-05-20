import { useState, useCallback, useMemo } from 'react';

/**
 * usePagination Hook
 * Provides pagination state management with common operations
 * @param {number} initialPage - Starting page number (default: 1)
 * @param {number} initialSize - Items per page (default: 10)
 * @returns {Object} Pagination state and methods
 */
export function usePagination(initialPage = 1, initialSize = 10) {
    const [page, setPage] = useState(initialPage);
    const [size, setSize] = useState(initialSize);

    /**
     * Go to next page
     */
    const nextPage = useCallback(() => {
        setPage(prevPage => prevPage + 1);
    }, []);

    /**
     * Go to previous page
     */
    const prevPage = useCallback(() => {
        setPage(prevPage => Math.max(1, prevPage - 1));
    }, []);

    /**
     * Go to specific page
     */
    const goToPage = useCallback((pageNumber) => {
        if (pageNumber >= 1) {
            setPage(pageNumber);
        }
    }, []);

    /**
     * Change page size and reset to first page
     */
    const changeSize = useCallback((newSize) => {
        if (newSize >= 1) {
            setSize(newSize);
            setPage(1);
        }
    }, []);

    /**
     * Reset pagination to initial state
     */
    const reset = useCallback(() => {
        setPage(initialPage);
        setSize(initialSize);
    }, [initialPage, initialSize]);

    /**
     * Calculate skip/offset for API calls
     */
    const skip = useMemo(() => (page - 1) * size, [page, size]);

    return {
        page,
        size,
        skip,
        nextPage,
        prevPage,
        goToPage,
        changeSize,
        reset,
        setPage,
        setSize
    };
}

export default usePagination;
