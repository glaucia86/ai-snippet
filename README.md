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

<h1 align="center">🤖 AI Snippet Service</h1>

<p align="center">
  <strong>A full-stack TypeScript application that transforms text content into AI-powered summaries</strong>
</p>

<p align="center">
  Built with Express.js backend, Remix frontend, and GitHub Models integration using GPT-4o for intelligent text summarization.
</p>

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- GitHub Personal Access Token (for AI integration)

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-snippet-service

# Copy environment template
cp .env.example .env

# Edit .env and add your GitHub Models token
nano .env  # Add your GITHUB_MODELS_TOKEN

# Run with Docker (includes tests)
./scripts/docker-dev.sh
```

### Option 2: Local Development (Recommended)

```bash
# Install dependencies
npm install

# Start MongoDB (Docker)
docker-compose up -d mongodb

# Run tests
npm test

# Start development servers
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3030
- **API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health

## 🏗️ Architecture

```
ai-snippet-service/
├── src/                    # Backend (Express API)
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic
│   ├── models/            # MongoDB models
│   └── tests/             # Test files
├── app/                   # Frontend (Remix)
│   ├── routes/            # Remix routes
│   └── styles/            # Tailwind CSS
├── docker/                # Docker configuration
├── scripts/               # Automation scripts
├── Dockerfile.api         # Backend container
├── Dockerfile.ui          # Frontend container
└── docker-compose.yml     # Orchestration
```

## 🔑 API Key Setup

### GitHub Models Token

1. Visit [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click **"Generate new token"** → **"Fine-grained personal access token"**
3. Configure the token:
   - **Name**: "AI Snippet Service"
   - **Expiration**: 90 days (or as needed)
   - **Permissions**:
     - Contents: Read
     - Metadata: Read
     - Pull requests: Read
4. Copy the generated token (starts with `ghp_`)
5. Add to your `.env` file:
   ```bash
   GITHUB_MODELS_TOKEN=ghp_your-actual-token-here
   GITHUB_MODELS_ENDPOINT=https://models.inference.ai.azure.com
   ```

## 📡 API Endpoints

### Create Snippet
```bash
POST /snippets
Content-Type: application/json

{
  "text": "Your content here..."
}

# Response
{
  "id": "507f1f77bcf86cd799439011",
  "text": "Your content here...",
  "summary": "AI-generated summary (≤30 words)",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Get Snippet by ID
```bash
GET /snippets/:id

# Response
{
  "id": "507f1f77bcf86cd799439011",
  "text": "Your content here...",
  "summary": "AI-generated summary",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Get All Snippets
```bash
GET /snippets

# Response
[
  {
    "id": "507f1f77bcf86cd799439011",
    "text": "Content...",
    "summary": "Summary...",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests in Docker
```bash
./scripts/test.sh
```

## 📋 Request Examples

### Using curl

```bash
# Health check
curl http://localhost:3001/health

# Create a snippet
curl -X POST http://localhost:3001/snippets \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Artificial intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals. Leading AI textbooks define the field as the study of intelligent agents: any device that perceives its environment and takes actions that maximize its chance of successfully achieving its goals."
  }'

# Get all snippets
curl http://localhost:3001/snippets

# Get specific snippet (replace with actual ID)
curl http://localhost:3001/snippets/507f1f77bcf86cd799439011
```

### Using Postman

Import this collection into Postman:

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
          "raw": "{{baseUrl}}/health",
          "host": ["{{baseUrl}}"],
          "path": ["health"]
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
          "raw": "{{baseUrl}}/snippets",
          "host": ["{{baseUrl}}"],
          "path": ["snippets"]
        }
      }
    },
    {
      "name": "Get All Snippets",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/snippets",
          "host": ["{{baseUrl}}"],
          "path": ["snippets"]
        }
      }
    },
    {
      "name": "Get Snippet by ID",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/snippets/{{snippetId}}",
          "host": ["{{baseUrl}}"],
          "path": ["snippets", "{{snippetId}}"]
        }
      }
    }
  ]
}
```

## 🐳 Docker Commands

### Development
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Build
```bash
# Build optimized images
./scripts/build.sh

# Or manually
docker-compose build --no-cache
```

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Run development servers (API + UI)
npm run dev

# Run only API server
npm run dev:api

# Run only UI server
npm run dev:ui

# Build for production
npm run build

# Type checking
npm run type-check

# Run linter
npm run lint
```

## 🎯 Features

### Backend (Express + TypeScript)
- ✅ RESTful API with proper HTTP status codes
- ✅ MongoDB integration with Mongoose
- ✅ GitHub Models integration with GPT-4o
- ✅ Automatic retry logic for AI API calls
- ✅ Input validation and error handling
- ✅ Comprehensive test suite with Jest + Supertest
- ✅ Docker containerization
- ✅ Health check endpoint
- ✅ Request logging with Morgan
- ✅ Security headers with Helmet
- ✅ CORS configuration
- ✅ In-memory fallback when database unavailable

### Frontend (Remix + Tailwind CSS)
- ✅ Server-side rendering with Remix
- ✅ Responsive design with Tailwind CSS
- ✅ Form handling with loading states
- ✅ Error boundaries and proper error handling
- ✅ Copy to clipboard functionality
- ✅ Character/word counting
- ✅ Mobile-friendly interface
- ✅ Accessibility considerations
- ✅ Mock data fallback for development

### DevOps & Infrastructure
- ✅ Multi-stage Docker builds
- ✅ Docker Compose orchestration
- ✅ Health checks for all services
- ✅ Automated testing pipeline
- ✅ Environment variable management
- ✅ Database initialization scripts
- ✅ Production-ready configurations

## 🔧 Troubleshooting

### Common Issues

**MongoDB Connection Error**
```bash
# Check if MongoDB is running
docker-compose ps mongodb

# View logs
docker-compose logs mongodb

# Restart MongoDB  
docker-compose restart mongodb
```

**GitHub Models API Error**
```bash
# Check your token in .env
grep GITHUB_MODELS_TOKEN .env

# Verify token format (should start with 'ghp_')
# Check token permissions at https://github.com/settings/tokens
```

**Port Already in Use**
```bash
# Check what's using the port
lsof -i :3001
lsof -i :3030

# Stop conflicting processes or change ports in .env
```

## 📊 Technical Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Frontend**: Remix, React, Tailwind CSS  
- **Database**: MongoDB with Mongoose
- **AI Service**: GitHub Models (GPT-4o)
- **Testing**: Jest, Supertest
- **Containerization**: Docker, Docker Compose
- **Development**: Nodemon, Concurrently
- **Code Quality**: ESLint, TypeScript

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

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`)
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

---

**Repository URL**: `https://github.com/glaucia86/ai-snippet`

Made with ❤️ using modern TypeScript and AI-powered development practices.