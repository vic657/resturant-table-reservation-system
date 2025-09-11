#!/bin/bash
set -e

echo "Starting Laravel container..."

# Wait for MySQL (Railway)
echo "⏳ Waiting for MySQL at $DB_HOST:$DB_PORT..."
for i in {1..60}; do
  if mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USERNAME" -p"$DB_PASSWORD" -e "SELECT 1;" &> /dev/null; then
    echo "✅ MySQL is up!"
    break
  fi
  echo "MySQL not ready, retrying in 2s... ($i/60)"
  sleep 2
done

# Clear caches and migrate only once (skip if tables exist)
php artisan config:clear
php artisan cache:clear
php artisan migrate --force || echo "⚠️ Migration step skipped (tables may already exist)"

# Start Apache on Render's port
echo "🚀 Starting Apache on port 10000..."
exec apache2-foreground -DFOREGROUND -k start -e info -f /etc/apache2/apache2.conf -C "Listen 10000"
