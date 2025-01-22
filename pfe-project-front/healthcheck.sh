#!/bin/bash

# Vérifier si nginx est en cours d'exécution
if ! pgrep nginx > /dev/null; then
    echo "Nginx n'est pas en cours d'exécution"
    exit 1
fi

# Vérifier si le fichier index.html existe
if [ ! -f /usr/share/nginx/html/index.html ]; then
    echo "Le fichier index.html n'existe pas"
    exit 1
fi

# Vérifier si nginx écoute sur le port 80
if ! netstat -an | grep "LISTEN" | grep ":80 " > /dev/null; then
    echo "Nginx n'écoute pas sur le port 80"
    exit 1
fi

# Vérifier l'accès HTTP local
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:80/)
if [ "$response" != "200" ]; then
    echo "Échec de l'accès HTTP: $response"
    exit 1
fi

# Vérifier les permissions des répertoires
if [ ! -w "/usr/share/nginx/html/uploads" ] || [ ! -w "/usr/share/nginx/html/public" ]; then
    echo "Problème de permissions sur les répertoires uploads ou public"
    exit 1
fi

echo "Le conteneur est en bonne santé"
exit 0
