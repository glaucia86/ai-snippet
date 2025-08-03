#!/bin/bash

# AI Snippet Service - Development Setup Script
set -e

echo "Starting AI Snippet Service Development Environment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "Please configure your AI provider before continuing!"
    echo "Run: ./scripts/setup-github-models.sh"
    echo "Or manually edit .env file and add your API keys."
    exit 1
fi

# Check AI provider configuration
AI_PROVIDER=$(grep "AI_PROVIDER=" .env | cut -d '=' -f2 || echo "github")

if [ "$AI_PROVIDER" = "github" ]; then
    if ! grep -q "GITHUB_TOKEN=ghp_" .env; then
        echo "GitHub Models selected but GITHUB_TOKEN not configured!"
        echo "Run: ./scripts/setup-github-models.sh"
        echo "Or get your token from: https://github.com/settings/tokens"
        exit 1
    fi
elif [ "$AI_PROVIDER" = "openai" ]; then
    if ! grep -q "OPENAI_API_KEY=sk-" .env; then
        echo "OpenAI selected but OPENAI_API_KEY not configured!"
        echo "Get your API key from: https://platform.openai.com/api-keys"
        exit 1
    fi
else
    echo "Unknown AI provider: $AI_PROVIDER"
    echo "Please set AI_PROVIDER to 'github' or 'openai' in .env file"
    exit 1
fi

echo " Running tests first..."
docker-compose run --rm test

if [ $? -eq 0 ]; then
    echo " All tests passed!"
    echo " Starting services..."
    
    # Build and start services
    docker-compose up --build
else
    echo "Tests failed! Please fix issues before starting services."
    exit 1
fi