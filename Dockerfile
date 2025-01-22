# Build stage
FROM node:18-alpine as builder
WORKDIR /app

# Installation des dépendances de build
RUN apk add --no-cache python3 make g++

# Installation des dépendances
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine
WORKDIR /app

# Installation de curl pour le healthcheck
RUN apk add --no-cache curl

# Copie des dépendances depuis le builder
COPY --from=builder /app/node_modules ./node_modules

# Création des dossiers nécessaires
RUN mkdir -p uploads/reclamations public && \
    chown -R node:node /app

# Copie des fichiers du projet
COPY . .

# Utilisateur non-root
USER node

# Exposition du port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]