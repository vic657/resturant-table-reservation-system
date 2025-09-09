<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Laravel CORS Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout'],

    'allowed_methods' => ['*'],

   'allowed_origins' => [
    'http://localhost:5173',         // local React dev
    'http://127.0.0.1:5173',         // Vite sometimes uses 127
    'https://resturant-reserve.netlify.app', // production frontend
],


    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Important if using Sanctum / withCredentials
    'supports_credentials' => true,

];
