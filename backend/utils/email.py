import smtplib

from email.mime.text import MIMEText

from config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD


def send_registration_email(to_email: str, username: str):

    subject = "Регистрация завершена"

    body = f"Привет, {username}!\n\nВы успешно зарегистрировались на платформе DevOps-тестов."


    msg = MIMEText(body, "plain", "utf-8")

    msg["Subject"] = subject

    msg["From"] = SMTP_USER

    msg["To"] = to_email


    try:

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:

            server.starttls()

            server.login(SMTP_USER, SMTP_PASSWORD)

            server.send_message(msg)

    except Exception as e:

        print(f"Ошибка отправки письма: {e}")

