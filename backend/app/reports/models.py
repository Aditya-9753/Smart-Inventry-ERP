from app.database.base import BaseDocument

class Report(BaseDocument):
    title: str
    type: str
    file_path: str
    generated_by: str

    class Settings:
        name = "reports"
