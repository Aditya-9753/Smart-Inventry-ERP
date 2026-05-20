from app.database.base import BaseDocument

class Notification(BaseDocument):
    user_id: str
    title: str
    message: str
    type: str # 'info', 'warning', 'error'
    is_read: bool = False

    class Settings:
        name = "notifications"
