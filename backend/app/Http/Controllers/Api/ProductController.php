<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category', 'images');

        $isAdmin = auth('sanctum')->user()?->role === 'admin';

        if (!$isAdmin) {
            $query->where('is_active', true);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('categories')) {
            $categoryNames = explode(',', $request->categories);
            $query->whereHas('category', function ($q) use ($categoryNames) {
                $q->whereIn('name', $categoryNames);
            });
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->filled('favourites_only') && $request->favourites_only === 'true') {
            $user = auth('sanctum')->user();
            if ($user) {
                $favouriteIds = $user->favourites()->pluck('products.id');
                $query->whereIn('id', $favouriteIds);
            } else {
                $query->whereRaw('0 = 1');
            }
        }

        return ProductResource::collection($query->paginate(9));
    }
    public function show(Product $product)
    {
        return new ProductResource($product->load('category', 'images'));
    }

    public function store(ProductRequest $request)
    {
        $category = Category::where('name', $request->category)->first();

        if (!$category) {
            return response()->json([
                'message' => 'La categoría seleccionada no existe.'
            ], 422);
        }

        $product = Product::create([
            'category_id' => $category->id,
            'name' => $request->name,
            'sku' => $request->sku,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'stock_alert_threshold' => $request->stock_alert_threshold ?? 10,
            'is_active' => $request->boolean('is_active', true),
        ]);

        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')->store('products/covers', 'public');

            $product->images()->create([
                'path' => $coverPath,
                'order' => 0,
                'is_cover' => true,
            ]);
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $imagePath = $image->store('products/gallery', 'public');

                $product->images()->create([
                    'path' => $imagePath,
                    'order' => $index + 1,
                    'is_cover' => false,
                ]);
            }
        }

        return new ProductResource($product->load('category', 'images'));
    }

    public function update(ProductRequest $request, Product $product)
    {
        $category = Category::where('name', $request->category)->first();

        if (!$category) {
            return response()->json([
                'message' => 'La categoría seleccionada no existe.'
            ], 422);
        }

        $product->update([
            'category_id' => $category->id,
            'name' => $request->name,
            'sku' => $request->sku,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'stock_alert_threshold' => $request->stock_alert_threshold ?? $product->stock_alert_threshold,
            'is_active' => $request->boolean('is_active', $product->is_active),
        ]);

        if ($request->hasFile('cover_image')) {
            $oldCover = $product->images()->where('is_cover', true)->first();
            if ($oldCover) {
                Storage::disk('public')->delete($oldCover->path);
                $oldCover->delete();
            }

            $coverPath = $request->file('cover_image')->store('products/covers', 'public');

            $product->images()->create([
                'path' => $coverPath,
                'order' => 0,
                'is_cover' => true,
            ]);
        }

        if ($request->hasFile('images')) {
            $oldImages = $product->images()->where('is_cover', false)->get();
            foreach ($oldImages as $oldImage) {
                Storage::disk('public')->delete($oldImage->path);
                $oldImage->delete();
            }

            foreach ($request->file('images') as $index => $image) {
                $imagePath = $image->store('products/gallery', 'public');

                $product->images()->create([
                    'path' => $imagePath,
                    'order' => $index + 1,
                    'is_cover' => false,
                ]);
            }
        }

        return new ProductResource($product->load('category', 'images'));
    }

    public function destroy(Product $product)
    {
        if ($product->transactionItems()->exists()) {
            return response()->json([
                'message' => 'No se puede eliminar el producto porque está asociado a pedidos existentes. Puedes desactivarlo en su lugar.',
            ], 409);
        }

        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->path);
            $image->delete();
        }

        $product->delete();

        return response()->json(['message' => 'Producto eliminado'], 200);
    }

    public function topSelling()
    {
        $products = Product::with(['category', 'images'])
            ->where('is_active', true)
            ->withSum(['transactionItems as total_sold' => function ($query) {
                $query->whereHas('transaction', function ($q) {
                    $q->where('status', '!=', 'cancelled')
                        ->where('payment_status', 'paid');
                });
            }], 'quantity')
            ->orderByDesc('total_sold')
            ->take(4)
            ->get();

        if ($products->isEmpty() || $products->every(fn ($p) => $p->total_sold === null)) {
            $products = Product::with(['category', 'images'])
                ->where('is_active', true)
                ->take(4)
                ->get();
        }

        return ProductResource::collection($products);
    }

    public function favourite(Request $request)
    {
        $data = $request->validate([
            'id' => ['required', 'uuid', 'exists:products,id'],
        ]);

        $user = $request->user();

        $product = Product::with('category', 'images')->findOrFail($data['id']);

        $exists = $user->favourites()
            ->where('product_id', $product->id)
            ->exists();

        if ($exists) {
            $user->favourites()->detach($product->id);
        } else {
            $user->favourites()->attach($product->id);
        }

        return new ProductResource(
            $product->load('category', 'images')
        );
    }

    public function updateStock(Request $request, Product $product)
    {
        $data = $request->validate([
            'quantity' => ['required', 'integer'],
        ]);

        $newStock = $product->stock + $data['quantity'];

        if ($newStock < 0) {
            return response()->json([
                'message' => 'El stock no puede ser negativo'
            ], 422);
        }

        $product->increment('stock', $data['quantity']);

        return new ProductResource(
            $product->fresh()->load('category', 'images')
        );
    }

    public function toggle(Product $product)
    {
        $product->update(['is_active' => !$product->is_active]);
        return new ProductResource($product->load('category', 'images'));
    }
}
