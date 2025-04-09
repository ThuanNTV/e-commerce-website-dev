FROM node:18-alpine

WORKDIR /app

# Copy package files trước để tận dụng cache
COPY package*.json ./

RUN npm install

# Copy toàn bộ source code
COPY . .

EXPOSE 3000

CMD ["node", "app.js"]