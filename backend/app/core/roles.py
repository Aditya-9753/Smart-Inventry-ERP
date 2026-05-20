from enum import Enum

class RoleEnum(str, Enum):
    ADMIN = "ADMIN"
    MANAGER = "MANAGER"
    STAFF = "STAFF"
    VIEWER = "VIEWER"
