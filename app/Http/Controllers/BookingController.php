<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Order;
use App\Models\Menu;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

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
            'orders.*.quantity' => 'required|integer|min:1',
        ]);

        // Generate safer receipt code
        $receiptCode = 'RCPT-' . strtoupper(Str::random(12));

        DB::beginTransaction();
        try {
            // Create booking with total = 0 first
            $booking = Booking::create([
                'name'         => $request->name,
                'phone'        => $request->phone,
                'guests'       => $request->guests,
                'date'         => $request->date,
                'time'         => $request->time,
                'tables'       => json_encode($request->tables),
                'receipt_code' => $receiptCode,
                'total'        => 0,
            ]);

            $total = 0;

            foreach ($request->orders as $orderInput) {
                // ✅ Fetch real price from DB
                $menu = Menu::findOrFail($orderInput['menu_id']);

                $price = $menu->price;
                $quantity = $orderInput['quantity'];
                $subtotal = $price * $quantity;

                Order::create([
                    'booking_id' => $booking->id,
                    'menu_id'    => $menu->id,
                    'name'       => $menu->name,
                    'price'      => $price,
                    'quantity'   => $quantity,
                    'subtotal'   => $subtotal,
                ]);

                $total += $subtotal;
            }

            // ✅ Update booking total securely
            $booking->update(['total' => $total]);

            DB::commit();

            return response()->json([
                'message'      => 'Booking and order placed successfully!',
                'receipt_code' => $receiptCode,
                'booking_id'   => $booking->id,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Booking failed',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

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
                'phone'        => $booking->phone,
                'tables'       => json_decode($booking->tables, true),
                'date'         => $booking->date,
                'time'         => $booking->time,
                'receipt_code' => $booking->receipt_code,
                'total'        => $booking->total,
            ],
            'orders' => $booking->orders->map(fn($order) => [
                'id'       => $order->id,
                'name'     => $order->name,
                'price'    => $order->price,
                'quantity' => $order->quantity,
                'subtotal' => $order->subtotal,
            ]),
        ]);
    }

    public function bookedTables(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
        ]);

        $bookings = Booking::where('date', $request->date)->pluck('tables');

        $bookedTables = [];
        foreach ($bookings as $tablesJson) {
            $tables = json_decode($tablesJson, true);
            if (is_array($tables)) {
                $bookedTables = array_merge($bookedTables, $tables);
            }
        }

        return response()->json(array_values(array_unique($bookedTables)));
    }
}
