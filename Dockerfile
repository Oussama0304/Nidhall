# Build stage
FROM node:20-alpine as builder
WORKDIR /app

# Installation des dépendances de build
RUN apk add --no-cache python3 make g++

# Installation des dépendances
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:20-alpine
WORKDIR /app

# Copie des dépendances depuis le builder
COPY --from=builder /app/node_modules ./node_modules

# Création des dossiers nécessaires
RUN mkdir -p uploads/reclamations public && \
    chown -R node:node /app

# Copie des fichiers sources
COPY . .

USER node
EXPOSE 3000
CMD ["node", "server.js"]