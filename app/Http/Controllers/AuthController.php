<?php
namespace App\Http\Controllers;

use App\Models\{User, KitchenManager, Waiter, Security, Accountant};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email|max:255',
            'password' => 'required|string|max:1024',
        ]);
        foreach ([User::class => null, KitchenManager::class => 'kitchen_manager', Waiter::class => 'waiter', Security::class => 'security', Accountant::class => 'accountant'] as $model => $role) {
            $user = $model::where('email', $credentials['email'])->first();
            if ($user && Hash::check($credentials['password'], $user->password)) {
                return response()->json([
                    'user' => $user,
                    'role' => $role ?? $user->role,
                    'token' => $user->createToken('authToken')->plainTextToken,
                ]);
            }
        }
        return response()->json(['message' => 'Invalid login details'], 401);
    }

    public function me(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();
        return response()->json(['message' => 'Signed out.']);
    }
}