#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Print commands and their arguments as they are executed.
set -x

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Please install Node.js (version 14.0 or later) and try again."
    exit 1
fi

# Install dependencies
npm install

# Check if .env.local exists, if not, copy from .env.local.example
if [ ! -f .env.local ]; then
    if [ -f .env.local.example ]; then
        cp .env.local.example .env.local
        echo "Created .env.local from .env.local.example"
        echo "Please edit .env.local and fill in any necessary values if needed."
        echo "Continuing with server startup..."
    else
        echo ".env.local.example not found. Please create a .env.local file manually."
        exit 1
    fi
fi

# Start the development server
npm run dev

