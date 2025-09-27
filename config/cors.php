<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    'allowed_origins' => [
        

        //  Production web frontend
        'https://resturant-reserve.netlify.app',
        'https://resturant-table-reservation-system-1.onrender.com',

        //  Mobile apps (Capacitor / Ionic)
        'capacitor://localhost',
        'ionic://localhost',
        'https://localhost',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => [
        'Content-Type',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Authorization',
        'X-CSRF-TOKEN',
    ],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
