import os
from sslcommerz_lib import SSLCOMMERZ
from dotenv import load_dotenv

load_dotenv()

settings = {
    'store_id': os.getenv("STORE_ID"),
    'store_pass': os.getenv("STORE_PASSWORD"),
    'issandbox': os.getenv("STORE_IS_SANDBOX") == "True"
}

sslcz = SSLCOMMERZ(settings)

def init_payment(user_id: int, user_name: str, user_email: str, amount: float, credits_to_add: int, phone: str, address: str, city: str):
    tran_id = f"LUXAI_{user_id}_{credits_to_add}_{os.urandom(4).hex()}"
    
    post_body = {}
    post_body['total_amount'] = amount
    post_body['currency'] = "BDT"
    post_body['tran_id'] = tran_id
    
    post_body['success_url'] = "http://127.0.0.1:8000/api/payment/success"
    post_body['fail_url'] = "http://127.0.0.1:8000/api/payment/fail"
    post_body['cancel_url'] = "http://127.0.0.1:8000/api/payment/cancel"
    
    post_body['cus_name'] = user_name
    post_body['cus_email'] = user_email
    post_body['cus_phone'] = phone
    # post_body['cus_add1'] = address
    # post_body['cus_city'] = city
    post_body['cus_country'] = "Bangladesh"
    
    post_body['shipping_method'] = "NO"
    post_body['product_name'] = f"{credits_to_add} AI Credits"
    post_body['product_category'] = "Digital Content"
    post_body['product_profile'] = "general"
    
    post_body['value_a'] = str(user_id)
    post_body['value_b'] = str(credits_to_add)

    response = sslcz.createSession(post_body)
    return response