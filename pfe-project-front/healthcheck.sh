#!/bin/bash

# Vérifier si nginx est en cours d'exécution
if ! pgrep nginx > /dev/null; then
    echo "Nginx n'est pas en cours d'exécution"
    exit 1
fi

# Vérifier si le fichier index.html existe
if [ ! -f /usr/share/nginx/html/index.html ]; then
    echo "index.html n'existe pas"
    exit 1
fi

# Vérifier si nginx écoute sur le port 80
if ! netstat -tln | grep -q ':80\b'; then
    echo "Nginx n'écoute pas sur le port 80"
    exit 1
fi

# Vérifier l'accès HTTP
if ! curl -f -s -m 5 http://localhost:80 > /dev/null; then
    echo "Impossible d'accéder à l'application via HTTP"
    exit 1
fi

# Vérifier les permissions des répertoires
if [ ! -r /usr/share/nginx/html ] || [ ! -x /usr/share/nginx/html ]; then
    echo "Permissions incorrectes sur /usr/share/nginx/html"
    exit 1
fi

# Si tout est OK
echo "Frontend en bonne santé"
exit 0
