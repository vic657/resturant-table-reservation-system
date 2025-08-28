<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Waiter;
use Illuminate\Support\Facades\Hash;

class WaiterController extends Controller
{
    // List all waiters
    public function index()
    {
        return response()->json(Waiter::all());
    }

    // Store new waiter
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:waiters,email',
            'phone' => 'nullable|string',
            'shift' => 'nullable|string',
            'password' => 'required|string|min:6',
        ]);

        $waiter = Waiter::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'shift'    => $request->shift,
            'password' => Hash::make($request->password), // ✅ Secure hashing
        ]);

        return response()->json($waiter, 201);
    }

    // Show a single waiter
    public function show($id)
    {
        return response()->json(Waiter::findOrFail($id));
    }

    // Update waiter
    public function update(Request $request, $id)
    {
        $waiter = Waiter::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:waiters,email,' . $waiter->id,
            'phone' => 'nullable|string',
            'shift' => 'nullable|string',
            'password' => 'nullable|string|min:6',
        ]);

        $data = $request->all();

        // Hash password only if it’s provided
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        } else {
            unset($data['password']); // Don’t overwrite with null
        }

        $waiter->update($data);

        return response()->json($waiter);
    }

    // Delete waiter
    public function destroy($id)
    {
        $waiter = Waiter::findOrFail($id);
        $waiter->delete();

        return response()->json(null, 204);
    }
}
