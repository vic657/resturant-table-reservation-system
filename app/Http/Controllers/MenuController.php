<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class MenuController extends Controller
{
    // Fetch all menu items
    public function index()
    {
        $menus = Menu::all();
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
            $uploaded = Cloudinary::upload(
                $request->file('image')->getRealPath(),
                ['folder' => 'menu_images']
            );

            $data['image'] = $uploaded->getSecurePath(); // save URL
            $data['image_public_id'] = $uploaded->getPublicId(); // save for deletion
        }

        $menu = Menu::create($data);
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
            // Delete old image from Cloudinary if it exists
            if ($menu->image_public_id) {
                Cloudinary::destroy($menu->image_public_id);
            }

            $uploaded = Cloudinary::upload(
                $request->file('image')->getRealPath(),
                ['folder' => 'menu_images']
            );

            $data['image'] = $uploaded->getSecurePath();
            $data['image_public_id'] = $uploaded->getPublicId();
        }

        $menu->update($data);
        return response()->json($menu);
    }

    // Delete a menu
    public function destroy(Menu $menu)
    {
        // Delete the image from Cloudinary if exists
        if ($menu->image_public_id) {
            Cloudinary::destroy($menu->image_public_id);
        }

        $menu->delete();
        return response()->json(['message' => 'Menu deleted successfully']);
    }
}
