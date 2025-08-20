<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'tables' => 'required|array',
            'area' => 'required|string|in:indoor,outdoor',
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
        ]);

        $booking = Booking::create([
            'tables' => json_encode($request->tables),
            'area' => $request->area,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking confirmed!',
            'data' => $booking
        ]);
    }
}
