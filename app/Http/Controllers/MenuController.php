<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    // Path to persistent storage folder on Render
    private $storagePath = '/mnt/storage/menu_images';

    // Fetch all menu items
    public function index()
    {
        $menus = Menu::all()->map(function ($menu) {
            if ($menu->image) {
                $menu->image = asset($menu->image); // full URL for React
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
            $file = $request->file('image');
            $filename = time().'_'.$file->getClientOriginalName();

            // Ensure directory exists
            if (!file_exists($this->storagePath)) {
                mkdir($this->storagePath, 0755, true);
            }

            $file->move($this->storagePath, $filename);
            $data['image'] = '/menu_images/' . $filename; // path relative to public URL
        }

        $menu = Menu::create($data);

        if ($menu->image) {
            $menu->image = asset($menu->image);
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
            if ($menu->image) {
                $oldImage = $_SERVER['DOCUMENT_ROOT'] . $menu->image;
                if (file_exists($oldImage)) {
                    unlink($oldImage);
                }
            }

            $file = $request->file('image');
            $filename = time().'_'.$file->getClientOriginalName();

            if (!file_exists($this->storagePath)) {
                mkdir($this->storagePath, 0755, true);
            }

            $file->move($this->storagePath, $filename);
            $data['image'] = '/menu_images/' . $filename;
        }

        $menu->update($data);

        if ($menu->image) {
            $menu->image = asset($menu->image);
        }

        return response()->json($menu);
    }

    // Delete a menu
    public function destroy(Menu $menu)
    {
        if ($menu->image) {
            $oldImage = $_SERVER['DOCUMENT_ROOT'] . $menu->image;
            if (file_exists($oldImage)) {
                unlink($oldImage);
            }
        }

        $menu->delete();

        return response()->json(['message' => 'Menu deleted successfully']);
    }
}
