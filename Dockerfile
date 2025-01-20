FROM node:20-alpine
WORKDIR /app

# Installation des dépendances nécessaires
RUN apk add --no-cache python3 make g++

# Copie des fichiers package.json et installation des dépendances
COPY package*.json ./
RUN npm install

# Création des dossiers nécessaires
RUN mkdir -p uploads/reclamations
RUN mkdir -p public

# Copie du reste des fichiers
COPY . .

# Configuration des permissions
RUN chown -R node:node /app
USER node

EXPOSE 3000
CMD ["node", "server.js"]