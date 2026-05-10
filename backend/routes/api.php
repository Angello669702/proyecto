<?php

use App\Http\Controllers\Api\ActionLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\PriceGroupController;
use App\Http\Controllers\Api\RegistrationRequestController;
use App\Http\Controllers\Api\StripeController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/registrations', [RegistrationRequestController::class, 'store']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'topSelling']);
Route::get('/products/{product}', [ProductController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/auth/user', [AuthController::class, 'me']);

    Route::post('/user', [UserController::class, 'updateProfile']);
    Route::post('/user/password', [UserController::class, 'updatePassword']);

    Route::post('/products/favourite', [ProductController::class, 'favourite']);

    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::get('/transactions/cart', [TransactionController::class, 'myCart']);
    Route::post('/transactions/add', [TransactionController::class, 'addItem']);
    Route::post('/transactions/remove', [TransactionController::class, 'removeItem']);
    Route::post('/transactions/repeat', [TransactionController::class, 'repeat']);

    Route::post('/stripe/checkout', [StripeController::class, 'createCheckoutSession']);

    Route::middleware('admin')->group(function () {

        Route::get('/user/all', [UserController::class, 'all']);

        Route::get('/products/all', [ProductController::class, 'all']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
        Route::put('/products/{product}/stock', [ProductController::class, 'updateStock']);
        Route::put('/products/{product}/toggle', [ProductController::class, 'toggle']);

        Route::post('/transactions/change-status', [TransactionController::class, 'changeStatus']);

        Route::get('/registrations', [RegistrationRequestController::class, 'index']);
        Route::put('/registrations/{registrationRequest}/approve', [RegistrationRequestController::class, 'approve']);
        Route::put('/registrations/{registrationRequest}/reject', [RegistrationRequestController::class, 'reject']);

        Route::get('/price-groups', [PriceGroupController::class, 'index']);
        Route::post('/price-groups', [PriceGroupController::class, 'store']);
        Route::post('/price-groups/{priceGroup}/items', [PriceGroupController::class, 'addItem']);
        Route::delete('/price-groups/{priceGroup}/items/{item}', [PriceGroupController::class, 'removeItem']);
        Route::post('/price-groups/{priceGroup}/assign-user', [PriceGroupController::class, 'assignUser']);
        Route::post('/price-groups/{priceGroup}/remove-user', [PriceGroupController::class, 'removeUser']);

        Route::get('/action-logs', [ActionLogController::class, 'index']);
    });
});

Route::post('/stripe/webhook', [StripeController::class, 'handleWebhook']);
