# PHP-FPM pour Symfony
FROM php:8.3-fpm

# Dépendances système + extensions PHP utiles pour Symfony/PostgreSQL
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    curl \
    libpq-dev \
    libzip-dev \
 && docker-php-ext-install pdo pdo_pgsql zip \
 && rm -rf /var/lib/apt/lists/*

# Installation de Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Dossier de travail
WORKDIR /var/www/backend

# Autorise Composer en root dans le conteneur
ENV COMPOSER_ALLOW_SUPERUSER=1