# Stage 1: Builder stage - Dùng để cài đặt dependencies và build
FROM node:18-alpine AS builder

# Cài đặt các package cần thiết cho native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++

WORKDIR /app

# Copy package files trước để tận dụng Docker cache
COPY package*.json ./

# Cài đặt dependencies với chế độ production
RUN npm ci --only=production

# Copy toàn bộ source code
COPY . .

# Stage 2: Production stage - Image cuối cùng
FROM node:18-alpine

# Tạo non-root user
RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -D appuser

WORKDIR /app

# Copy từ builder stage
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/ .

# Thiết lập environment variables
ENV NODE_ENV=production
EXPOSE 3000

# Chuyển sang non-root user
USER appuser

# Sử dụng node trực tiếp thay vì npm để chạy
CMD ["node", "app.js"]