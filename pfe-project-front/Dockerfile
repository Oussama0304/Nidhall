# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with specific flags for production
RUN npm ci --only=production --legacy-peer-deps

# Copy source code
COPY . .

# Set environment variables for build time
ARG REACT_APP_API_URL
ARG REACT_APP_UPLOADS_URL
ARG REACT_APP_PUBLIC_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV REACT_APP_UPLOADS_URL=${REACT_APP_UPLOADS_URL}
ENV REACT_APP_PUBLIC_URL=${REACT_APP_PUBLIC_URL}
ENV NODE_ENV=production

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create necessary directories
RUN mkdir -p /usr/share/nginx/html/uploads \
    && mkdir -p /usr/share/nginx/html/public \
    && chown -R nginx:nginx /usr/share/nginx/html

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]