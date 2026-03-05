"""
Brand Memory Service — RAG-based brand context using FAISS
Stores brand information as embeddings for personalized content generation
"""
import os
import json
from typing import Optional, List
from app.config import settings


# In-memory brand store (for demo mode / development)
_brand_store: dict = {}


class BrandMemoryService:
    """
    Manages brand context storage and retrieval.
    Uses FAISS for vector similarity search in production,
    falls back to keyword-based matching in demo mode.
    """

    def __init__(self):
        self.index_path = settings.faiss_index_path
        self._ensure_data_dir()

    def _ensure_data_dir(self):
        os.makedirs(os.path.dirname(self.index_path) if self.index_path else "./data", exist_ok=True)

    async def store_brand(
        self,
        brand_id: str,
        brand_name: str,
        description: Optional[str] = None,
        website_url: Optional[str] = None,
        industry: Optional[str] = None,
        brand_voice: Optional[str] = None,
        target_audience: Optional[str] = None,
        products: Optional[List[str]] = None,
    ) -> dict:
        """Store brand information for RAG retrieval."""

        # Build brand context document
        brand_doc = {
            "brand_id": brand_id,
            "brand_name": brand_name,
            "description": description or "",
            "website_url": website_url or "",
            "industry": industry or "",
            "brand_voice": brand_voice or "",
            "target_audience": target_audience or "",
            "products": products or [],
        }

        # Build text chunks for embedding
        chunks = self._build_chunks(brand_doc)

        if settings.demo_mode or settings.openai_api_key == "demo":
            # Demo mode: store in memory
            _brand_store[brand_id] = {
                "metadata": brand_doc,
                "chunks": chunks,
            }
            return {
                "status": "stored",
                "brand_id": brand_id,
                "chunks_count": len(chunks),
                "mode": "demo",
            }
        else:
            # Production: create embeddings and store in FAISS
            from langchain_openai import OpenAIEmbeddings
            from langchain_community.vectorstores import FAISS
            from langchain.schema import Document

            embeddings = OpenAIEmbeddings(
                model=settings.embedding_model,
                openai_api_key=settings.openai_api_key,
            )

            documents = [
                Document(
                    page_content=chunk,
                    metadata={"brand_id": brand_id, "brand_name": brand_name},
                )
                for chunk in chunks
            ]

            vectorstore = FAISS.from_documents(documents, embeddings)
            vectorstore.save_local(f"{self.index_path}/{brand_id}")

            return {
                "status": "stored",
                "brand_id": brand_id,
                "chunks_count": len(chunks),
                "mode": "production",
            }

    def _build_chunks(self, brand_doc: dict) -> List[str]:
        """Break brand info into meaningful chunks for embedding."""
        chunks = []

        if brand_doc["description"]:
            chunks.append(
                f"Brand: {brand_doc['brand_name']}. {brand_doc['description']}"
            )

        if brand_doc["industry"]:
            chunks.append(
                f"{brand_doc['brand_name']} operates in the {brand_doc['industry']} industry."
            )

        if brand_doc["brand_voice"]:
            chunks.append(
                f"Brand voice and style: {brand_doc['brand_voice']}"
            )

        if brand_doc["target_audience"]:
            chunks.append(
                f"Target audience: {brand_doc['target_audience']}"
            )

        if brand_doc["products"]:
            products_text = ", ".join(brand_doc["products"])
            chunks.append(
                f"Products and services offered by {brand_doc['brand_name']}: {products_text}"
            )

        if brand_doc["website_url"]:
            chunks.append(
                f"Website: {brand_doc['website_url']}"
            )

        # If no chunks, create a default one
        if not chunks:
            chunks.append(f"Brand: {brand_doc['brand_name']}")

        return chunks

    async def get_brand_context(
        self, brand_id: str, query: str, top_k: int = 3
    ) -> Optional[str]:
        """Retrieve relevant brand context for a content generation query."""

        if settings.demo_mode or settings.openai_api_key == "demo":
            # Demo mode: return stored chunks
            brand_data = _brand_store.get(brand_id)
            if not brand_data:
                return None
            # Return all chunks as context (simple demo mode)
            return "\n".join(brand_data["chunks"][:top_k])
        else:
            # Production: similarity search in FAISS
            from langchain_openai import OpenAIEmbeddings
            from langchain_community.vectorstores import FAISS

            index_dir = f"{self.index_path}/{brand_id}"
            if not os.path.exists(index_dir):
                return None

            embeddings = OpenAIEmbeddings(
                model=settings.embedding_model,
                openai_api_key=settings.openai_api_key,
            )

            vectorstore = FAISS.load_local(
                index_dir, embeddings, allow_dangerous_deserialization=True
            )
            docs = vectorstore.similarity_search(query, k=top_k)

            if not docs:
                return None

            return "\n".join(doc.page_content for doc in docs)

    async def list_brands(self) -> List[dict]:
        """List all stored brands."""
        if settings.demo_mode or settings.openai_api_key == "demo":
            return [
                {"brand_id": bid, "brand_name": data["metadata"]["brand_name"]}
                for bid, data in _brand_store.items()
            ]
        else:
            # List by directories in FAISS index path
            brands = []
            if os.path.exists(self.index_path):
                for brand_id in os.listdir(self.index_path):
                    if os.path.isdir(os.path.join(self.index_path, brand_id)):
                        brands.append({"brand_id": brand_id, "brand_name": brand_id})
            return brands

    async def delete_brand(self, brand_id: str) -> bool:
        """Delete a brand's stored context."""
        if settings.demo_mode or settings.openai_api_key == "demo":
            if brand_id in _brand_store:
                del _brand_store[brand_id]
                return True
            return False
        else:
            import shutil
            index_dir = f"{self.index_path}/{brand_id}"
            if os.path.exists(index_dir):
                shutil.rmtree(index_dir)
                return True
            return False


# Singleton instance
brand_memory = BrandMemoryService()
