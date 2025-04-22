import os


SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")

SMTP_PORT = int(os.getenv("SMTP_PORT", 587))

SMTP_USER = os.getenv("SMTP_USER", "your_email@gmail.com")

SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "your_app_password")

