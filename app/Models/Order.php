<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'booking_id',
        'menu_id',
        'name',
        'price',
        'quantity',
        'subtotal',
        'status',     // ✅ add
        'waiter_id',  // ✅ add
        'items',      // ✅ if storing multiple items as JSON
        'total',      // ✅ total cost
    ];

    protected $casts = [
        'items' => 'array', // decode JSON to array
    ];

    // Link to booking
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    // Link to waiter
    public function waiter()
    {
        return $this->belongsTo(\App\Models\Waiter::class, 'waiter_id');
    }
}
