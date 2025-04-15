#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Build and start Docker containers
echo "Building and starting Docker containers..."
docker-compose up --build -d

# Check the status of the containers
echo "Checking container status..."
docker-compose ps

echo "Docker initialization complete."
