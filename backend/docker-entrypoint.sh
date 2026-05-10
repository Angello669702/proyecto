#!/bin/bash
set -e

# Generar clave de aplicación si no existe
php artisan key:generate --force

# Esperar a que MySQL esté listo y migrar
echo "Esperando a MySQL..."
until php artisan migrate --force 2>/dev/null; do
  echo "MySQL no disponible todavía, reintentando en 3s..."
  sleep 3
done

# Seed (ignora errores de duplicados)
php artisan db:seed --force || true

# Permisos de storage
chown -R www-data:www-data /var/www/html/storage
chmod -R 775 /var/www/html/storage

# Enlace de storage (ignora si ya existe)
php artisan storage:link || true

# Limpiar y cachear configuración
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Arrancar Apache en primer plano
exec apache2-foreground
