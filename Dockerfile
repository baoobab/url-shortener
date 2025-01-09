# Dockerfile for /api directory

FROM node:16-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
#RUN npm install

# Copy the rest of the application code
COPY . .

#RUN npm run build

RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs

# Install dependencies
RUN npm install

RUN npm run build

# Start the application
RUN npm run dev
