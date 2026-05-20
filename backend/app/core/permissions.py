from fastapi import Depends, HTTPException
from app.auth.dependencies import get_current_user
from app.users.models import User, Role, Permission
from app.core.roles import RoleEnum
from beanie import PydanticObjectId

ROLE_PERMISSION_FALLBACKS = {
    RoleEnum.MANAGER.value: {
        "dashboard": {"read"},
        "products": {"read", "write"},
        "inventory": {"read", "write"},
        "warehouses": {"read", "write"},
        "analytics": {"read"},
        "reports": {"read"},
        "notifications": {"read", "write"},
    },
    RoleEnum.STAFF.value: {
        "dashboard": {"read"},
        "products": {"read"},
        "inventory": {"read", "write"},
        "warehouses": {"read"},
        "notifications": {"read", "write"},
    },
    RoleEnum.VIEWER.value: {
        "dashboard": {"read"},
        "products": {"read"},
        "inventory": {"read"},
        "warehouses": {"read"},
        "reports": {"read"},
        "notifications": {"read", "write"},
    },
}

async def resolve_role(role_id: str) -> Role | None:
    try:
        return await Role.get(PydanticObjectId(role_id))
    except Exception:
        return await Role.find_one(Role.name == role_id.upper())

def has_fallback_permission(role_name: str, module: str, action: str) -> bool:
    if role_name == RoleEnum.ADMIN.value:
        return True

    return action in ROLE_PERMISSION_FALLBACKS.get(role_name, {}).get(module, set())

def require_permission(module: str, action: str): # action: 'read', 'write', 'delete'
    async def permission_checker(current_user: User = Depends(get_current_user)):
        role_name = RoleEnum.VIEWER.value
        role = None

        if current_user.role_id:
            role = await resolve_role(current_user.role_id)
            requested_role = current_user.role_id.upper()
            valid_role_names = {role.value for role in RoleEnum}
            role_name = role.name if role else requested_role if requested_role in valid_role_names else RoleEnum.VIEWER.value
        
        if role_name == RoleEnum.ADMIN.value:
            return current_user

        if role:
            permission = await Permission.find_one(
                Permission.role_id == str(role.id),
                Permission.module == module
            )

            if permission:
                allowed = (
                    (action == "read" and permission.can_read)
                    or (action == "write" and permission.can_write)
                    or (action == "delete" and permission.can_delete)
                )
                if allowed:
                    return current_user

        if not has_fallback_permission(role_name, module, action):
            raise HTTPException(status_code=403, detail=f"{role_name} cannot {action} {module}")
            
        return current_user
        
    return permission_checker
