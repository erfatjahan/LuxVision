from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from pydantic import BaseModel
from utils.security import get_admin_user

router = APIRouter(prefix="/api/admin", tags=["Admin Dashboard"])

class RoleUpdate(BaseModel):
    role: str

@router.get("/users")
def get_all_users(admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [{"id": u.id, "email": u.email, "credits": u.credits, "role": u.role} for u in users]

@router.post("/add-credit/{user_id}")
def add_credit_to_user(user_id: int, amount: int, admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.credits += amount
    db.commit()
    return {"message": f"{amount} credits added to {user.email}. Total credits: {user.credits}"}

@router.put("/user/{user_id}/role")
def update_user_role(user_id: int, role_data: RoleUpdate, admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    if admin.role not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not authorized to change roles")
        
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if role_data.role not in ["user", "admin", "superadmin"]:
        raise HTTPException(status_code=400, detail="Invalid role specified")
        
    user.role = role_data.role
    db.commit()
    return {"message": f"User {user.email} role updated to {user.role}"}


@router.delete("/user/{user_id}")
def delete_user(user_id: int, admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    if admin.role not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete users")
        
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="You cannot delete your own admin account")
    
    db.delete(user)
    db.commit()
    return {"message": f"User {user.email} deleted successfully"}