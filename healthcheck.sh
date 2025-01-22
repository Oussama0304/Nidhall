#!/bin/bash

# Vérifier si Node.js est en cours d'exécution
if ! pgrep node > /dev/null; then
    echo "Node.js n'est pas en cours d'exécution"
    exit 1
fi

# Vérifier la connexion à la base de données
if ! curl -s http://localhost:3000/api/health > /dev/null; then
    echo "Impossible de se connecter à la base de données"
    exit 1
fi

# Vérifier si le serveur écoute sur le port 3000
if ! netstat -an | grep "LISTEN" | grep ":3000 " > /dev/null; then
    echo "Le serveur n'écoute pas sur le port 3000"
    exit 1
fi

# Vérifier les permissions des répertoires
if [ ! -w "/app/uploads" ] || [ ! -w "/app/public" ]; then
    echo "Problème de permissions sur les répertoires uploads ou public"
    exit 1
fi

# Vérifier l'espace disque disponible
DISK_SPACE=$(df -P / | awk 'NR==2 {print $4}')
if [ "$DISK_SPACE" -lt 1048576 ]; then  # Moins de 1GB disponible
    echo "Espace disque insuffisant"
    exit 1
fi

# Vérifier la mémoire disponible
FREE_MEM=$(free -m | awk 'NR==2 {print $4}')
if [ "$FREE_MEM" -lt 100 ]; then  # Moins de 100MB de RAM disponible
    echo "Mémoire insuffisante"
    exit 1
fi

echo "Le conteneur backend est en bonne santé"
exit 0
