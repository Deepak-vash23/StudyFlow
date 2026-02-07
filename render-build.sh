#!/bin/sh
# Install frontend dependencies
npm install

# Build the frontend (outputs to dist/)
npm run build

# Move to server directory
cd server

# Install backend dependencies
npm install
