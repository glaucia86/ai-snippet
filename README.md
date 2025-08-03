<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Remix-000000?style=for-the-badge&logo=remix&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-38b2ac?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub%20Models-181717?style=for-the-badge&logo=github&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" />
</p>

# 🤖 AI Snippet Service

**Transform any text into AI-powered summaries (≤30 words) using GPT-4o**

Full-stack TypeScript application with Express API + Remix frontend that creates intelligent text summaries.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- GitHub Personal Access Token (for AI integration)

### Required API Keys

**GitHub Models Token (Required for AI functionality):**

1. Visit: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**  
3. Configure:
   - **Name**: `AI Snippet Service`
   - **Expiration**: 90 days (or as needed)
   - **Scopes**: No permissions needed for GitHub Models
4. Click **"Generate token"**
5. Copy the token (starts with `ghp_`)

### Setup Options

#### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone <your-repo-url>
cd ai-snippet-service

# Configure environment
cp .env.example .env
echo 'GITHUB_MODELS_TOKEN="ghp_your_token_here"' >> .env

# Start application
docker-compose up -d

# Verify running services
docker-compose ps
```

#### Option 2: Local Development

```bash
# Clone repository
git clone <your-repo-url>
cd ai-snippet-service

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your GITHUB_MODELS_TOKEN

# Start MongoDB (Docker)
docker-compose up -d mongodb

# Start development servers
npm run dev
```

---

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in Docker
docker-compose run --rm test

# Run tests with watch mode (local development)
npm run test:watch
```

---

## 📡 API Endpoints & Examples

**Base URL:** `http://localhost:3001`

### Health Check
```bash
curl http://localhost:3001/health
```

### Create Snippet
```bash
curl -X POST http://localhost:3001/snippets \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Artificial intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals. Leading AI textbooks define the field as the study of intelligent agents: any device that perceives its environment and takes actions that maximize its chance of successfully achieving its goals."
  }'
```

### Get All Snippets
```bash
curl http://localhost:3001/snippets
```

### Get Specific Snippet
```bash
curl http://localhost:3001/snippets/{snippet-id}
```

### Postman Collection

Import this JSON into Postman for easy testing:

```json
{
  "info": {
    "name": "AI Snippet Service",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3001"
    }
  ],
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/health"
        }
      }
    },
    {
      "name": "Create Snippet",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"text\": \"Your long text content here that needs to be summarized by AI...\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/snippets"
        }
      }
    },
    {
      "name": "Get All Snippets",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/snippets"
        }
      }
    },
    {
      "name": "Get Snippet by ID",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/snippets/{{snippetId}}"
        }
      }
    }
  ]
}
```

---

## 🎯 Testing the Application

### Web Interface
- **URL:** http://localhost:3030
- Paste text → Generate AI summary → View saved snippets

### API Testing
- **Health:** http://localhost:3001/health
- Use curl commands above or import Postman collection

---

## 🏗️ Project Structure

```
ai-snippet-service/
├── src/                    # Express backend
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic (AI, snippets)
│   ├── models/            # MongoDB schemas
│   └── tests/             # Test files
├── app/                   # Remix frontend
├── docker/                # Database initialization
├── Dockerfile.api         # Backend container
├── Dockerfile.ui          # Frontend container
└── docker-compose.yml     # Orchestration
```

---

## 🔧 Troubleshooting

**Containers not starting:**
```bash
docker-compose logs
docker-compose down && docker-compose up -d
```

**API errors:**
- Verify `GITHUB_MODELS_TOKEN` in `.env`
- Check token starts with `ghp_`
- Restart: `docker-compose restart api`

---

## 📝 Post-Challenge Reflection

### What I'd improve with more time:

**Enhanced AI Features:** Multiple AI provider support with automatic failover, configurable summary lengths, streaming responses with Server-Sent Events, and per-user rate limiting for cost optimization.

**Security & Authentication:** JWT-based authentication, role-based access control, user-specific snippet ownership, comprehensive input validation, and API rate limiting.

**Performance & Scalability:** Redis caching for frequently accessed snippets, database connection pooling, CDN integration, background job processing with queues, and horizontal scaling capabilities.

**Production Readiness:** CI/CD pipeline with GitHub Actions, comprehensive monitoring and health checks, automated backup strategies, log aggregation, error tracking, and load balancing setup.

### Trade-offs made:

**Database Choice:** Selected MongoDB for rapid development and schema flexibility, sacrificing ACID transactions for faster prototyping. PostgreSQL with Prisma would provide better type safety and relational capabilities.

**Fallback Strategy:** Implemented in-memory storage when database unavailable, adding complexity but improving development experience. This creates dual code paths but enables development without database setup.

**AI Integration:** Focused on GitHub Models for simplicity, creating vendor dependency but enabling quick implementation. A provider-agnostic interface would offer more flexibility.

**Architecture:** Chose monolithic Docker Compose setup over microservices for simpler deployment, suitable for MVP but less scalable for production.

**State Management:** Used Remix's built-in patterns over complex state management solutions, prioritizing simplicity over advanced offline capabilities.

The 3-hour constraint required focusing on core functionality while maintaining code quality. The Test-Driven Development approach ensured reliability, while the containerized setup provides a solid foundation for production deployment.

---

## 📄 License

MIT License

**Repository:** https://github.com/glaucia86/ai-snippet