<?php

namespace App\Http\Controllers;

use App\Models\KitchenManager;
use App\Models\Booking;
use App\Models\Order;
use App\Models\Waiter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class KitchenManagerController extends Controller
{
    // ========================
    // Kitchen Manager accounts
    // ========================

    // Register Kitchen Manager
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:kitchen_managers,email',
            'password' => 'required|min:6',
        ]);

        $manager = KitchenManager::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Kitchen Manager registered successfully!',
            'manager' => $manager
        ], 201);
    }

    // List all Kitchen Managers
    public function index()
    {
        return response()->json(KitchenManager::all());
    }

    // Get one Kitchen Manager
    public function show($id)
    {
        return response()->json(KitchenManager::findOrFail($id));
    }

    // Delete Kitchen Manager
    public function destroy($id)
    {
        $manager = KitchenManager::findOrFail($id);
        $manager->delete();

        return response()->json(['message' => 'Kitchen Manager removed successfully!']);
    }

    // ========================
    // Bookings & Orders
    // ========================

    // Fetch all bookings
    public function getBookings()
    {
        $bookings = Booking::with('orders')->latest()->get();
        return response()->json($bookings);
    }

    // Fetch all orders (with waiter & booking info)
    public function getOrders()
    {
        $orders = Order::with(['waiter', 'booking'])->latest()->get();
        return response()->json($orders);
    }

    // Assign a waiter to an order
    public function assignWaiter(Request $request, $orderId)
    {
        $request->validate([
            'waiter_id' => 'required|exists:waiters,id',
        ]);

        $order = Order::findOrFail($orderId);
        $order->waiter_id = $request->waiter_id;
        $order->save();

        return response()->json([
            'message' => 'Waiter assigned successfully',
            'order' => $order->load(['waiter', 'booking'])
        ]);
    }

    // Mark order as served (for waiter use)
   public function markOrderServedByWaiter(Request $request, $orderId)
{
    $waiterId = $request->waiter_id; // passed from frontend

    $order = Order::findOrFail($orderId);

    // If no waiter assigned, assign this waiter
    if (!$order->waiter_id) {
        $order->waiter_id = $waiterId;
    }

    $order->status = 'served';
    $order->save();

    return response()->json([
        'message' => 'Order marked as served!',
        'order' => $order->load(['waiter', 'booking'])
    ]);
}
public function markOrderServed($orderId)
{
    $order = Order::findOrFail($orderId);
    $order->status = 'served';
    $order->save();

    return response()->json([
        'message' => 'Order marked as served!',
        'order' => $order->load(['waiter', 'booking'])
    ]);
}

}
