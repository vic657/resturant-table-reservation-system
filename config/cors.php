<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost',
        'https://localhost', 
        'capacitor://localhost',
        'ionic://localhost',
        'https://resturant-reserve.netlify.app',
        'https://resturant-table-reservation-system-production.up.railway.app',
        'https://resturant-table-reservation-system-1.onrender.com',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
