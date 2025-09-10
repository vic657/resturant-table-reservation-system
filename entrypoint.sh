#!/bin/bash

echo "Running Laravel setup..."

php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Starting Apache..."
exec apache2-foreground
