import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings


async def send_email(to_email: str, subject: str, html_content: str) -> bool:
    """
    Send an email using SMTP.
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        html_content: Email body (HTML format)
    
    Returns:
        True if sent successfully, False otherwise
    """
    if not settings.EMAILS_ENABLED:
        print(f"[EMAIL DISABLED] Would send email to {to_email} - Subject: {subject}")
        return False
    
    try:
        # Create message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_USER}>"
        msg["To"] = to_email
        
        # Attach HTML content
        msg.attach(MIMEText(html_content, "html"))
        
        # Send email
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER, to_email, msg.as_string())
        
        print(f"[EMAIL SENT] Email sent to {to_email} - Subject: {subject}")
        return True
    
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send email to {to_email}: {str(e)}")
        return False

