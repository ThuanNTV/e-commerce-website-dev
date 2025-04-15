FROM node:18-alpine

# Add necessary packages for building native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000

# Use this for production
CMD ["npm", "start"]

# Or use this for development
# CMD ["npm", "run", "dev"]