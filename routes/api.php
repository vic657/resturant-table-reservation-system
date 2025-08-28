<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\WaiterController;

// Public routes
Route::post('/book-table', [BookingController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);

// Protected admin routes
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::apiResource('waiters', WaiterController::class);
});
