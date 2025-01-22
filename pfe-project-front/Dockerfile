# Build stage
FROM node:18-alpine as build
WORKDIR /app

# Définir les arguments de build
ARG REACT_APP_API_URL
ARG REACT_APP_UPLOADS_URL
ARG REACT_APP_PUBLIC_URL

# Définir les variables d'environnement
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_UPLOADS_URL=$REACT_APP_UPLOADS_URL
ENV REACT_APP_PUBLIC_URL=$REACT_APP_PUBLIC_URL

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

# Supprimer la configuration par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Copier la configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés
COPY --from=build /app/build /usr/share/nginx/html

# Créer les dossiers nécessaires
RUN mkdir -p /usr/share/nginx/html/uploads

# Définir les permissions correctes
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]