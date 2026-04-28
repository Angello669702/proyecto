<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category', 'images')->paginate(8);
        return ProductResource::collection($products);
    }

    public function show(Product $product)
    {
        return new ProductResource($product->load('category', 'images'));
    }

    public function store(ProductRequest $request)
    {
        $product = Product::create($request->validated());
        return new ProductResource($product->load('category', 'images'));
    }

    public function update(ProductRequest $request, Product $product)
    {
        $product->update($request->validated());
        return new ProductResource($product->load('category', 'images'));
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Producto eliminado correctamente'], 200);
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