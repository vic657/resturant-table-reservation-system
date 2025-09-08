<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Waiter extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'shift',
        'password',
    ];

    protected $hidden = [
        'password',
    ];

    // Relationship: Waiter has many orders
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
