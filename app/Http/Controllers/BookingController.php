<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Order;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'name'     => 'required|string|max:255',
        'phone'    => 'required|string|max:20',
        'guests'   => 'required|integer|min:1',
        'date'     => 'required|date',
        'time'     => 'required', // ✅ add this
         'tables'  => 'required|array|min:1', // ✅ Add this for tables
        'orders'   => 'required|array|min:1',
        'orders.*.menu_id'  => 'required|exists:menus,id',
        'orders.*.name'     => 'required|string',
        'orders.*.price'    => 'required|numeric',
        'orders.*.quantity' => 'required|integer|min:1',
    ]);

    $receiptCode = 'RCPT-' . strtoupper(Str::random(6));

    $booking = Booking::create([
        'name'         => $request->name,
        'phone'        => $request->phone,
        'guests'       => $request->guests,
        'date'         => $request->date,
        'time'         => $request->time, // ✅ save time
        'tables'       => json_encode($request->tables), // ✅ Save selected tables
        'receipt_code' => $receiptCode,
        'total'        => collect($request->orders)->sum(fn($o) => $o['price'] * $o['quantity']),
    ]);

    foreach ($request->orders as $order) {
        Order::create([
            'booking_id' => $booking->id,
            'menu_id'    => $order['menu_id'],
            'name'       => $order['name'],
            'price'      => $order['price'],
            'quantity'   => $order['quantity'],
            'subtotal'   => $order['price'] * $order['quantity'],
        ]);
    }

    return response()->json([
        'message'      => 'Booking and order placed successfully!',
        'receipt_code' => $receiptCode,
        'booking_id'   => $booking->id,
    ], 201);
}


    // ✅ For waiter lookup
    public function findByReceipt($code)
    {
        $booking = Booking::with('orders')->where('receipt_code', $code)->first();

        if (!$booking) {
            return response()->json(['message' => 'Invalid receipt code'], 404);
        }

        return response()->json($booking);
    }
    // Get booked tables for a specific date and time
public function bookedTables(Request $request)
{
    $request->validate([
        'date' => 'required|date',
        'time' => 'required',
    ]);

    $bookings = Booking::where('date', $request->date)
        ->where('time', $request->time)
        ->pluck('tables'); // tables is JSON array

    // Flatten JSON arrays
    $bookedTables = [];
    foreach ($bookings as $tablesJson) {
        $tables = json_decode($tablesJson, true);
        if (is_array($tables)) {
            $bookedTables = array_merge($bookedTables, $tables);
        }
    }

    return response()->json($bookedTables); // frontend expects array of strings like ["indoor-1","outdoor-3"]
}

public function getBookedTables(Request $request)
{
    $request->validate([
        'date' => 'required|date',
        'time' => 'required',
    ]);

    $bookings = \DB::table('bookings')
        ->where('date', $request->date)
        ->where('time', $request->time)
        ->pluck('table_number'); // assuming table_number stores single table like 'indoor-1'

    return response()->json($bookings);
}

}


