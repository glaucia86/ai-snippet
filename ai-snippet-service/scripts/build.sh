#!/bin/bash

# AI Snippet Service - Build Script
set -e

echo "Building AI Snippet Service..."

# Check if .env exists
if [ ! -f .env ]; then
    echo ".env file not found! Please create one from .env.example"
    exit 1
fi

# Run tests first
echo "Running tests before build..."
./scripts/test.sh

# Build Docker images
echo "Building Docker images..."
docker-compose build --no-cache

# Tag images for production
echo "Tagging images..."
docker tag ai-snippet-service_api:latest ai-snippet-service-api:latest
docker tag ai-snippet-service_ui:latest ai-snippet-service-ui:latest

echo "Build completed successfully!"
echo "Available images:"
echo "   - ai-snippet-service-api:latest"
echo "   - ai-snippet-service-ui:latest"

echo ""
echo "To run the application:"
echo "   docker-compose up"
echo ""
echo "Application will be available at:"
echo "   - Frontend: http://localhost:3030"
echo "   - API: http://localhost:3000"
echo "   - API Health: http://localhost:3000/health"