#!/bin/bash

echo "Starting SQL Injection Demo..."

echo "Starting Backend..."
cd backend && bun src/index.ts &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 3

echo "Starting Frontend..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo "Services started!"
echo "Frontend: http://localhost:5174"
echo "Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all services"

trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT

wait
