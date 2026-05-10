<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $uuid = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

        Route::pattern('product', $uuid);
        Route::pattern('user', $uuid);
        Route::pattern('priceGroup', $uuid);
        Route::pattern('transaction', $uuid);
        Route::pattern('registrationRequest', $uuid);
        Route::pattern('item', $uuid);
    }
}
