<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{AuthController, KitchenManagerController, MenuController, MenuShowController, BookingController};
use App\Http\Controllers\Admin\{WaiterController, SecurityController, AccountantController};

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::middleware('throttle:30,1')->group(function () {
    Route::post('/book-table', [BookingController::class, 'store']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/receipt/{code}', [BookingController::class, 'findByReceipt']);
    Route::post('/booked-tables', [BookingController::class, 'bookedTables']);
});
Route::get('/menu-show', [MenuShowController::class, 'index']);
Route::get('/public-menus', [MenuController::class, 'publicIndex']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::middleware('role:admin,kitchen_manager')->group(function () {
        Route::apiResource('menus', MenuController::class)->except('show');
        Route::get('/waiters', [WaiterController::class, 'index']);
        foreach (['', '/kitchen-managers'] as $prefix) {
            Route::get($prefix.'/orders', [KitchenManagerController::class, 'getOrders']);
            Route::post($prefix.'/orders/{orderId}/assign-waiter', [KitchenManagerController::class, 'assignWaiter']);
            Route::get($prefix.'/bookings', [KitchenManagerController::class, 'getBookings']);
        }
    });
    Route::middleware('role:admin,kitchen_manager,waiter')->group(function () {
        Route::get('/waiters/{waiter}/orders', [WaiterController::class, 'getOrders']);
        Route::put('/orders/{orderId}/served', [KitchenManagerController::class, 'markOrderServed']);
        Route::put('/kitchen-managers/orders/{orderId}/served', [KitchenManagerController::class, 'markOrderServed']);
    });
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('kitchen-managers', KitchenManagerController::class)->except('update');
        Route::prefix('admin')->group(function () {
            Route::apiResource('waiters', WaiterController::class);
            Route::apiResource('securities', SecurityController::class);
            Route::apiResource('accountant', AccountantController::class)->except('show');
            Route::post('/orders/{orderId}/served', [KitchenManagerController::class, 'markOrderServed']);
        });
    });
});