<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MenuItemController extends Controller
{
    public function index()
    {
        return response()->json(MenuItem::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'price' => 'required|numeric',
            'image' => 'nullable|image|max:2048',
        ]);

        $path = $request->file('image')?->store('menu', 'public');

        $menuItem = MenuItem::create([
            'name' => $request->name,
            'category' => $request->category,
            'price' => $request->price,
            'image' => $path,
        ]);

        return response()->json($menuItem, 201);
    }

    public function update(Request $request, MenuItem $menuItem)
    {
        $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'price' => 'required|numeric',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($menuItem->image) {
                Storage::disk('public')->delete($menuItem->image);
            }
            $menuItem->image = $request->file('image')->store('menu', 'public');
        }

        $menuItem->update($request->only(['name','category','price']));

        return response()->json($menuItem);
    }

    public function destroy(MenuItem $menuItem)
    {
        if ($menuItem->image) {
            Storage::disk('public')->delete($menuItem->image);
        }
        $menuItem->delete();
        return response()->json(['message' => 'Menu item deleted']);
    }
}

