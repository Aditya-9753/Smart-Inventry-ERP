from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.websocket.connection_manager import manager

router = APIRouter()

@router.websocket("/ws/inventory")
async def websocket_inventory(websocket: WebSocket):
    await manager.connect(websocket, "inventory")
    try:
        while True:
            data = await websocket.receive_text()
            # We don't really expect client to send messages, just listen
    except WebSocketDisconnect:
        manager.disconnect(websocket, "inventory")
