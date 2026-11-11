import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from dotenv import load_dotenv

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT")),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_welcome_email(email_to: str):
    html_content = f"""
    <h2>Welcome to LuxAI!</h2>
    <p>Hello,</p>
    <p>Thank you for joining LuxAI.You have received <b>3 free credits</b> to enhance your low-light images!</p>
    <p>Start enhancing your images today.</p>
    <br>
    <p>Best Regards,<br>The LuxAI Team</p>
    """
    
    message = MessageSchema(
        subject="Welcome to LuxAI - Your Free Credits are Here!",
        recipients=[email_to],
        body=html_content,
        subtype=MessageType.html
    )
    
    fm = FastMail(conf)
    await fm.send_message(message)


async def send_reset_password_email(email_to: str, token: str):
    reset_url = f"http://localhost:5173/reset-password?token={token}"
    
    html_content = f"""
    <h2>Password Reset Request</h2>
    <p>Hello,</p>
    <p>You requested to reset your password.Click the link below to set a new password:</p>
    <br>
    <a href="{reset_url}" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <br><br>
    <p><i>Note:This link will expire in 15 minutes.If you didn't request this,please ignore this email.</i></p>
    <br>
    <p>Best Regards,<br>The LuxAI Team</p>
    """
    
    message = MessageSchema(
        subject="Reset Your LuxAI Password",
        recipients=[email_to],
        body=html_content,
        subtype=MessageType.html
    )
    
    fm = FastMail(conf)
    await fm.send_message(message)