<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Security extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'email', 'phone', 'shift', 'password'
    ];

    protected $hidden = [
        'password'
    ];
}
