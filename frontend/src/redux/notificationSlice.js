import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
            state.unreadCount = action.payload.filter(n => !n.is_read).length;
        },
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            if (!action.payload.is_read) {
                state.unreadCount += 1;
            }
        },
        markAsRead: (state, action) => {
            const notification = state.notifications.find(n => n.id === action.payload);
            if (notification && !notification.is_read) {
                notification.is_read = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        markAllAsRead: (state) => {
            state.notifications.forEach(n => n.is_read = true);
            state.unreadCount = 0;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { setNotifications, addNotification, markAsRead, markAllAsRead, setLoading, setError } = notificationSlice.actions;
export default notificationSlice.reducer;