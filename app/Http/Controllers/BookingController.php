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
            'time'     => 'required',
            'tables'   => 'required|array|min:1',
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
            'time'         => $request->time,
            'tables'       => json_encode($request->tables),
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

    return response()->json([
        'booking' => [
            'id'           => $booking->id,
            'name'         => $booking->name,
            'email'        => $booking->email ?? null, // add email column if exists
            'phone'        => $booking->phone,
            'tables'       => json_decode($booking->tables, true),
            'date'         => $booking->date,
            'time'         => $booking->time,
            'receipt_code' => $booking->receipt_code,
            'total'        => $booking->total,
        ],
        'orders' => $booking->orders->map(function($order) {
            return [
                'id'       => $order->id,
                'name'     => $order->name,
                'price'    => $order->price,
                'quantity' => $order->quantity,
                'subtotal' => $order->subtotal,
            ];
        }),
    ]);
}

    // ✅ Check booked tables for a given date (ignore time)
public function bookedTables(Request $request)
{
    $request->validate([
        'date' => 'required|date',
    ]);

    $bookings = Booking::where('date', $request->date)
        ->pluck('tables'); // JSON array

    $bookedTables = [];
    foreach ($bookings as $tablesJson) {
        $tables = json_decode($tablesJson, true);
        if (is_array($tables)) {
            $bookedTables = array_merge($bookedTables, $tables);
        }
    }

    return response()->json($bookedTables);
}

}
