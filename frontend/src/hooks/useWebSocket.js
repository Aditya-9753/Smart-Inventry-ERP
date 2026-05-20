import { useEffect } from 'react';
import { useWebSocketContext } from '../context/WebSocketContext';

export const useWebSocket = (event, callback) => {
    const ws = useWebSocketContext();

    useEffect(() => {
        if (ws) {
            ws.on(event, callback);
        }
        return () => {
            if (ws) {
                ws.off(event, callback);
            }
        };
    }, [ws, event, callback]);
};
