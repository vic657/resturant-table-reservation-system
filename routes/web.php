<?php
use Illuminate\Support\Facades\{DB, File, Route};

Route::get('/health', function () {
    try {
        DB::select('SELECT 1');
        return response()->json(['status' => 'ok'], 200, ['Cache-Control' => 'no-store']);
    } catch (\Throwable $e) {
        return response()->json(['status' => 'unavailable'], 503, ['Cache-Control' => 'no-store']);
    }
})->middleware('throttle:30,1');

// Unknown API endpoints should return JSON instead of the React shell.
Route::any('/api/{path?}', fn () => response()->json(['message' => 'Not found.'], 404))->where('path', '.*');
Route::get('/{any}', fn () => response(File::get(public_path('index.html')))->header('Cache-Control', 'no-cache'))
    ->where('any', '.*');