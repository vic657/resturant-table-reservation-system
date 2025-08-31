<?php

namespace App\Http\Controllers;

use App\Models\KitchenManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class KitchenManagerController extends Controller
{
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

        return response()->json(['message' => 'Kitchen Manager registered successfully!', 'manager' => $manager], 201);
    }

    // Get Kitchen Manager (since only one is allowed)
    public function show()
    {
        $manager = KitchenManager::first();
        return response()->json($manager);
    }

    // Delete Kitchen Manager
    public function destroy($id)
    {
        $manager = KitchenManager::findOrFail($id);
        $manager->delete();

        return response()->json(['message' => 'Kitchen Manager removed successfully!']);
    }
}

