#!/bin/bash
# wait-for-mysql.sh

host="${DB_HOST:-mysql}"
port="${DB_PORT:-3306}"

echo "Waiting for MySQL at $host:$port..."
while ! mysql -h "$host" -P "$port" -u "$DB_USERNAME" -p"$DB_PASSWORD" -e "SELECT 1;" &> /dev/null; do
  sleep 2
done
echo "MySQL is up!"

# Then run Laravel setup
php artisan config:clear
php artisan cache:clear
php artisan db:seed --force   # ✅ run seeders in production too

# Start Apache
apache2-foreground
