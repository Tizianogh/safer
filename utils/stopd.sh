#!/bin/bash

# Check if there are any containers
if [ "$(docker ps -aq)" ]; then
    # Supprimer tous les containers en cours d'exécution
    docker rm -f $(docker ps -aq)
fi

# Supprimer tous les containers
docker container prune -f

# Supprimer toutes les images
docker image prune -af

# Supprimer tous les volumes
docker volume prune -f

# Supprimer tous les réseaux
docker network prune -f

docker system prune -f

# Afficher un message de confirmation
echo "Tous les containers, images, volumes et réseaux ont été supprimés avec succès."
