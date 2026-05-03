<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category', 'images');

        $isAdmin = auth()->user()?->role === 'admin';

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

        return ProductResource::collection($query->paginate(9));
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
