<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index()
    {
        return response()->json(Menu::all());
    }

    public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string',
        'category' => 'required|in:drinks,beverages,foods,snacks',
        'price' => 'required|numeric',
        'description' => 'nullable|string',
        'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    $data = $request->only(['name', 'category', 'price', 'description']);

    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('menu_images', 'public');
        $data['image'] = $imagePath;
    }

    $menu = Menu::create($data);

    return response()->json($menu, 201);
}

public function update(Request $request, Menu $menu)
{
    $request->validate([
        'name' => 'required|string',
        'category' => 'required|in:drinks,beverages,foods,snacks',
        'price' => 'required|numeric',
        'description' => 'nullable|string',
        'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    $data = $request->only(['name', 'category', 'price', 'description']);

    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('menu_images', 'public');
        $data['image'] = $imagePath;
    }

    $menu->update($data);

    return response()->json($menu);
}

}
