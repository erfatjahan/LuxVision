from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routers import auth, admin, payment, image,profile
from model import load_ai_model

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Loading AI Model into Memory...")
    app.state.ai_model, app.state.ai_device = load_ai_model("weights/hybrid_final.pth") 
    print("AI Model Loaded Successfully!")
    yield
    app.state.ai_model = None
    app.state.ai_device = None
    print("Shutting down...")

app = FastAPI(title="LuxAI SaaS API", lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)


app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(payment.router)
app.include_router(image.router) 
app.include_router(profile.router)
@app.get("/")
def home():
    return {"message": "LuxAI Backend is Fully Operational!"}