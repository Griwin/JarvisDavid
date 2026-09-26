# JarvisDavid

JarvisDavid est une application d'apprentissage construite avec un backend Symfony/API Platform et un frontend Angular. Elle a vocation à proposer plusieurs modules assistés par une IA locale : traduction, résumé de texte et traitement de documents.

> État actuel : la traduction et le résumé de texte utilisent le modèle local `qwen3:8b` exécuté par Ollama. Les textes ne quittent pas la machine.

## Architecture locale

| Élément | Technologie | Adresse locale |
| --- | --- | --- |
| Interface | Angular 21 | <http://localhost:4200> |
| API | Symfony 7.4 + API Platform | <http://localhost:8080/api> |
| Documentation API | Swagger UI | <http://localhost:8080/api/docs> |
| Base de données | PostgreSQL 15 | `localhost:5432` |
| Administration BDD | pgAdmin | <http://localhost:5050> |
| Modèle IA local | Ollama + Qwen 3 8B | <http://localhost:11434> |

Docker lance Symfony, Nginx, PostgreSQL, pgAdmin et Ollama. Le serveur Angular se lance séparément sur la machine.

## Prérequis

Avant de commencer, vérifier la présence de :

- Docker Desktop ;
- Node.js 20 ou supérieur ;
- npm ;
- Git.

Commandes de vérification :

```bash
docker --version
docker compose version
node --version
npm --version
git --version
```

## Premier lancement

Toutes les commandes suivantes partent de la racine du dépôt `JarvisDavid`.

### 1. Démarrer le backend et la base de données

```bash
docker compose up -d --build
```

Cette commande construit l'image PHP puis démarre les services en arrière-plan. Vérifier leur état avec :

```bash
docker compose ps
```

Les services `php`, `nginx`, `db`, `pgadmin` et `ollama` doivent être dans l'état `Up`.

### 2. Installer les dépendances PHP

```bash
docker compose exec php composer install
```

Les dépendances sont installées dans `backend/vendor` depuis le conteneur PHP. Il n'est pas nécessaire d'avoir PHP ou Composer installés sur la machine.

### 3. Mettre la base de données à jour

```bash
docker compose exec php php bin/console doctrine:migrations:migrate --no-interaction
```

Cette commande applique les migrations Doctrine qui n'ont pas encore été exécutées.

### 4. Télécharger le modèle IA

Cette commande est nécessaire une seule fois et télécharge environ 5,2 Go dans un volume Docker :

```bash
docker compose exec ollama ollama pull qwen3:8b
```

Vérifier que le modèle est disponible :

```bash
docker compose exec ollama ollama list
```

### 5. Installer les dépendances Angular

Ouvrir un deuxième terminal :

```bash
cd frontend/app
npm install
```

Pour une installation strictement identique au fichier `package-lock.json`, utiliser `npm ci` à la place de `npm install`.

### 6. Lancer Angular

Toujours depuis `frontend/app` :

```bash
npm start
```

Ouvrir ensuite <http://localhost:4200>. Le serveur recharge automatiquement la page après une modification du frontend.

## Lancement quotidien

Après le premier lancement, deux terminaux suffisent.

Terminal 1, depuis la racine de `JarvisDavid` :

```bash
docker compose up -d
```

Terminal 2 :

```bash
cd frontend/app
npm start
```

Il n'est pas nécessaire de relancer `composer install`, `npm install` ou les migrations à chaque fois. Rejouer ces commandes seulement après une modification des dépendances ou l'ajout d'une migration.

## Vérifier que l'application fonctionne

### Vérifier l'API

Ouvrir <http://localhost:8080/api> ou exécuter :

```bash
curl http://localhost:8080/api
```

Une réponse JSON contenant notamment `aiRequest` confirme qu'API Platform répond.

### Tester la traduction IA

```bash
curl -X POST http://localhost:8080/api/translate \
  -H 'Content-Type: application/json' \
  -d '{"text":"Bonjour","sourceLanguage":"fr","targetLanguage":"en","tone":"natural"}'
```

Le backend interroge Ollama, renvoie une traduction comme `Hello` et enregistre la requête réussie dans PostgreSQL. Le premier appel peut prendre plus de temps, car Ollama doit charger le modèle en mémoire.

### Vérifier Angular

Ouvrir <http://localhost:4200/translate>, saisir un texte puis cliquer sur **Traduire**. La page Angular envoie une requête à Symfony sur `http://localhost:8080/api/translate`.

### Tester le résumé de texte

Ouvrir <http://localhost:4200/summarize> ou appeler directement l'API :

```bash
curl -X POST http://localhost:8080/api/summarize \
  -H 'Content-Type: application/json' \
  -d '{"text":"Collez ici un texte comportant au moins cinquante caractères afin que le modèle local puisse en produire une synthèse."}'
```

Le résumé est produit dans la langue du texte source et la requête réussie est enregistrée dans PostgreSQL.

## Commandes utiles

Afficher les journaux Docker :

```bash
docker compose logs -f
```

Afficher uniquement les journaux de Symfony/PHP ou Nginx :

```bash
docker compose logs -f php
docker compose logs -f nginx
docker compose logs -f ollama
```

Afficher les routes Symfony :

```bash
docker compose exec php php bin/console debug:router
```

Vérifier l'état des migrations :

```bash
docker compose exec php php bin/console doctrine:migrations:status
```

Construire le frontend :

```bash
cd frontend/app
npm run build
```

Exécuter les tests frontend :

```bash
cd frontend/app
npm test -- --watch=false
```

## Arrêter l'application

Arrêter les conteneurs sans supprimer les données PostgreSQL :

```bash
docker compose down
```

La commande suivante supprime également les données PostgreSQL et le modèle Ollama téléchargé. Ne l'utiliser que pour réinitialiser volontairement le projet :

```bash
docker compose down -v
```

Arrêter Angular avec `Ctrl+C` dans son terminal.

## Accès à pgAdmin

Ouvrir <http://localhost:5050> puis utiliser les identifiants de développement définis dans `docker-compose.yml` :

- e-mail : `admin@jarvis.com` ;
- mot de passe : `admin`.

Pour enregistrer PostgreSQL dans pgAdmin :

- hôte : `db` ;
- port : `5432` ;
- base : `jarvis` ;
- utilisateur : `jarvis` ;
- mot de passe : `jarvis`.

Ces identifiants sont uniquement destinés au développement local.

## Dépannage

### Un port est déjà utilisé

Si `8080`, `5432` ou `5050` est occupé, Docker indique quel port pose problème. Arrêter le service concurrent ou modifier le port situé à gauche dans `docker-compose.yml`.

### Le frontend ne communique pas avec l'API

Vérifier que :

1. `docker compose ps` indique que `jarvis_nginx` est actif ;
2. <http://localhost:8080/api> répond ;
3. Angular est lancé sur `http://localhost:4200` ;
4. la console du navigateur ne contient pas d'erreur réseau ou CORS.

### Une modification Symfony n'est pas prise en compte

```bash
docker compose exec php php bin/console cache:clear
```

### Repartir d'une base vide

Cette opération détruit les données locales :

```bash
docker compose down -v
docker compose up -d
docker compose exec php php bin/console doctrine:migrations:migrate --no-interaction
docker compose exec ollama ollama pull qwen3:8b
```

## Workflow Codex du projet

- `$add-ai-feature` sert à développer un module IA complet entre Symfony et Angular.
- `$ship-pr` effectue la revue finale, lance les vérifications, prépare les commits et publie une pull request pour validation.

Le skill `add-ai-feature` couvre déjà la suite du module de traduction. Aucun skill supplémentaire n'est nécessaire avant de commencer son implémentation réelle.

## État des vérifications

- Tests backend : 2 tests PHPUnit réussis.
- Tests frontend : 7 tests Angular réussis.
- Build Angular de production : réussi, avec un avertissement non bloquant sur la taille du bundle initial.
- Test réel : traduction français vers anglais réussie avec Ollama et résultat enregistré dans PostgreSQL.
