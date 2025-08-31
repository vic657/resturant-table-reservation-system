<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\WaiterController;
use App\Http\Controllers\Admin\SecurityController;
use App\Http\Controllers\Admin\AccountantController;
use App\Http\Controllers\KitchenManagerController;

// Public routes
Route::post('/book-table', [BookingController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);

// Kitchen Manager routes (separate prefix)
Route::prefix('kitchen-managers')->group(function () {
    Route::post('/', [KitchenManagerController::class, 'store']);   // POST api/kitchen-managers
    Route::get('/', [KitchenManagerController::class, 'index']);   // GET api/kitchen-managers
    Route::get('/{id}', [KitchenManagerController::class, 'show']); // GET api/kitchen-managers/{id}
    Route::delete('/{id}', [KitchenManagerController::class, 'destroy']); // DELETE api/kitchen-managers/{id}
});

// Protected admin routes
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::apiResource('waiters', WaiterController::class);

    Route::get('/securities', [SecurityController::class, 'index']);
    Route::post('/securities', [SecurityController::class, 'store']);
    Route::get('/securities/{id}', [SecurityController::class, 'show']);
    Route::put('/securities/{id}', [SecurityController::class, 'update']);
    Route::delete('/securities/{id}', [SecurityController::class, 'destroy']);

    Route::get('/accountant', [AccountantController::class, 'index']);   
    Route::post('/accountant', [AccountantController::class, 'store']);  
    Route::put('/accountant/{id}', [AccountantController::class, 'update']); 
    Route::delete('/accountant/{id}', [AccountantController::class, 'destroy']);

    Route::get('/menu-items', [MenuItemController::class, 'index']);
    Route::post('/menu-items', [MenuItemController::class, 'store']);
    Route::put('/menu-items/{menuItem}', [MenuItemController::class, 'update']);
    Route::delete('/menu-items/{menuItem}', [MenuItemController::class, 'destroy']);
});
