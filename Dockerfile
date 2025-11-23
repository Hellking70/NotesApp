# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production (SPA)
FROM node:20-alpine

RUN npm install -g serve
COPY --from=builder /app/.output/public /app
WORKDIR /app
EXPOSE 3000
CMD ["serve", "-s", ".", "--single", "-l", "3000"]
