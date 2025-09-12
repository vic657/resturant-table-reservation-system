<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MenuController extends Controller
{
    // Fetch all menu items
    public function index()
    {
        $menus = Menu::all()->map(function ($menu) {
            if ($menu->image) {
                $menu->image = asset('storage/' . $menu->image); // converts to full URL
            }
            return $menu;
        });

        return response()->json($menus);
    }

    // Create a new menu
    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string',
            'category'    => 'required|in:drinks,beverages,foods,snacks',
            'price'       => 'required|numeric',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $data = $request->only(['name', 'category', 'price', 'description']);

        if ($request->hasFile('image')) {
            // store in storage/app/public/menu_images
            $path = $request->file('image')->store('menu_images', 'public');
            $data['image'] = $path;
        }

        $menu = Menu::create($data);

        if ($menu->image) {
            $menu->image = asset('storage/' . $menu->image); // return full URL
        }

        return response()->json($menu, 201);
    }

    // Update an existing menu
    public function update(Request $request, Menu $menu)
    {
        $request->validate([
            'name'        => 'required|string',
            'category'    => 'required|in:drinks,beverages,foods,snacks',
            'price'       => 'required|numeric',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $data = $request->only(['name', 'category', 'price', 'description']);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($menu->image && Storage::disk('public')->exists($menu->image)) {
                Storage::disk('public')->delete($menu->image);
            }

            $path = $request->file('image')->store('menu_images', 'public');
            $data['image'] = $path;
        }

        $menu->update($data);

        if ($menu->image) {
            $menu->image = asset('storage/' . $menu->image); // return full URL
        }

        return response()->json($menu);
    }

    // Delete a menu
    public function destroy(Menu $menu)
    {
        // Delete the image file if exists
        if ($menu->image && Storage::disk('public')->exists($menu->image)) {
            Storage::disk('public')->delete($menu->image);
        }

        $menu->delete();

        return response()->json(['message' => 'Menu deleted successfully']);
    }
}
