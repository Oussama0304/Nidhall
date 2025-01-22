# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set environment variables with default values
ENV REACT_APP_API_URL=http://backend:3000
ENV REACT_APP_UPLOADS_URL=http://backend:3000/uploads
ENV REACT_APP_PUBLIC_URL=http://backend:3000/public
ENV NODE_ENV=production

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Install necessary tools
RUN apk update && \
    apk add --no-cache \
    curl \
    bash \
    wget \
    && rm -rf /var/cache/apk/*

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy static assets from builder stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create necessary directories with correct permissions
RUN mkdir -p /usr/share/nginx/html/uploads && \
    mkdir -p /usr/share/nginx/html/public && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Switch to non-root user
USER nginx

# Configure healthcheck
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=5 \
    CMD wget -q --spider http://localhost:80 || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]