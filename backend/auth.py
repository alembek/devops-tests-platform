from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, EmailStr
import hashlib, uuid, jwt, time, json, os

SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
USERS_FILE = "users.json"

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
