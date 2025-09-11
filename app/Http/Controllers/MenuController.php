<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    // Fetch all menu items
    public function index()
{
    $menus = Menu::all()->map(function ($menu) {
        if ($menu->image) {
            $menu->image = asset($menu->image); // converts to full URL
        }
        return $menu;
    });

    return response()->json($menus);
}

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
        $imageName = time() . '_' . $request->file('image')->getClientOriginalName();
        $path = public_path('menu_images');

        // ✅ Make sure folder exists
        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }

        $request->file('image')->move($path, $imageName);
        $data['image'] = 'menu_images/' . $imageName;
    }

    $menu = Menu::create($data);

    if ($menu->image) {
        $menu->image = asset($menu->image); // return full URL
    }

    return response()->json($menu, 201);
}

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
        $imageName = time() . '_' . $request->file('image')->getClientOriginalName();
        $request->file('image')->move(public_path('menu_images'), $imageName);
        $data['image'] = 'menu_images/' . $imageName;
    }

    $menu->update($data);

    if ($menu->image) {
        $menu->image = asset($menu->image); // return full URL
    }

    return response()->json($menu);
}
public function destroy(Menu $menu)
{
    // Delete the image file if exists
    if ($menu->image && file_exists(public_path($menu->image))) {
        unlink(public_path($menu->image));
    }

    $menu->delete();

    return response()->json(['message' => 'Menu deleted successfully']);
}


}
