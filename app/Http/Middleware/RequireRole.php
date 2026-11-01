<?php
namespace App\Http\Middleware;
use App\Models\{User, KitchenManager, Waiter, Security, Accountant};
use Closure;
use Illuminate\Http\Request;

class RequireRole
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        $user = $request->user();
        $role = match (true) {
            $user instanceof User => $user->role,
            $user instanceof KitchenManager => 'kitchen_manager',
            $user instanceof Waiter => 'waiter',
            $user instanceof Security => 'security',
            $user instanceof Accountant => 'accountant',
            default => null,
        };
        abort_unless(in_array($role, $roles, true), 403, 'Access denied.');
        return $next($request);
    }
}