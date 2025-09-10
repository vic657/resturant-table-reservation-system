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
use App\Http\Middleware\Cors;

// ==========================
// Public routes
// ==========================
Route::post('/login', [AuthController::class, 'login']);

// Bookings
Route::post('/book-table', [BookingController::class, 'store']);   // create booking
Route::post('/bookings', [BookingController::class, 'store']);     // alias for booking
Route::get('/bookings/receipt/{code}', [BookingController::class, 'findByReceipt']);
Route::post('/booked-tables', [BookingController::class, 'bookedTables']); // check booked tables

// Public Menus
Route::get('/menu-show', [MenuShowController::class, 'index']);
Route::get('/public-menus', [MenuController::class, 'publicIndex']);

// ==========================
// Kitchen Manager routes
// ==========================
Route::prefix('kitchen-managers')->group(function () {
    Route::post('/', [KitchenManagerController::class, 'store']);
    Route::get('/', [KitchenManagerController::class, 'index']);
    Route::get('/{id}', [KitchenManagerController::class, 'show']);
    Route::delete('/{id}', [KitchenManagerController::class, 'destroy']);

    // Orders under kitchen manager
    Route::get('/orders', [KitchenManagerController::class, 'getOrders']);
    Route::post('/orders/{orderId}/assign-waiter', [KitchenManagerController::class, 'assignWaiter']);
    Route::put('/orders/{orderId}/served', [KitchenManagerController::class, 'markOrderServed']);
    Route::get('/bookings', [KitchenManagerController::class, 'getBookings']);
});

// Alias routes for easier frontend use
Route::get('/orders', [KitchenManagerController::class, 'getOrders']);
Route::post('/orders/{orderId}/assign-waiter', [KitchenManagerController::class, 'assignWaiter']);
Route::put('/orders/{orderId}/served', [KitchenManagerController::class, 'markOrderServed']);
Route::get('/bookings', [KitchenManagerController::class, 'getBookings']);

// ==========================
// Waiter routes (public/auth-protected as needed)
// ==========================
Route::get('/waiters', [WaiterController::class, 'index']); // list all waiters
Route::get('/waiters/{waiter}/orders', [WaiterController::class, 'getOrders']); // fetch specific waiter's orders

// ==========================
// Menu routes (protected)
// ==========================
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/menus', [MenuController::class, 'index']);
    Route::post('/menus', [MenuController::class, 'store']);
    Route::put('/menus/{menu}', [MenuController::class, 'update']);
    Route::delete('/menus/{menu}', [MenuController::class, 'destroy']);
});

// ==========================
// Admin routes (protected)
// ==========================
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    // Waiters CRUD
    Route::apiResource('waiters', WaiterController::class);
    Route::post('/orders/{order}/served', [KitchenManagerController::class, 'markOrderServed']);


    // Securities
    Route::get('/securities', [SecurityController::class, 'index']);
    Route::post('/securities', [SecurityController::class, 'store']);
    Route::get('/securities/{id}', [SecurityController::class, 'show']);
    Route::put('/securities/{id}', [SecurityController::class, 'update']);
    Route::delete('/securities/{id}', [SecurityController::class, 'destroy']);

    // Accountant
    Route::get('/accountant', [AccountantController::class, 'index']);   
    Route::post('/accountant', [AccountantController::class, 'store']);  
    Route::put('/accountant/{id}', [AccountantController::class, 'update']); 
    Route::delete('/accountant/{id}', [AccountantController::class, 'destroy']);
});
