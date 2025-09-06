<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'booking_id', 'menu_id', 'name', 'price', 'quantity', 'subtotal'
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
