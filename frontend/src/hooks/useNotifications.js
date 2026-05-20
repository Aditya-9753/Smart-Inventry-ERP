import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notificationService } from '../services/notificationService';
import { setNotifications, markAsRead as markReadAction, markAllAsRead as markAllReadAction } from '../redux/notificationSlice';

export const useNotifications = () => {
    const dispatch = useDispatch();
    const { notifications, unreadCount, loading } = useSelector(state => state.notifications);

    const fetchNotifications = useCallback(async () => {
        try {
            const data = await notificationService.getNotifications();
            dispatch(setNotifications(data));
        } catch (error) {
            console.error(error);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            dispatch(markReadAction(id));
        } catch (error) {
            console.error(error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            dispatch(markAllReadAction());
        } catch (error) {
            console.error(error);
        }
    };

    return { notifications, unreadCount, loading, markAsRead, markAllAsRead, refresh: fetchNotifications };
};
