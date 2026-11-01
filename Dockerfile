# Stage 1: Build the React frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Production runtime environment
FROM node:22-alpine
WORKDIR /app

# Install server production dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Copy server code
COPY server/ ./server/

# Copy built frontend assets from builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "server/server.js"]
