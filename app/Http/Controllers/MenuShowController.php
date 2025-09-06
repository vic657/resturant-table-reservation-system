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
                $menu->image = asset($menu->image); // ✅ full URL for React
            }
            return $menu;
        });

        return response()->json($menus);
    }
}
