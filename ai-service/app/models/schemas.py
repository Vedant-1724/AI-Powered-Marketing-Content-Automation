"""
Pydantic models for AI content generation requests and responses
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class ContentType(str, Enum):
    BLOG = "blog"
    EMAIL = "email"
    AD_COPY = "ad_copy"
    CAPTION = "caption"
    SEO_CONTENT = "seo_content"
    HEADLINE = "headline"
    PRODUCT_DESCRIPTION = "product_description"


class ToneType(str, Enum):
    PROFESSIONAL = "professional"
    CASUAL = "casual"
    LUXURY = "luxury"
    BOLD = "bold"
    FRIENDLY = "friendly"
    URGENT = "urgent"
    INSPIRATIONAL = "inspirational"


class ContentRequest(BaseModel):
    content_type: ContentType = Field(..., description="Type of content to generate")
    topic: str = Field(..., description="Main topic or subject", min_length=3)
    tone: ToneType = Field(default=ToneType.PROFESSIONAL, description="Desired tone")
    keywords: Optional[List[str]] = Field(default=None, description="SEO keywords to include")
    target_audience: Optional[str] = Field(default=None, description="Target audience description")
    brand_id: Optional[str] = Field(default=None, description="Brand ID for RAG context")
    max_length: Optional[int] = Field(default=None, description="Max word count")
    additional_instructions: Optional[str] = Field(default=None, description="Extra instructions")
    platform: Optional[str] = Field(default=None, description="Target platform (instagram, linkedin, etc.)")


class ContentResponse(BaseModel):
    content: str
    content_type: ContentType
    tone: ToneType
    word_count: int
    seo_score: Optional[float] = None
    keywords_used: Optional[List[str]] = None
    suggestions: Optional[List[str]] = None


class ContentVariation(BaseModel):
    variations: List[ContentResponse]
    best_pick: int = Field(default=0, description="Index of the recommended variation")


class BrandUploadRequest(BaseModel):
    brand_id: str
    brand_name: str
    website_url: Optional[str] = None
    description: Optional[str] = None
    industry: Optional[str] = None
    brand_voice: Optional[str] = None
    target_audience: Optional[str] = None
    products: Optional[List[str]] = None


class BrandContext(BaseModel):
    brand_id: str
    brand_name: str
    context_snippets: List[str]
    relevance_scores: List[float]
