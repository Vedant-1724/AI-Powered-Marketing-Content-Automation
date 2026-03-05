"""
MarkAI - AI Content Generation Microservice
FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import content, brand, optimizer
from app.config import settings

app = FastAPI(
    title="MarkAI AI Service",
    description="AI-powered content generation microservice with RAG-based brand memory",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "markai-ai-service",
        "demo_mode": settings.demo_mode,
    }


app.include_router(content.router, prefix="/api/content", tags=["Content Generation"])
app.include_router(brand.router, prefix="/api/brand", tags=["Brand Memory"])
app.include_router(optimizer.router, prefix="/api", tags=["AI Optimizer"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
