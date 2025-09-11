#!/bin/bash

# Optional: Wait for MySQL
# Uncomment if your MySQL instance is ready immediately and SSL is not required
# host="${DB_HOST:-mysql}"
# port="${DB_PORT:-3306}"
# echo "Waiting for MySQL at $host:$port..."
# until mysql -h "$host" -P "$port" -u "$DB_USERNAME" -p"$DB_PASSWORD" -e "SELECT 1;" &> /dev/null; do
#   echo "MySQL not ready, retrying in 2s..."
#   sleep 2
# done
# echo "MySQL is up!"

# Run migrations and seeders
php artisan migrate --force
php artisan db:seed --force

# Cache Laravel config/routes/views
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start Apache in foreground
apache2-foreground
