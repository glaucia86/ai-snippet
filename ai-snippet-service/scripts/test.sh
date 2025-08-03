#!/bin/bash

# AI Snippet Service - Test Runner Script
set -e

echo "Running AI Snippet Service Tests..."

# Start MongoDB for tests
echo "Starting test database..."
docker-compose up -d mongodb

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
sleep 10

# Run tests with coverage
echo "Running test suite with coverage..."
docker-compose run --rm test npm run test:coverage

# Check test results
if [ $? -eq 0 ]; then
    echo "All tests passed!"
    echo "Coverage report generated in ./coverage directory"
else
    echo "Tests failed!"
    exit 1
fi

# Cleanup
echo "Cleaning up test containers..."
docker-compose down

echo "Test run completed!"