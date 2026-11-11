from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from fastapi.responses import RedirectResponse

from database import get_db
import models
from utils.security import get_current_user
from services.payment_service import init_payment 

router = APIRouter(prefix="/api/payment", tags=["Payment"])

class PaymentRequest(BaseModel):
    plan: str
    amount: float
    phone: str
    email: str  
    city: str = "Ctg"

@router.post("/init")
def create_payment_session(
    data: PaymentRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    credits_to_add = 50 if data.plan == "pro" else 10

    try:
        response = init_payment(
            user_id=current_user.id,
            user_name=getattr(current_user, "name", "User"),
            user_email=data.email,  
            amount=data.amount,
            credits_to_add=credits_to_add,
            phone=data.phone,       
            address="Digital Service", 
            city=data.city          
        )

        if isinstance(response, dict) and response.get('status') == 'SUCCESS':
            return {"gateway_url": response.get('GatewayPageURL')}
        else:
            raise HTTPException(
                status_code=400, 
                detail=response.get("failedreason", "Payment gateway initiation failed.")
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/success")
async def payment_success(request: Request, db: Session = Depends(get_db)):
    form_data = await request.form()
    user_id = form_data.get("value_a")
    raw_credits = form_data.get("value_b")
    
    credits_to_add = int(raw_credits) if raw_credits and str(raw_credits).isdigit() else 0
    
    if user_id:
        user = db.query(models.User).filter(models.User.id == int(user_id)).first()
        if user:
            user.credits += credits_to_add
            db.commit()

    return RedirectResponse(url="http://localhost:5173/payment-success", status_code=303)

@router.post("/fail")
async def payment_fail(request: Request):
    return RedirectResponse(url="http://localhost:5173/billing?payment=fail", status_code=303)

@router.post("/cancel")
async def payment_cancel(request: Request):
    return RedirectResponse(url="http://localhost:5173/billing?payment=cancel", status_code=303)