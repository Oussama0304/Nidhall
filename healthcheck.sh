#!/bin/bash

# Vérifier si Node.js est en cours d'exécution
if ! pgrep node > /dev/null; then
    echo "Node.js n'est pas en cours d'exécution"
    exit 1
fi

# Vérifier si le serveur écoute sur le port 3000
if ! netstat -tln | grep -q ':3000\b'; then
    echo "Le serveur n'écoute pas sur le port 3000"
    exit 1
fi

# Vérifier l'accès HTTP à l'API
if ! curl -f -s -m 5 http://localhost:3000/api/health > /dev/null; then
    echo "Impossible d'accéder à l'API"
    exit 1
fi

# Vérifier les permissions des répertoires
for dir in /app/uploads /app/public; do
    if [ ! -d "$dir" ]; then
        echo "Le répertoire $dir n'existe pas"
        exit 1
    fi
    if [ ! -w "$dir" ]; then
        echo "Le répertoire $dir n'est pas accessible en écriture"
        exit 1
    fi
done

# Vérifier l'espace disque disponible (minimum 1GB)
available_space=$(df -P /app | awk 'NR==2 {print $4}')
if [ "$available_space" -lt 1048576 ]; then  # 1GB en KB
    echo "Espace disque insuffisant"
    exit 1
fi

# Vérifier la mémoire disponible (minimum 100MB)
free_memory=$(free -m | awk 'NR==2 {print $4}')
if [ "$free_memory" -lt 100 ]; then
    echo "Mémoire disponible insuffisante"
    exit 1
fi

# Si tout est OK
echo "Backend en bonne santé"
exit 0
