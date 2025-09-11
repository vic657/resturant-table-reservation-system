<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn() => response()->json(['status' => 'ok']));

// Catch-all route (for React build)
Route::get('/{any}', function () {
    return File::get(public_path('index.html'));
})->where('any', '.*');
