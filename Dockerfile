# Build
FROM node:23-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Release image
FROM node:23-alpine
COPY --from=builder /app /app
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
CMD ["npm","run", "start:next"]