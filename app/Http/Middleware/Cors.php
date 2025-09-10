<?php

namespace App\Http\Middleware;

use Closure;

class Cors
{
    public function handle($request, Closure $next)
    {
        $allowedOrigins = [
            'https://resturant-reserve.netlify.app',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
        ];

        $origin = $request->headers->get('Origin');

        $headers = [
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With',
            'Access-Control-Allow-Credentials' => 'true',
        ];

        if (in_array($origin, $allowedOrigins)) {
            $headers['Access-Control-Allow-Origin'] = $origin;
        }

        if ($request->getMethod() === "OPTIONS") {
            return response()->json('OK', 200, $headers);
        }

        $response = $next($request);

        foreach ($headers as $key => $value) {
            $response->headers->set($key, $value);
        }

        return $response;
    }
}
