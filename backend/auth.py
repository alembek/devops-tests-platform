from fastapi import APIRouter, HTTPException, Depends, Request

from pydantic import BaseModel, EmailStr

import hashlib, uuid, jwt, time, json, os

import smtplib

from email.mime.text import MIMEText


SECRET_KEY = "supersecretkey"

ALGORITHM = "HS256"

USERS_FILE = "users.json"


GMAIL_USER = "alem.asaubaev@gmail.com"
GMAIL_PASSWORD = "uphp lowf mdix jjvp"
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

smtp_host = os.getenv("SMTP_HOST")
smtp_port = int(os.getenv("SMTP_PORT"))
smtp_user = os.getenv("SMTP_USER")
smtp_password = os.getenv("SMTP_PASSWORD")

auth_router = APIRouter()


def save_user(user):

    users = load_users()

    users[user['email']] = user

    with open(USERS_FILE, "w") as f:

        json.dump(users, f)


def load_users():

    if not os.path.exists(USERS_FILE):

        return {}

    with open(USERS_FILE, "r") as f:

        return json.load(f)


def hash_password(password):

    return hashlib.sha256(password.encode()).hexdigest()


def create_token(email):

    payload = {

        "sub": email,

        "iat": int(time.time()),

        "exp": int(time.time()) + 3600

    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token):

    try:

        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

    except jwt.ExpiredSignatureError:

        raise HTTPException(status_code=401, detail="Token expired")

    except jwt.InvalidTokenError:

        raise HTTPException(status_code=401, detail="Invalid token")


def send_registration_email(to_email):

    subject = "Регистрация завершена"

    body = "Поздравляем! Вы успешно зарегистрировались на платформе DevOps-тестов."

    

    msg = MIMEText(body)

    msg["Subject"] = subject

    msg["From"] = "noreply@yourdomain.com"

    msg["To"] = to_email


    try:

        with smtplib.SMTP("smtp.gmail.com", 587) as server:

            server.starttls()

            server.login("your_username", "your_password")

            server.send_message(msg)

        print("Письмо отправлено на", to_email)

    except Exception as e:

        print("Ошибка при отправке письма:", str(e))


class RegisterRequest(BaseModel):

    email: EmailStr

    password: str


class LoginRequest(BaseModel):

    email: EmailStr

    password: str


@auth_router.post("/register")

def register(data: RegisterRequest):

    users = load_users()

    if data.email in users:

        raise HTTPException(status_code=400, detail="User already exists")

    user = {

        "email": data.email,

        "password": hash_password(data.password),

        "id": str(uuid.uuid4())

    }

    save_user(user)

    

    # Отправка письма

    send_registration_email(data.email)


    return {"message": "Registered successfully"}


@auth_router.post("/login")

def login(data: LoginRequest):

    users = load_users()

    user = users.get(data.email)

    if not user or user['password'] != hash_password(data.password):

        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(data.email)

    return {"token": token}


@auth_router.get("/me")

def me(request: Request):

    auth = request.headers.get("Authorization")

    if not auth:

        raise HTTPException(status_code=401, detail="Missing token")

    token = auth.replace("Bearer ", "")

    payload = decode_token(token)

    return {"email": payload['sub']}

