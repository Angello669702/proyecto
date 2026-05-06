<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\RegistrationRequestController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/auth/user', [AuthController::class, 'me'])->middleware('auth:sanctum');;

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'topSelling']);
Route::get('/products/{product}', [ProductController::class, 'show']);

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    Route::put('/products/{product}/stock', [ProductController::class, 'updateStock']);
    Route::put('/products/{product}/toggle', [ProductController::class, 'toggle']);
});

Route::get('/categories', [CategoryController::class, 'index']);

Route::post('/registrations', [RegistrationRequestController::class, 'store']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/user', [UserController::class, 'updateProfile']);
    Route::post('/user/password', [UserController::class, 'updatePassword']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/registrations', [RegistrationRequestController::class, 'index']);
    Route::put('/registrations/{registrationRequest}/approve', [RegistrationRequestController::class, 'approve']);
    Route::put('/registrations/{registrationRequest}/reject', [RegistrationRequestController::class, 'reject']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::get('/my-transactions', [TransactionController::class, 'myTransactions']);
    Route::get('/transactions/cart', [TransactionController::class, 'myCart']);
    Route::post('/transactions/add', [TransactionController::class, 'addItem']);
    Route::post('/transactions/remove', [TransactionController::class, 'removeItem']);


    Route::get('/transactions/{transaction}', [TransactionController::class, 'show']);
    Route::patch('/transactions/{transaction}/status', [TransactionController::class, 'updateStatus']);
    Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy']);
});
