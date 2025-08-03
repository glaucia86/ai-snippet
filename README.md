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

Full-stack TypeScript app with Express API + Remix frontend that creates intelligent text summaries.

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- GitHub Personal Access Token

### 1. Setup
```bash
git clone <your-repo-url>
cd ai-snippet-service
cp .env.example .env
```

### 2. Get GitHub Token
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name: `AI Snippet Test`
4. No permissions needed - just generate
5. Copy the token (starts with `ghp_`)

### 3. Configure & Run
```bash
# Add your token to .env
echo 'GITHUB_MODELS_TOKEN="ghp_your_token_here"' >> .env

# Start application
docker-compose up -d

# Check status
docker-compose ps
```

---

## ✅ Test It

**Web Interface:** http://localhost:3030
- Paste any text → Get AI summary

**API Health:** http://localhost:3001/health

**Create Snippet via API:**
```bash
curl -X POST http://localhost:3001/snippets \
  -H "Content-Type: application/json" \
  -d '{"text": "Your long text here..."}'
```

---

## 🐛 Issues?

**Containers not running?**
```bash
docker-compose logs
docker-compose restart
```

**"Cannot GET /" error?**
```bash
docker-compose down
docker-compose up -d
```

**Token error?**
- Check your token starts with `ghp_`
- Verify it's in `.env` file
- Restart: `docker-compose restart`

---

## 📡 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/health` | API status |
| POST | `/snippets` | Create snippet |
| GET | `/snippets` | List all snippets |
| GET | `/snippets/:id` | Get specific snippet |

---

## 🏗️ Architecture

- **Backend:** Node.js + Express + TypeScript
- **Frontend:** Remix + React + Tailwind CSS  
- **Database:** MongoDB (with in-memory fallback)
- **AI:** GitHub Models (GPT-4o)
- **Container:** Docker + Docker Compose

---

## 📄 License

MIT License

---

## 📝 Post-Challenge Reflection

### What I'd improve with more time:

**1. Enhanced AI Features**
- Support for multiple AI providers with automatic failover
- Configurable summary length and different summary styles
- Streaming AI responses with Server-Sent Events for better UX
- Cost optimization and rate limiting per user

**2. Advanced Authentication & Security**
- JWT-based authentication system
- Role-based access control for snippets
- User-specific snippet ownership and privacy controls
- API rate limiting and request validation

**3. Performance & Scalability**
- Redis caching layer for frequently accessed snippets
- Database connection pooling and query optimization
- CDN integration for static assets
- Background job processing for AI requests using queues

**4. Production Readiness**
- CI/CD pipeline with GitHub Actions
- Comprehensive monitoring with health checks and metrics
- Automated backup strategies for data persistence
- Log aggregation and error tracking
- Load balancing and horizontal scaling capabilities

**5. User Experience Enhancements**
- Rich text editor with syntax highlighting
- Snippet categories, tags, and search functionality
- Export functionality (PDF, Word, Markdown)
- Real-time collaboration features
- Progressive Web App (PWA) capabilities

### Trade-offs made:

**1. Database Flexibility vs Consistency**
- **Choice**: MongoDB for rapid development and schema flexibility
- **Trade-off**: Sacrificed ACID transactions for faster prototyping
- **Alternative**: PostgreSQL with Prisma would provide better type safety and relations

**2. In-Memory Fallback vs Pure Database Design**
- **Choice**: Implemented in-memory storage when database unavailable
- **Trade-off**: Added complexity but improved development experience
- **Impact**: Allows development without database setup, but creates dual code paths

**3. AI Provider Lock-in vs Multi-Provider Architecture**
- **Choice**: Focused on GitHub Models for simplicity and performance
- **Trade-off**: Easy integration but creates vendor dependency
- **Alternative**: Abstract AI service interface supporting multiple providers

**4. Monolithic vs Microservices Architecture**
- **Choice**: Single Docker Compose setup with coupled services
- **Trade-off**: Simpler deployment but less scalable architecture
- **Alternative**: Separate services with proper API gateways for production

**5. Client-Side State vs Advanced State Management**
- **Choice**: Used Remix's built-in state management
- **Trade-off**: Simpler implementation but limited offline capabilities
- **Alternative**: Redux Toolkit or Zustand for complex client state

**6. Development Speed vs Production Optimization**
- **Choice**: Prioritized working features over micro-optimizations
- **Trade-off**: Fast development cycle but some performance considerations deferred
- **Impact**: Suitable for MVP but would need optimization for scale

The 3-hour time constraint required focusing on core functionality while maintaining code quality. The Test-Driven Development approach proved valuable for ensuring reliability, while the containerized setup provides a solid foundation for production deployment. The application successfully demonstrates all required features with room for enhancement in scalability and advanced features.

---

**Repository:** https://github.com/glaucia86/ai-snippet