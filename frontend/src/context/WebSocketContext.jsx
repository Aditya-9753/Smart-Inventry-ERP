import React, { createContext, useContext, useEffect } from 'react';
import { wsService } from '../services/websocketService';
import { getAccessToken } from '../utils/localStorage';
import { useAuth } from './AuthContext';
import { useDispatch } from 'react-redux';
import { addNotification } from '../redux/notificationSlice';
import toast from 'react-hot-toast';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isAuthenticated) {
            const token = getAccessToken();
            // Connect to notifications channel
            wsService.connect('notifications', token);

            // Register global listeners
            wsService.on('new_notification', (data) => {
                dispatch(addNotification(data));
                toast(data.title, { icon: '🔔' });
            });

            wsService.on('stock.low', (data) => {
                toast.error(`Low Stock Alert: ${data.message}`);
            });
        } else {
            wsService.disconnect();
        }

        return () => {
            wsService.disconnect();
        };
    }, [isAuthenticated, dispatch]);

    return (
        <WebSocketContext.Provider value={wsService}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketContext = () => useContext(WebSocketContext);
