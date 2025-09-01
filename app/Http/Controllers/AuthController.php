<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\KitchenManager;
use App\Models\Waiter;
use App\Models\Security;
use App\Models\Accountant;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        // 🔹 Try users table (admins, general users)
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('authToken')->plainTextToken;

            return response()->json([
                'user'  => $user,
                'token' => $token,
                'role'  => $user->role,
            ]);
        }

        // 🔹 Kitchen Managers
        $manager = KitchenManager::where('email', $request->email)->first();
        if ($manager && Hash::check($request->password, $manager->password)) {
            $token = $manager->createToken('authToken')->plainTextToken;
            return response()->json([
                'user'  => $manager,
                'token' => $token,
                'role'  => 'kitchen_manager',
            ]);
        }

        // 🔹 Waiters
        $waiter = Waiter::where('email', $request->email)->first();
        if ($waiter && Hash::check($request->password, $waiter->password)) {
            $token = $waiter->createToken('authToken')->plainTextToken;
            return response()->json([
                'user'  => $waiter,
                'token' => $token,
                'role'  => 'waiter',
            ]);
        }

        // 🔹 Security
        $security = Security::where('email', $request->email)->first();
        if ($security && Hash::check($request->password, $security->password)) {
            $token = $security->createToken('authToken')->plainTextToken;
            return response()->json([
                'user'  => $security,
                'token' => $token,
                'role'  => 'security',
            ]);
        }

        // 🔹 Accountant
        $accountant = Accountant::where('email', $request->email)->first();
        if ($accountant && Hash::check($request->password, $accountant->password)) {
            $token = $accountant->createToken('authToken')->plainTextToken;
            return response()->json([
                'user'  => $accountant,
                'token' => $token,
                'role'  => 'accountant',
            ]);
        }

        return response()->json(['message' => 'Invalid login details'], 401);
    }
}
