<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Accountant;

class AccountantController extends Controller
{
    // Get accountant (only one expected)
    public function index()
    {
        $accountant = Accountant::first();
        return response()->json($accountant);
    }

    // Store accountant (only if none exists)
    public function store(Request $request)
    {
        if (Accountant::count() >= 1) {
            return response()->json(['error' => 'An accountant already exists'], 400);
        }

        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:accountants',
        ]);

        $accountant = Accountant::create($validated);

        return response()->json(['message' => 'Accountant added successfully', 'accountant' => $accountant]);
    }

    // Update accountant
    public function update(Request $request, $id)
    {
        $accountant = Accountant::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:accountants,email,' . $id,
            'password' => Hash::make($request->password),
        ]);

        $accountant->update($validated);

        return response()->json(['message' => 'Accountant updated successfully', 'accountant' => $accountant]);
    }

    // Delete accountant
    public function destroy($id)
    {
        $accountant = Accountant::findOrFail($id);
        $accountant->delete();

        return response()->json(['message' => 'Accountant removed successfully']);
    }
}
