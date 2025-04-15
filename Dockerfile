# Stage 1: Build and install dependencies
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit --quiet

# Copy source code
COPY . .

# Add build step here if needed (e.g., for React/TypeScript)
# RUN npm run build

# Stage 2: Production image
FROM node:18-alpine

# Create non-root user
RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -D appuser

WORKDIR /app

# Copy from builder with proper ownership
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/ ./

# Environment configuration
ENV NODE_ENV=production
EXPOSE 3000

# Switch to non-root user
USER appuser

# Health check (recommended addition)
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget --spider http://localhost:3000/healthz || exit 1

# Use node directly instead of npm for better signal handling
CMD ["node", "server.js"]