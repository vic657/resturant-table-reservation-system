#!/bin/bash
set -e
APP_PORT="${PORT:-10000}"
sed -i "s/Listen 80/Listen ${APP_PORT}/" /etc/apache2/ports.conf
sed -i "s/:80>/:${APP_PORT}>/" /etc/apache2/sites-available/000-default.conf
php artisan config:cache
php artisan route:cache
php artisan view:cache
# Explicitly opt in to migrations on deploy. Do not change the remote DB on every restart.
if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
    php artisan migrate --force
fi
exec apache2-foreground
