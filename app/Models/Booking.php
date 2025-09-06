<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'guests',
        'date',
        'time',
        'total',
        'receipt_code',
        'tables', // ✅ add this
    ];

    // If you want Laravel to automatically cast JSON to array:
    protected $casts = [
        'tables' => 'array',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
