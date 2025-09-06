<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\WaiterController;
use App\Http\Controllers\Admin\SecurityController;
use App\Http\Controllers\Admin\AccountantController;
use App\Http\Controllers\KitchenManagerController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\MenuShowController;
use App\Http\Controllers\BookingController;

// ==========================
// Public routes
// ==========================
Route::post('/book-table', [BookingController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/menu-show', [MenuShowController::class, 'index']);
Route::post('/bookings', [BookingController::class, 'store']);
Route::post('/book-table', [BookingController::class, 'store']);
Route::get('/booked-tables', [BookingController::class, 'bookedTables']);
Route::get('/bookings/booked-tables', [BookingController::class, 'bookedTables']);
Route::get('/bookings/receipt/{code}', [BookingController::class, 'findByReceipt']);

// NEW: Public menus route
Route::get('/public-menus', [MenuController::class, 'publicIndex']);


// ==========================
// Kitchen Manager routes
// ==========================
Route::prefix('kitchen-managers')->group(function () {
    Route::post('/', [KitchenManagerController::class, 'store']);   // POST api/kitchen-managers
    Route::get('/', [KitchenManagerController::class, 'index']);   // GET api/kitchen-managers
    Route::get('/{id}', [KitchenManagerController::class, 'show']); // GET api/kitchen-managers/{id}
    Route::delete('/{id}', [KitchenManagerController::class, 'destroy']); // DELETE api/kitchen-managers/{id}
});

// ==========================
// Menu routes (for Kitchen Manager)
// ==========================
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/menus', [MenuController::class, 'index']);
    Route::post('/menus', [MenuController::class, 'store']);
    Route::put('/menus/{menu}', [MenuController::class, 'update']);
    Route::delete('/menus/{menu}', [MenuController::class, 'destroy']);
});

// ==========================
// Admin routes
// ==========================
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
});
