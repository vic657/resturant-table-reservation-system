<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use ImageKit\ImageKit;

class ImageKitServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ImageKit::class, function ($app) {
            return new ImageKit(
                config('imagekit.public_key'),
                config('imagekit.private_key'),
                config('imagekit.url_endpoint')
            );
        });
    }

    public function boot(): void
    {
        //
    }
}
