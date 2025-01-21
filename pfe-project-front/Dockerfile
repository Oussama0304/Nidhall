# Build stage
FROM node:18-alpine as build
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

# Construire l'application
RUN npm run build

# Production stage
FROM nginx:1.25-alpine

# Copier la configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés
COPY --from=build /app/build /usr/share/nginx/html

# Créer les dossiers nécessaires
RUN mkdir -p /usr/share/nginx/html/uploads

# Vérifier que les fichiers sont bien copiés
RUN ls -la /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]