// Basic WebSocket wrapper mapping to the FastAPI backend endpoints
export class WebSocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }

    connect(channel, token) {
        if (this.socket) this.disconnect();
        
        // Determine protocol based on current origin
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        // Assuming backend is at VITE_API_URL or relative
        const host = import.meta.env.VITE_API_URL ? new URL(import.meta.env.VITE_API_URL).host : window.location.host;
        
        const wsUrl = `${protocol}//${host}/ws/${channel}${token ? `?token=${token}` : ''}`;
        
        this.socket = new WebSocket(wsUrl);

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const eventName = data.event;
                if (this.listeners.has(eventName)) {
                    this.listeners.get(eventName).forEach(cb => cb(data.data));
                }
            } catch (error) {
                console.error("Error parsing WS message", error);
            }
        };

        this.socket.onclose = () => {
            console.log("WebSocket disconnected");
            // Implement simple reconnection logic if needed
        };
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    off(event, callback) {
        if (!this.listeners.has(event)) return;
        const callbacks = this.listeners.get(event);
        this.listeners.set(event, callbacks.filter(cb => cb !== callback));
    }
}

export const wsService = new WebSocketService();
