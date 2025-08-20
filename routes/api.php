<?php
use App\Http\Controllers\BookingController;

Route::post('/book-table', [BookingController::class, 'store']);
