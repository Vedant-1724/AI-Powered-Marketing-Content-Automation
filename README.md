# 🚀 MarkAI — AI-Powered Marketing & Content Automation

A multi-tenant cloud SaaS platform for small businesses that generates AI content, automates posting & scheduling, personalizes campaigns, tracks analytics, and optimizes campaigns automatically.

## Architecture

```
Frontend (React + Tailwind)
        │
        ▼
API Gateway (Spring Boot)
        │
 ───────┼────────────────
 │      │               │
Auth  Content AI    Campaign
Svc    Service       Service
 │      │               │
PostgreSQL  Python AI  PostgreSQL
Redis      (LLM+RAG)   Redis
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Tailwind CSS, Vite, Axios |
| Backend | Spring Boot 3, Spring Security, JPA, PostgreSQL |
| AI Engine | Python, FastAPI, LangChain, OpenAI, FAISS |
| Infra | Docker, Kubernetes, Nginx, AWS |

## Quick Start

### Prerequisites
- Node.js 18+
- Java 17+
- Python 3.11+
- Docker & Docker Compose

### Run with Docker Compose
```bash
cp .env.example .env
# Edit .env with your API keys
docker-compose up --build
```

### Run Services Individually

**Frontend:**
```bash
cd frontend && npm install && npm run dev
```

**Backend:**
```bash
cd backend && ./mvnw spring-boot:run
```

**AI Service:**
```bash
cd ai-service && pip install -r requirements.txt && uvicorn app.main:app --reload
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | React dashboard |
| Backend API | 8080 | Spring Boot REST API |
| AI Service | 8000 | FastAPI content generation |
| PostgreSQL | 5432 | Primary database |
| Redis | 6379 | Caching & sessions |

## License
Proprietary — All rights reserved.
