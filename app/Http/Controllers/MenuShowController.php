<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Menu;

class MenuShowController extends Controller
{
    // Show all menus for public view
    public function index()
    {
        $menus = Menu::all()->map(function ($menu) {
            if ($menu->image) {
                // Ensure the public URL is correct for React
                if (!str_contains($menu->image, 'storage/')) {
                    $menu->image = asset('storage/' . $menu->image);
                } else {
                    $menu->image = asset($menu->image);
                }
            }
            return $menu;
        });

        return response()->json($menus);
    }
}
