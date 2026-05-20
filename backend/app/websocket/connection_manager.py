from typing import List, Dict
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {
            "inventory": [],
            "dashboard": [],
            "notifications": [] # For notifications, we might map by user ID but for simple broadcast we keep lists
        }
        self.user_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, channel: str, user_id: str = None):
        await websocket.accept()
        if channel in self.active_connections:
            self.active_connections[channel].append(websocket)
        
        if user_id:
            if user_id not in self.user_connections:
                self.user_connections[user_id] = []
            self.user_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, channel: str, user_id: str = None):
        if channel in self.active_connections:
            try:
                self.active_connections[channel].remove(websocket)
            except ValueError:
                pass
                
        if user_id and user_id in self.user_connections:
            try:
                self.user_connections[user_id].remove(websocket)
                if not self.user_connections[user_id]:
                    del self.user_connections[user_id]
            except ValueError:
                pass

    async def broadcast(self, message: dict, channel: str):
        if channel in self.active_connections:
            for connection in self.active_connections[channel]:
                await connection.send_json(message)

    async def send_personal_message(self, message: dict, user_id: str):
        if user_id in self.user_connections:
            for connection in self.user_connections[user_id]:
                await connection.send_json(message)

manager = ConnectionManager()
