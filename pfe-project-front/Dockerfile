FROM node:18-alpine as build

WORKDIR /app

# Copier uniquement les fichiers nécessaires pour npm install
COPY package*.json ./
RUN npm install --production --legacy-peer-deps

# Copier le reste des fichiers
COPY . .

# Définir les variables d'environnement nécessaires
ENV REACT_APP_API_URL=http://backend:3000
ENV REACT_APP_UPLOADS_URL=http://backend:3000/uploads
ENV REACT_APP_PUBLIC_URL=http://backend:3000/public
ENV NODE_ENV=production

RUN npm run build

# Étape de production avec Nginx
FROM nginx:alpine

# Créer les répertoires nécessaires
RUN mkdir -p /usr/share/nginx/html/uploads \
    && mkdir -p /usr/share/nginx/html/public

# Copier les fichiers buildés et la configuration nginx
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Build stage
FROM node:16-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

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

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy static assets from builder stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create necessary directories
RUN mkdir -p /usr/share/nginx/html/uploads
RUN mkdir -p /usr/share/nginx/html/public

# Ensure proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]