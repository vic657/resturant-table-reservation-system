#!/bin/bash
set -e

# Wait for MySQL to be ready
host="${DB_HOST:-mysql}"
port="${DB_PORT:-3306}"
echo "Waiting for MySQL at $host:$port..."
until mysql --host="$host" --port="$port" --user="$DB_USERNAME" --password="$DB_PASSWORD" -e "SELECT 1;" &> /dev/null; do
  echo "MySQL not ready, retrying in 2s..."
  sleep 2
done
echo "MySQL is up!"

# Run migrations and seeders
php artisan migrate --force
php artisan db:seed --force

# Cache Laravel config/routes/views
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start Apache in foreground
exec apache2-foreground
