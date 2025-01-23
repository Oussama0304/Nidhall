# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production --legacy-peer-deps

# Copy source code
COPY . .

# Set environment variables
ENV REACT_APP_API_URL=http://backend:3000
ENV REACT_APP_UPLOADS_URL=http://backend:3000/uploads
ENV REACT_APP_PUBLIC_URL=http://backend:3000/public
ENV NODE_ENV=production

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Create required directories
RUN mkdir -p /usr/share/nginx/html/uploads \
    && mkdir -p /usr/share/nginx/html/public

# Copy built files and nginx config
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]