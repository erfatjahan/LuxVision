from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

from database import get_db
from models import User
from utils.security import (
    hash_password, 
    verify_password, 
    create_access_token, 
    create_reset_token, 
    verify_reset_token
)
from services.email_service import send_welcome_email, send_reset_password_email

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# --- Pydantic Models ---
class UserCreate(BaseModel):
    name:str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


# --- Routes ---
@router.post("/signup")
async def signup(user: UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(
        email=user.email,
        password_hash=hash_password(user.password),
        credits=3 
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    background_tasks.add_task(send_welcome_email, new_user.email)
    
    return {"message": "User created successfully. Welcome email sent!", "email": new_user.email}


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": str(db_user.id)})
    
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "email": db_user.email,
        "name": getattr(db_user, "name", "User"),
        "credits": db_user.credits
    }