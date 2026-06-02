#!/bin/bash
# This script makes it easy to run the app on a Mac.
# You may need to run `chmod +x start-mac.command` once to make it executable.

cd "$(dirname "$0")"
echo "Starting Relationship Map App..."

if [ ! -d "node_modules" ]; then
    echo "First time setup - Installing dependencies..."
    npm install
    npx prisma generate
    npx prisma migrate dev --name init
fi

echo "Opening browser..."
# Wait 2 seconds for server to start, then open browser
(sleep 2 && open http://localhost:3000) &

echo "Starting server..."
npm run dev
