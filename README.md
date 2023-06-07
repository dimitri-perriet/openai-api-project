README
======

Ce projet est en cours. 
Le project utilise React pour la partie front et Node.js par la partie back. 

Introduction
------------

Cette application utilise OpenAI pour créer des conversations avec des personnages de jeux vidéos. Elle permet aux utilisateurs d'enregistrer des jeux vidéos, des personnages liés à ces jeux et de s'identifier pour ouvrir une conversation avec un personnage. Le système envoie automatiquement une réponse en imitant le personnage.


Fonctionnalités
---------------

1.  Enregistrer un jeu vidéo
2.  Enregistrer un personnage lié à un jeu vidéo
3.  Le système demande automatiquement à OpenAI des détails sur le personnage
4.  Enregistrer un utilisateur du système
5.  Identification de l'utilisateur
6.  Ouverture d'une conversation par un utilisateur avec un personnage
7.  Envoi d'un message dans une conversation par un utilisateur
8.  Le système envoie automatiquement une réponse en imitant le personnage
9.  Lorsqu'un nouveau message est envoyé dans une conversation, l'ensemble de l'historique est envoyé à OpenAI

Lancement de l'API 
-----------

1. Il suffit de faire un `npm install` à la racine du projet
2. Créer en suite un fichier `.env` dans le dossier config en y indiquant :  
DB_PORT="PORT"  
DB_USER="USER"  
DB_PWD="PASSWORD"  
DB_NAME="NOM DE LA BASE"  
OPENAI_KEY="CLE OPENAPI"  
SECRET_JWT="SECRET JWT"

3. Lancer l'API en tapant `node app.js` depuis la racine

Utilisation
-----------

Pour utiliser cette application, vous devez d'abord enregistrer un jeu vidéo, un personnage lié à ce jeu et un utilisateur. Ensuite, vous pouvez vous identifier et ouvrir une conversation avec un personnage en envoyant un message. Le système enverra automatiquement une réponse en imitant le personnage. Chaque fois qu'un nouveau message est envoyé dans une conversation, l'historique complet est envoyé à OpenAI.
