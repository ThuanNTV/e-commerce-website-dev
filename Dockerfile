# Stage 1: Build và cài đặt dependencies
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files và cài đặt dependencies
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

# Copy toàn bộ source code
COPY . .

# Stage 2: Production image
FROM node:18-alpine

# Tạo non-root user
RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -D appuser

WORKDIR /app

# Copy từ builder
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --chown=appuser:appgroup . .

# Thiết lập môi trường
ENV NODE_ENV=production
EXPOSE 3000

# Chuyển sang non-root user
USER appuser

# Lệnh khởi động
CMD ["npm", "start"]