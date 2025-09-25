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
            // ImageKit URLs are already full URLs, so just keep them
            $menu->image = $menu->image ?? null;
            return $menu;
        });

        return response()->json($menus);
    }
}
