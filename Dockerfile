# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install build dependencies
RUN apk add --no-cache python3 make g++
RUN npm ci --only=production

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install necessary utilities for healthcheck and database connection
RUN apk update && \
    apk add --no-cache \
    curl \
    bash \
    procps \
    net-tools \
    mysql-client \
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

# Copy healthcheck and wait-for-db scripts
COPY healthcheck.sh /healthcheck.sh
COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /healthcheck.sh /wait-for-db.sh && \
    chown appuser:appgroup /healthcheck.sh /wait-for-db.sh

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Configure healthcheck
HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=5 \
    CMD /healthcheck.sh

# Start the application with database wait
CMD ["/wait-for-db.sh", "database", "node", "src/server.js"]