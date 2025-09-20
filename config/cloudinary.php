<?php

/*
 * This file is part of the Laravel Cloudinary package.
 */

return [

    /*
    |--------------------------------------------------------------------------
    | Cloudinary Upload Notification (optional)
    |--------------------------------------------------------------------------
    | If you want Cloudinary to notify your app after uploads/deletes, set
    | a webhook URL in your .env:
    | CLOUDINARY_NOTIFICATION_URL=https://your-app.com/webhook/cloudinary
    */
    'notification_url' => env('CLOUDINARY_NOTIFICATION_URL'),

    /*
    |--------------------------------------------------------------------------
    | Cloudinary Connection
    |--------------------------------------------------------------------------
    | This is the main connection string for Cloudinary.
    | Format:
    | cloudinary://API_KEY:API_SECRET@CLOUD_NAME
    |
    | Example:
    | CLOUDINARY_URL=cloudinary://1234567890:abcdefg@mycloud
    */
    'cloud_url' => env('CLOUDINARY_URL'),

    /*
    |--------------------------------------------------------------------------
    | Optional: Upload Preset (if using unsigned uploads from frontend)
    |--------------------------------------------------------------------------
    */
    'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET'),

    /*
    |--------------------------------------------------------------------------
    | Optional: Blade Upload Widget (not required for API usage)
    |--------------------------------------------------------------------------
    */
    'upload_route' => env('CLOUDINARY_UPLOAD_ROUTE'),
    'upload_action' => env('CLOUDINARY_UPLOAD_ACTION'),
];
