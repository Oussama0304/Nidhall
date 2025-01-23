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

# Installation de curl et autres utilitaires nécessaires
RUN apk add --no-cache curl wait4ports

# Copie des dépendances depuis le builder
COPY --from=builder /app/node_modules ./node_modules

# Création des dossiers nécessaires avec les bonnes permissions
RUN mkdir -p uploads/reclamations public && \
    chown -R node:node /app

# Copie des fichiers du projet
COPY . .

# Définir les variables d'environnement par défaut
ENV NODE_ENV=production \
    PORT=3000

# Utilisateur non-root
USER node

# Health check plus robuste
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Commande de démarrage avec attente de la base de données
CMD ["sh", "-c", "wait4ports -q tcp://database:3306 && node server.js"]