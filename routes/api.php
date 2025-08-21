<?php
use App\Http\Controllers\BookingController;
use App\Http\Controllers\AuthController;

Route::post('/book-table', [BookingController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);
