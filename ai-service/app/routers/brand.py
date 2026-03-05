"""
Brand Memory API Router
Handles brand profile storage and retrieval for RAG-based personalization
"""
from fastapi import APIRouter, HTTPException
from app.models.schemas import BrandUploadRequest
from app.rag.brand_memory import brand_memory

router = APIRouter()


@router.post("/upload")
async def upload_brand(request: BrandUploadRequest):
    """
    Upload brand information for RAG-based content personalization.
    Stores brand context as embeddings for future content generation.
    """
    try:
        result = await brand_memory.store_brand(
            brand_id=request.brand_id,
            brand_name=request.brand_name,
            description=request.description,
            website_url=request.website_url,
            industry=request.industry,
            brand_voice=request.brand_voice,
            target_audience=request.target_audience,
            products=request.products,
        )
        return {"message": "Brand context stored successfully", **result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store brand context: {str(e)}")


@router.get("/list")
async def list_brands():
    """List all stored brand profiles."""
    brands = await brand_memory.list_brands()
    return {"brands": brands, "count": len(brands)}


@router.delete("/{brand_id}")
async def delete_brand(brand_id: str):
    """Delete a brand's stored context."""
    deleted = await brand_memory.delete_brand(brand_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Brand not found")
    return {"message": f"Brand '{brand_id}' deleted successfully"}
