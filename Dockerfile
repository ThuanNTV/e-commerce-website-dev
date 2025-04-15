FROM node:18-alpine

# Thêm các packages cần thiết để build native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]