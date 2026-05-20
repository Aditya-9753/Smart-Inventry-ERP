import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dashboardService } from '../services/dashboardService';
import { setStats, setCharts, setLoading, setError } from '../redux/dashboardSlice';

export const useAnalytics = () => {
    const dispatch = useDispatch();
    const { stats, charts, loading, error } = useSelector((state) => state.dashboard);
    const [dateRange, setDateRange] = useState({ start: null, end: null });

    const fetchDashboardData = async () => {
        dispatch(setLoading(true));
        try {
            const [statsData, chartsData] = await Promise.all([
                dashboardService.getStats(),
                dashboardService.getCharts()
            ]);
            dispatch(setStats(statsData));
            dispatch(setCharts(chartsData));
        } catch (err) {
            dispatch(setError(err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [dateRange]); // Refetch if dateRange changes

    return { stats, charts, loading, error, dateRange, setDateRange, refetch: fetchDashboardData };
};
