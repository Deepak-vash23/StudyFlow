#!/bin/sh
# Exit immediately if a command exits with a non-zero status
set -e

# Install frontend dependencies (including devDependencies for vite build)
npm install --include=dev

# Build the frontend (outputs to dist/)
npm run build

# Move to server directory
cd server

# Install backend dependencies
npm install
