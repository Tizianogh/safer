<p align="center"><img width=25% src="safer-webapp/src/assets/logo-withoutbg.png"></p>
<p align="center">
    <img src="https://img.shields.io/badge/Angular-15.2.2-fdff00?style=for-the-badge&logo=Angular">&nbsp;
    <img src="https://img.shields.io/badge/Node-18.15.0-fdff00?style=for-the-badge&logo=Node">
    <img src="https://img.shields.io/badge/Flask-2.2.3-fdff00?style=for-the-badge&logo=Flask">
    <img src="https://img.shields.io/badge/Mango-6.0.5-fdff00?style=for-the-badge&logo=Mongodb">
    <img src="https://img.shields.io/badge/Nginx-1.23.3-fdff00?style=for-the-badge&logo=Nginx">
    <img src="https://img.shields.io/badge/Docker-23.0.1-fdff00?style=for-the-badge&logo=Docker">
</p>

<p align="center"><b>Safer, c'est l'application qui vous accompagne pour préparer au mieux votre trajet sécurisé ! Avec Safer, prévoyer et voyager en toute sécurité.</b></p>

## ⚡️ Quick start

## Prémices

Pour pouvoir utiliser ce projet, munisez vous de [docker et plus précisement de docker compose](https://docs.docker.com/compose/)

Pour pouvoir utiliser ce projet, munisez vous d'une clef [openrouteservice](https://openrouteservice.org/), déposez la dans le fichier .env du service safer-ml.

## 🛠️ Configuration des retours à la ligne

Pour éviter les problèmes liés aux différences de retours à la ligne entre les systèmes d'exploitation, veuillez configurer votre environnement Git comme suit :

- Utilisateurs Windows : exécutez `git config --global core.autocrlf true` dans votre terminal Git.
- Utilisateurs Unix/Linux/macOS : exécutez `git config --global core.autocrlf input` dans votre terminal Git.

Si cela ne fonctionne pas, je vous invite à vous renseigner sur la conversion des sauts de ligne pour Windows sur Internet.

### ✅ Premier lancement

Suivez les instructions ci-dessous pour mettre en place l'environnement adéquat au bon lancement du projet :

```sh
mkdir safer && cd safer
git clone https://gitlab.com/Tizianogh/safer.git
```

Une fois que le projet est clone, à la racine du projet :

```sh
docker compose up -d
```

Lorsque vous avez terminé votre voyage, pour quitter proprement l'application :

```sh
docker compose down
```
