from fastapi import FastAPI
from dotenv import load_dotenv

from app.routes.diagnosis import router as diagnosis_router
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()


app = FastAPI(
    title="Avrum AI Service",
    description="AI services for the Avrum agricultural platform",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(diagnosis_router)


@app.get("/")
async def root():
    return {
        "success": True,
        "service": "Avrum AI Service",
        "status": "running",
    }


@app.get("/health")
async def health_check():
    return {
        "success": True,
        "service": "avrum-ai",
        "status": "healthy",
    }