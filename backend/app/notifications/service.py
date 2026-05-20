from typing import List

from fastapi import HTTPException

from app.notifications.models import Notification
from app.notifications.schemas import NotificationResponse
from app.websocket.connection_manager import manager


# =========================================
# CREATE NOTIFICATION
# =========================================

async def create_notification(
    user_id: str,
    title: str,
    message: str,
    type: str
):

    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=type,
        is_read=False
    )

    await notification.insert()

    # Real-time WebSocket Push
    await manager.send_personal_message(
        {
            "event": "new_notification",
            "data": {
                "id": str(notification.id),
                "user_id": str(notification.user_id),
                "title": notification.title,
                "message": notification.message,
                "type": notification.type,
                "is_read": notification.is_read,
                "created_at": str(notification.created_at)
            }
        },
        user_id=user_id
    )

    return NotificationResponse(
        id=str(notification.id),
        user_id=str(notification.user_id),
        title=notification.title,
        message=notification.message,
        type=notification.type,
        is_read=notification.is_read,
        created_at=notification.created_at
    )


# =========================================
# GET USER NOTIFICATIONS
# =========================================

async def get_user_notifications(
    user_id: str,
    skip: int = 0,
    limit: int = 20
) -> List[NotificationResponse]:

    notifications = (
        await Notification.find(
            Notification.user_id == user_id
        )
        .sort("-created_at")
        .skip(skip)
        .limit(limit)
        .to_list()
    )

    return [
        NotificationResponse(
            id=str(notification.id),
            user_id=str(notification.user_id),
            title=notification.title,
            message=notification.message,
            type=notification.type,
            is_read=notification.is_read,
            created_at=notification.created_at
        )
        for notification in notifications
    ]


# =========================================
# MARK SINGLE NOTIFICATION AS READ
# =========================================

async def mark_as_read(
    notification_id: str,
    user_id: str
) -> NotificationResponse:

    notification = await Notification.get(notification_id)

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    if str(notification.user_id) != str(user_id):
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    notification.is_read = True

    await notification.save()

    return NotificationResponse(
        id=str(notification.id),
        user_id=str(notification.user_id),
        title=notification.title,
        message=notification.message,
        type=notification.type,
        is_read=notification.is_read,
        created_at=notification.created_at
    )


# =========================================
# MARK ALL NOTIFICATIONS AS READ
# =========================================

async def mark_all_as_read(user_id: str):

    await Notification.find(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).update(
        {
            "$set": {
                "is_read": True
            }
        }
    )

    return {
        "message": "All notifications marked as read"
    }