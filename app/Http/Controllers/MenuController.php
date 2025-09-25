<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use ImageKit\ImageKit;
use Illuminate\Support\Facades\Log;

class MenuController extends Controller
{
    protected $imageKit;

    public function __construct()
    {
        $this->imageKit = new ImageKit(
            config('app.imagekit.public_key'),
            config('app.imagekit.private_key'),
            config('app.imagekit.url_endpoint')
        );
    }

    // Fetch all menu items
    public function index()
    {
        $menus = Menu::all()->map(function ($menu) {
            return [
                'id'          => $menu->id,
                'name'        => $menu->name,
                'category'    => $menu->category,
                'price'       => $menu->price,
                'description' => $menu->description,
                'image'       => $menu->image,
                'created_at'  => $menu->created_at,
                'updated_at'  => $menu->updated_at,
            ];
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
            $file     = fopen($request->file('image')->getPathname(), "r");
            $fileName = time() . '_' . $request->file('image')->getClientOriginalName();

            $upload = $this->imageKit->upload([
                'file'              => $file,
                'fileName'          => $fileName,
                'folder'            => "/menu_images",
                'useUniqueFileName' => true,
            ]);

            // Decode nested stdClass to array
            $response = json_decode(json_encode($upload->result), true);


            if (isset($response['url'])) {
            $data['image'] = $response['url'];
            $data['image_file_id'] = $response['fileId'] ?? null;
        } else {
            Log::warning('ImageKit upload succeeded but no URL found in decoded result.', $response);
        }

        }

        $menu = Menu::create($data);

        return response()->json([
            'id'          => $menu->id,
            'name'        => $menu->name,
            'category'    => $menu->category,
            'price'       => $menu->price,
            'description' => $menu->description,
            'image'       => $menu->image,
            'created_at'  => $menu->created_at,
            'updated_at'  => $menu->updated_at,
        ], 201);
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
            $file     = fopen($request->file('image')->getPathname(), "r");
            $fileName = time() . '_' . $request->file('image')->getClientOriginalName();

            $upload = $this->imageKit->upload([
            'file'              => $file,
            'fileName'          => $fileName,
            'folder'            => "/menu_images",
            'useUniqueFileName' => true,
        ]);

        if (isset($upload->result->url)) {
            $data['image'] = $upload->result->url;
            $data['image_file_id'] = $upload->result->fileId ?? null;
        } else {
            Log::warning('ImageKit upload succeeded but no URL found.', (array) $upload->result);
        }
        }

        $menu->update($data);

        return response()->json([
            'id'          => $menu->id,
            'name'        => $menu->name,
            'category'    => $menu->category,
            'price'       => $menu->price,
            'description' => $menu->description,
            'image'       => $menu->image,
            'created_at'  => $menu->created_at,
            'updated_at'  => $menu->updated_at,
        ]);
    }

    // Delete a menu
    public function destroy(Menu $menu)
    {
        if ($menu->image_file_id) {
            try {
                $this->imageKit->deleteFile($menu->image_file_id);
            } catch (\Exception $e) {
                Log::error('Failed to delete image from ImageKit: ' . $e->getMessage());
            }
        }

        $menu->delete();

        return response()->json(['message' => 'Menu deleted successfully']);
    }
}
