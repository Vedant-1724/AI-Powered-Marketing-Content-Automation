"""
Application configuration using Pydantic Settings
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    openai_api_key: str = "demo"
    demo_mode: bool = True
    openai_model: str = "gpt-4"
    embedding_model: str = "text-embedding-ada-002"
    max_tokens: int = 2000
    temperature: float = 0.7
    faiss_index_path: str = "./data/faiss_index"

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
