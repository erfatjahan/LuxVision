from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import io
from PIL import Image

from database import get_db
import models
from utils.security import get_current_user
from services.cloud_storage import upload_to_cloudinary
from model import enhance_image

router = APIRouter(prefix="/api/image", tags=["Image Processing"])

@router.post("/enhance")
async def process_image(
    request: Request, 
    file: UploadFile = File(...), 
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
   
    if current_user.credits < 1:
        raise HTTPException(status_code=402, detail="Not enough credits! Please recharge.")
    
    try:
        image_bytes = await file.read()
        input_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        original_url = upload_to_cloudinary(image_bytes, folder_name=f"luxai/user_{current_user.id}/original")
        
        ai_model = request.app.state.ai_model
        ai_device = request.app.state.ai_device
        
        if not ai_model:
            raise HTTPException(status_code=503, detail="AI Model is loading or unavailable.")
            
        enhanced_image = enhance_image(ai_model, ai_device, input_image)
        
        output_buffer = io.BytesIO()
        enhanced_image.save(output_buffer, format="PNG")
        output_bytes = output_buffer.getvalue()
        
        enhanced_url = upload_to_cloudinary(output_bytes, folder_name=f"luxai/user_{current_user.id}/enhanced")
        
        current_user.credits -= 1
        new_history = models.ImageHistory(
            user_id=current_user.id,
            original_url=original_url,
            enhanced_url=enhanced_url
        )
        db.add(new_history)
        db.commit()
        
        return {
            "message": "Image enhanced successfully!",
            "original_image": original_url,
            "enhanced_image": enhanced_url,
            "remaining_credits": current_user.credits
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image processing failed: {str(e)}")


@router.get("/history")
async def get_user_history(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    history = db.query(models.ImageHistory).filter(
        models.ImageHistory.user_id == current_user.id
    ).order_by(models.ImageHistory.id.desc()).all()
    
    return [
        {
            "id": h.id,
            "name": h.original_url.split("/")[-1] if h.original_url else "Enhanced_Image.png",
            "date": "Recent",
            "original_url": h.original_url,
            "enhanced_url": h.enhanced_url,
            "status": "Enhanced"
        }
        for h in history
    ]

@router.delete("/history/{item_id}")
async def delete_history_item(
    item_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    history_item = db.query(models.ImageHistory).filter(
        models.ImageHistory.id == item_id,
        models.ImageHistory.user_id == current_user.id
    ).first()
    
    if not history_item:
        raise HTTPException(status_code=404, detail="History item not found")
        
    db.delete(history_item)
    db.commit()
    
    return {"message": "History item deleted successfully!"}