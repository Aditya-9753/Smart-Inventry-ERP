from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.websocket.connection_manager import manager
from app.core.jwt_handler import decode_token

router = APIRouter()

@router.websocket("/ws/notifications")
async def websocket_notifications(websocket: WebSocket, token: str):
    # Authenticate via token in query param
    payload = decode_token(token)
    if not payload:
        await websocket.close(code=1008)
        return
        
    user_id = payload.get("sub")
    await manager.connect(websocket, "notifications", user_id=user_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, "notifications", user_id=user_id)
