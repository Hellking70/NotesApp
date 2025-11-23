# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Production (SPA)
FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/.output/public ./public

EXPOSE 3000

CMD ["serve", "-s", "public", "-l", "3000"]
