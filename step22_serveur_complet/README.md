# Step22 Serveur Complet

## Description
Ce projet est une application web Node.js complète utilisant Express.js et Socket.IO pour créer un serveur avec authentification, chat en temps réel, et gestion de sessions. Il inclut un système de login/logout, des pages protégées, et un chat avec censure automatique des gros mots.

## Technologies Utilisées
- **Node.js** : Environnement d'exécution JavaScript côté serveur.
- **Express.js** : Framework web pour Node.js, utilisé pour les routes, middlewares, et rendu de vues.
- **EJS** : Moteur de template pour générer du HTML dynamique côté serveur.
- **Socket.IO** : Bibliothèque pour la communication en temps réel (WebSockets), utilisée pour le chat.
- **express-session** : Middleware pour gérer les sessions utilisateur.
- **Nodemon** : Outil pour redémarrer automatiquement le serveur lors de changements de code (en développement).

## Installation
1. Clonez le repository :
   ```bash
   git clone https://github.com/camille0601/TP_API.git
   cd TP_API/step22_serveur_complet
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

## Lancement
- **Développement** : `npm run dev` ou `npm start` (utilise Nodemon pour le rechargement automatique).
- **Production** : Déployez sur un serveur (ex. VPS), assurez-vous que le port 8080 est ouvert.

Le serveur démarre sur `http://localhost:8080` (ou l'IP configurée).

## Fonctionnalités Implémentées
### Authentification
- Page de login (`/login`) avec vérification simple (username: "admin", password: "admin").
- Sessions persistantes avec cookies.
- Middleware `requireAdmin` pour protéger certaines routes.
- Logout (`/logout`).

### Pages Web
- **Home** (`/`) : Page d'accueil protégée, affiche un message de bienvenue.
- **About Me** (`/aboutMe`) : Page "À propos" protégée.
- **Chat** (`/chat`) : Page de chat en temps réel, protégée.
- **404** : Page d'erreur pour les routes inexistantes.

### Chat en Temps Réel
- Connexion avec pseudo.
- Envoi de messages.
- Historique des messages conservé en mémoire.
- Censure automatique des gros mots côté serveur (remplacement par des '*').
- Mise en forme des messages (date, pseudo, texte).

### Style et UI
- CSS personnalisé avec tons rose/prune.
- Layout responsive : header, navigation, main, footer.
- Centrage des pages login et chat.

## Choix Techniques
- **Express.js** : Choisi pour sa simplicité et sa communauté, idéal pour les APIs et le rendu de vues.
- **EJS** : Préféré à d'autres moteurs comme Pug pour sa syntaxe proche du HTML, facilitant la maintenance.
- **Socket.IO** : Utilisé pour le chat car il gère automatiquement les fallbacks (polling si WebSockets ne marchent pas), et permet une communication bidirectionnelle fiable.
- **Sessions Express** : Pour la simplicité, sans base de données (stockage en mémoire).
- **Middleware personnalisé** : `requireAdmin` pour réutiliser la logique d'authentification.
- **Structure de dossiers** : `views/` pour les templates, `routes/` pour les routes, `middlewares/` pour les middlewares, `public/` pour les assets statiques, `chat/` pour la logique Socket.IO.
- **Censure côté serveur** : Pour éviter les abus, les messages sont nettoyés avant diffusion, assurant la sécurité sans dépendre du client.

## Ce Qui N'a Pas Été Implémenté
- **Base de données** : Pas d'ORM ou de stockage persistant (messages du chat sont en mémoire, perdus au redémarrage).
- **Authentification externe** : Pas de connexion Google/Facebook.
- **Tests** : Pas de tests unitaires ou d'intégration.
- **Sécurité avancée** : Pas de rate limiting, CSRF protection, etc.

## Architecture
- `app.js` : Point d'entrée, configuration Express, routes, et lancement du serveur.
- `routes/auth.routes.js` : Gestion des routes d'authentification.
- `middlewares/requireAdmin.js` : Middleware pour vérifier l'authentification.
- `chat/chat.server.js` : Logique Socket.IO pour le chat.
- `views/` : Templates EJS avec layout partagé.
- `public/` : CSS, JS client pour le chat.

## Déploiement
- **Local** : `npm start` après installation.
- **Production** : Pousser sur GitHub, déployer via CI/CD (ex. GitHub Actions) sur un VPS. Renommez `tmpl` en `views` si nécessaire.

## Concepts Clés Expliqués
### API REST vs RESTful
- **API REST** : Acronyme pour Representational State Transfer. C'est un style architectural pour concevoir des APIs web. Une API est "REST" si elle suit les principes de REST.
- **RESTful** : Terme souvent utilisé de manière interchangeable avec REST. Une API RESTful respecte pleinement les contraintes de REST (stateless, cacheable, etc.).
- **Différence** : REST est le concept théorique ; RESTful décrit une implémentation qui adhère à ces principes. Toutes les APIs RESTful sont REST, mais pas l'inverse.

### Les 3 Principes d'une API REST
1. **Stateless** : Chaque requête contient toutes les informations nécessaires. Le serveur ne stocke pas d'état entre les requêtes (contrairement aux sessions).
2. **Client-Server** : Séparation claire entre client (UI) et serveur (logique métier). Le client gère l'interface, le serveur les données.
3. **Cacheable** : Les réponses peuvent être mises en cache pour améliorer les performances.

(Autres principes incluent Uniform Interface, Layered System, Code on Demand.)

### Comment Marchent les WebSockets
- **Définition** : Protocole de communication bidirectionnelle en temps réel sur une connexion TCP unique.
- **Fonctionnement** :
  1. **Handshake** : Commence par une requête HTTP (upgrade) pour passer à WebSocket.
  2. **Connexion persistante** : Une fois établie, la connexion reste ouverte.
  3. **Échange bidirectionnel** : Client et serveur peuvent envoyer des messages à tout moment sans nouvelle requête.
  4. **Avantages** : Faible latence, idéal pour chat, jeux, notifications en temps réel.
  5. **Inconvénients** : Consomme plus de ressources que HTTP polling.
- **Dans ce projet** : Socket.IO utilise WebSockets (avec fallback à polling) pour le chat, permettant des messages instantanés.

### Déploiement Continu
- **Définition** : Processus automatisé de déploiement du code en production après chaque push (via Git).
- **Dans ce projet** : Utilisation de GitHub pour le versioning, PM2 pour gérer le processus Node.js en prod, et redémarrage automatique via hooks ou scripts.

## Questions Fréquentes
- **Pourquoi EJS ?** Syntaxe simple, intégration facile avec Express.
- **Pourquoi pas une BDD ?** Pour la simplicité du TP, mais en prod, ajouter MongoDB ou PostgreSQL.
- **Chat sécurisé ?** Censure basique, mais ajouter validation côté client/serveur pour plus de robustesse.
- **Performance ?** Pour petit scale, ok ; pour plus, ajouter clustering ou Redis pour sessions/chat.

Contact : camille@example.com