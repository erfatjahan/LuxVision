import os
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from database import get_db
import models
from utils.security import get_current_user

from services.cloud_storage import upload_to_cloudinary

router = APIRouter(prefix="/api/profile", tags=["User Profile"])

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None

@router.get("/me")
def get_my_profile(current_user: models.User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": getattr(current_user, "name", "User"),
        "email": current_user.email,
        "credits": current_user.credits,
        "role": getattr(current_user, "role", "user"),
        "avatar_url": getattr(current_user, "avatar_url", "")
    }

@router.put("/me")
def update_my_profile(
    profile_data: ProfileUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile_data.name is not None and hasattr(current_user, "name"):
        current_user.name = profile_data.name

    if profile_data.email is not None and hasattr(current_user, "email"):
        existing_user = db.query(models.User).filter(models.User.email == profile_data.email, models.User.id != current_user.id).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered by another user.")
        current_user.email = profile_data.email

    db.commit()
    db.refresh(current_user)
    
    return {
        "message": "Profile updated successfully", 
        "name": getattr(current_user, "name", ""),
        "email": current_user.email
    }

@router.post("/avatar")
def upload_avatar(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        file_bytes = file.file.read()
        
        folder_path = f"luxai/user_{current_user.id}/avatar"
        avatar_url = upload_to_cloudinary(file_bytes, folder_name=folder_path)
        
        if not avatar_url:
            raise HTTPException(status_code=500, detail="Failed to get secure URL from Cloudinary.")
        

        if hasattr(current_user, "avatar_url"):
            current_user.avatar_url = avatar_url
            db.commit()
            db.refresh(current_user)
            
        return {"avatar_url": avatar_url}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Avatar upload failed: {str(e)}")