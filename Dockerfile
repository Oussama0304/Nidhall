# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

RUN apk add --no-cache python3 make g++
RUN npm ci --only=production

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install necessary utilities for healthcheck
RUN apk update && \
    apk add --no-cache \
    curl \
    bash \
    procps \
    net-tools \
    && rm -rf /var/cache/apk/*

# Create app user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create necessary directories
RUN mkdir -p /app/uploads /app/public && \
    chown -R appuser:appgroup /app && \
    chmod -R 755 /app

# Copy built node modules and source
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Copy healthcheck script
COPY healthcheck.sh /healthcheck.sh
RUN chmod +x /healthcheck.sh

# Create endpoint for healthcheck
RUN echo 'app.get("/api/health", (req, res) => res.status(200).json({ status: "healthy" }));' >> src/app.js

# Switch to non-root user
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD /healthcheck.sh

CMD ["npm", "start"]