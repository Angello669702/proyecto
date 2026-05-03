<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TransactionResource;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    // ADMIN — lista todas las transactions con sus items y usuario
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $transactions = Transaction::with('user', 'items.product')
            ->paginate(20);

        return TransactionResource::collection($transactions);
    }

        // ADMIN + CLIENTE — detalle de una transaction concreta
    public function show(Transaction $transaction)
    {
        return new TransactionResource($transaction->load('user', 'items.product'));
    }

    // CLIENTE — obtiene su carrito activo (pending)
    public function myCart(Request $request)
    {
        $user = $request->user();

        $transaction = $user->transactions()
            ->with('items.product')
            ->where('status', 'pending')
            ->first();

        if (!$transaction) {
            $transaction = Transaction::create([
                'user_id'          => $user->id,
                'status'           => 'pending',
                'subtotal'         => 0,
                'discount_applied' => 0,
                'shipping_cost'    => 0,
                'total'            => 0,
                'shipping_address' => $user->address ?? '',
                'payment_status'   => 'unpaid',
            ]);

            $transaction->load('items.product');
        }

        return new TransactionResource($transaction);
    }

    public function myTransactions(Request $request)
    {
        $transactions = $request->user()
            ->transactions()
            ->with('items.product')
            ->orderByDesc('created_at')
            ->paginate(20);

        return TransactionResource::collection($transactions);
    }

    // CLIENTE — añade un producto al carrito, creando la transaction si no existe
    public function addItem(Request $request)
    {
        $request->validate([
            'product'    => ['required', 'array'],
            'product.id' => ['required', 'string', 'exists:products,id'],
            'quantity'   => ['required', 'integer', 'min:1'],
        ]);

        $productId = $request->input('product.id');

        $product = Product::findOrFail($productId);

        if (!$product->is_active) {
            return response()->json(['message' => 'El producto no está disponible'], 422);
        }

        if ($product->stock < $request->quantity) {
            return response()->json(['message' => "Stock insuficiente para: {$product->name}"], 422);
        }

        DB::beginTransaction();

        try {
            $user = $request->user();

            $transaction = $user->transactions()
                ->where('status', 'pending')
                ->first();

            if (!$transaction) {
                $transaction = Transaction::create([
                    'user_id'          => $user->id,
                    'status'           => 'pending',
                    'subtotal'         => 0,
                    'discount_applied' => 0,
                    'shipping_cost'    => 0,
                    'total'            => 0,
                    'shipping_address' => $user->address ?? '',
                    'payment_status'   => 'unpaid',
                ]);
            }

            // Si el producto ya está en el carrito, suma la cantidad
            $existingItem = $transaction->items()
                ->where('product_id', $product->id)
                ->first();

            // Precio especial si el usuario tiene price group
            $unitPrice = $user->priceGroup
                ? ($user->priceGroup->items()->where('product_id', $product->id)->value('price') ?? $product->price)
                : $product->price;

            if ($existingItem) {
                $newQuantity = $existingItem->quantity + $request->quantity;
                $existingItem->update([
                    'quantity' => $newQuantity,
                    'subtotal' => $unitPrice * $newQuantity,
                ]);
            } else {
                $transaction->items()->create([
                    'product_id' => $product->id,
                    'quantity'   => $request->quantity,
                    'unit_price' => $unitPrice,
                    'subtotal'   => $unitPrice * $request->quantity,
                ]);
            }

            // Recalcula totales de la transaction
            $this->recalculate($transaction);

            DB::commit();
            $transaction->refresh();
            return new TransactionResource($transaction->load('user', 'items.product'));

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al añadir el producto',
                'error'   => $e->getMessage(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine(),
            ], 500);
        }
    }

    // CLIENTE — elimina un item del carrito
    public function removeItem(Request $request)
    {
        $request->validate([
            'product'    => ['required', 'array'],
            'product.id' => ['required', 'string', 'exists:products,id'],
            'quantity'   => ['required', 'integer', 'min:1'],
        ]);

        $productId = $request->input('product.id');

        $user = $request->user();

        $transaction = $user->transactions()
            ->where('status', 'pending')
            ->first();

        if (!$transaction) {
            return response()->json(['message' => 'No tienes ningún carrito activo'], 404);
        }

        $item = $transaction->items()
            ->where('product_id', $productId)
            ->first();

        if (!$item) {
            return response()->json(['message' => 'El producto no está en el carrito'], 404);
        }

        DB::beginTransaction();

        try {
            $newQuantity = $item->quantity - $request->quantity;

            if ($newQuantity <= 0) {
                $item->delete();
            } else {
                $item->update([
                    'quantity' => $newQuantity,
                    'subtotal' => $item->unit_price * $newQuantity,
                ]);
            }

            $this->recalculate($transaction);

            DB::commit();
            return new TransactionResource($transaction->load('user', 'items.product'));

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al eliminar el producto', 'error' => $e->getMessage()], 500);
        }
    }

    // ADMIN + CLIENTE — borra una transaction completa (carrito o pedido cancelado)
    public function destroy(Request $request, Transaction $transaction)
    {
        $user = $request->user();

        // Un cliente solo puede borrar su propio carrito
        if ($user->role !== 'admin' && $transaction->user_id !== $user->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        if (!in_array($transaction->status, ['pending', 'cancelled'])) {
            return response()->json(['message' => 'Solo se pueden eliminar pedidos pendientes o cancelados'], 409);
        }

        $transaction->delete();
        return response()->json(['message' => 'Pedido eliminado correctamente'], 200);
    }

    // ADMIN — cambia el estado de un pedido
    public function updateStatus(Request $request, Transaction $transaction)
    {
        $request->validate([
            'status' => ['required', 'in:pending,preparing,shipped,delivered,cancelled'],
        ]);

        $transaction->update(['status' => $request->status]);
        return new TransactionResource($transaction->load('user', 'items.product'));
    }

    // Recalcula subtotal y total de la transaction
    private function recalculate(Transaction $transaction): void
    {
        $transaction->load('items.product');

        $subtotal = $transaction->items()->sum('subtotal');

        $discountApplied = $transaction->items->sum(
            fn($item) => ($item->product->price - $item->unit_price) * $item->quantity
        );

        $vatTotal = $transaction->items()->sum('vat_amount');

        $transaction->update([
            'subtotal'         => $subtotal,
            'discount_applied' => $discountApplied,
            'vat_total'        => $vatTotal,
            'total'            => $subtotal - $discountApplied + $vatTotal + $transaction->shipping_cost,
        ]);
    }
}
