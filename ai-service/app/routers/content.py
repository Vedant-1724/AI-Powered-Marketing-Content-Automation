"""
Content Generation API Router
Handles all content generation endpoints
"""
from fastapi import APIRouter, HTTPException
from app.models.schemas import ContentRequest, ContentResponse, ContentType, ToneType
from app.services.content_generator import generate_content
from app.rag.brand_memory import brand_memory

router = APIRouter()


@router.post("/generate", response_model=ContentResponse)
async def generate(request: ContentRequest):
    """
    Generate AI-powered marketing content.
    
    Supports: blog, email, ad_copy, caption, seo_content, headline, product_description
    """
    try:
        # Retrieve brand context if brand_id is provided
        brand_context = None
        if request.brand_id:
            brand_context = await brand_memory.get_brand_context(
                brand_id=request.brand_id,
                query=request.topic,
            )

        result = await generate_content(request, brand_context)
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Content generation failed: {str(e)}")


@router.get("/types")
async def get_content_types():
    """List all available content types with descriptions."""
    return {
        "content_types": [
            {"id": ct.value, "name": ct.value.replace("_", " ").title()}
            for ct in ContentType
        ],
        "tones": [
            {"id": t.value, "name": t.value.title()}
            for t in ToneType
        ],
    }
