"""WebSocket Manager for handling real-time connections and message broadcasting."""

from typing import Set, Dict
from fastapi import WebSocket


class WebSocketManager:
    """
    Manages WebSocket connections for real-time communication.
    Supports per-user connections and broadcasting to specific groups.
    """
    
    def __init__(self):
        # Store active connections: {connection_id: websocket}
        self.active_connections: Dict[str, WebSocket] = {}
        # Store user subscriptions: {user_id: set(connection_ids)}
        self.user_subscriptions: Dict[str, Set[str]] = {}
        # Store inventory subscriptions: {warehouse_id: set(connection_ids)}
        self.inventory_subscriptions: Dict[str, Set[str]] = {}
    
    async def connect(self, websocket: WebSocket, connection_id: str) -> None:
        """Accept and register a new WebSocket connection."""
        await websocket.accept()
        self.active_connections[connection_id] = websocket
    
    async def disconnect(self, connection_id: str) -> None:
        """Remove a disconnected WebSocket connection and clean up subscriptions."""
        if connection_id in self.active_connections:
            del self.active_connections[connection_id]
        
        for user_id, connections in self.user_subscriptions.items():
            if connection_id in connections:
                connections.discard(connection_id)
        
        for warehouse_id, connections in self.inventory_subscriptions.items():
            if connection_id in connections:
                connections.discard(connection_id)
    
    async def subscribe_user(self, user_id: str, connection_id: str) -> None:
        """Subscribe a connection to user-specific events."""
        if user_id not in self.user_subscriptions:
            self.user_subscriptions[user_id] = set()
        self.user_subscriptions[user_id].add(connection_id)
    
    async def unsubscribe_user(self, user_id: str, connection_id: str) -> None:
        """Unsubscribe a connection from user-specific events."""
        if user_id in self.user_subscriptions:
            self.user_subscriptions[user_id].discard(connection_id)
    
    async def subscribe_inventory(self, warehouse_id: str, connection_id: str) -> None:
        """Subscribe a connection to warehouse inventory updates."""
        if warehouse_id not in self.inventory_subscriptions:
            self.inventory_subscriptions[warehouse_id] = set()
        self.inventory_subscriptions[warehouse_id].add(connection_id)
    
    async def unsubscribe_inventory(self, warehouse_id: str, connection_id: str) -> None:
        """Unsubscribe a connection from warehouse inventory updates."""
        if warehouse_id in self.inventory_subscriptions:
            self.inventory_subscriptions[warehouse_id].discard(connection_id)
    
    async def broadcast_to_user(self, user_id: str, data: dict) -> None:
        """Send a message to all connections for a specific user."""
        if user_id in self.user_subscriptions:
            for connection_id in self.user_subscriptions[user_id]:
                if connection_id in self.active_connections:
                    try:
                        await self.active_connections[connection_id].send_json(data)
                    except Exception as e:
                        print(f"Error sending message to connection {connection_id}: {e}")
    
    async def broadcast_to_warehouse(self, warehouse_id: str, data: dict) -> None:
        """Send a message to all connections monitoring a specific warehouse."""
        if warehouse_id in self.inventory_subscriptions:
            for connection_id in self.inventory_subscriptions[warehouse_id]:
                if connection_id in self.active_connections:
                    try:
                        await self.active_connections[connection_id].send_json(data)
                    except Exception as e:
                        print(f"Error sending message to connection {connection_id}: {e}")
    
    async def broadcast_to_all(self, data: dict) -> None:
        """Broadcast a message to all active connections."""
        for connection in self.active_connections.values():
            try:
                await connection.send_json(data)
            except Exception as e:
                print(f"Error broadcasting message: {e}")
    
    async def send_personal_message(self, connection_id: str, data: dict) -> None:
        """Send a message to a specific connection."""
        if connection_id in self.active_connections:
            try:
                await self.active_connections[connection_id].send_json(data)
            except Exception as e:
                print(f"Error sending personal message to {connection_id}: {e}")
    
    def get_connection_count(self) -> int:
        """Get total number of active connections."""
        return len(self.active_connections)
    
    def get_user_connection_count(self, user_id: str) -> int:
        """Get number of active connections for a user."""
        return len(self.user_subscriptions.get(user_id, set()))


manager = WebSocketManager()
