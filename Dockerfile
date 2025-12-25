# Build
FROM node:22.17.0-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG SKIP_ENV_VALIDATION=true
ENV SKIP_ENV_VALIDATION=${SKIP_ENV_VALIDATION}
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Release image
FROM node:22.17.0-slim
COPY --from=builder /app /app
WORKDIR /app

ARG VERSION
ENV VERSION=${VERSION}

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
CMD ["npm","run", "start:next"]
