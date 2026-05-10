#!/bin/bash

php artisan key:generate --force
php artisan migrate --force
php artisan storage:link --force
php artisan config:cache
php artisan route:cache

apache2-foreground
