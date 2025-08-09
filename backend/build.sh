#!/bin/bash
set -e

echo "Installing dependencies..."
npm ci

echo "Generating Prisma client..."
npx prisma generate

echo "Running migrations..."
npx prisma migrate deploy

echo "Building TypeScript..."
npm run build

echo "Build completed successfully."
