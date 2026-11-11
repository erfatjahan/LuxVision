from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=True)        
    avatar_url = Column(String, nullable=True)  
    credits = Column(Integer, default=3)        
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    role = Column(String, default="user")

class ImageHistory(Base):
    __tablename__ = "image_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    original_url = Column(String, nullable=False)
    enhanced_url = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())