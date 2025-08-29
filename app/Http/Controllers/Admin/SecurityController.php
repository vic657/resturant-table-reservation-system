<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Security;
use Illuminate\Support\Facades\Hash;

class SecurityController extends Controller
{
    // List all security guards
    public function index()
    {
        return response()->json(Security::all());
    }

    // Store new security guard
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:securities',
            'phone' => 'nullable|string',
            'shift' => 'required|string',
            'password' => 'required|string|min:6',
        ]);

        $security = Security::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'shift' => $request->shift,
            'password' => Hash::make($request->password),
        ]);

        return response()->json($security, 201);
    }

    // Show a single guard
    public function show($id)
    {
        return response()->json(Security::findOrFail($id));
    }

    // Update guard
    public function update(Request $request, $id)
    {
        $security = Security::findOrFail($id);

        $security->update($request->only(['name','email','phone','shift']) + 
            ($request->password ? ['password'=> Hash::make($request->password)] : [])
        );

        return response()->json($security);
    }

    // Delete guard
    public function destroy($id)
    {
        $security = Security::findOrFail($id);
        $security->delete();

        return response()->json(null, 204);
    }
}
