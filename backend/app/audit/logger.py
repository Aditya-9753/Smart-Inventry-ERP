from app.audit.models import AuditLog

async def write_audit_log(user_id: str, action: str, module: str, ip_address: str):
    log = AuditLog(
        user_id=user_id,
        action=action,
        module=module,
        ip_address=ip_address
    )
    await log.insert()
