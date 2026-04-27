<?php

namespace App\Http\Controllers;

use App\Http\Resources\TransactionResource;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    // ADMIN — lista todas las transactions con sus items y usuario
    public function index()
    {
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
        $transaction = $request->user()
            ->transactions()
            ->with('items.product')
            ->where('status', 'pending')
            ->first();

        if (!$transaction) {
            return response()->json(['message' => 'No tienes ningún pedido activo'], 404);
        }

        return new TransactionResource($transaction);
    }

    // CLIENTE — añade un producto al carrito, creando la transaction si no existe
    public function addItem(Request $request)
    {
        $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity'   => ['required', 'integer', 'min:1'],
        ]);

        $product = Product::findOrFail($request->product_id);

        if (!$product->is_active) {
            return response()->json(['message' => 'El producto no está disponible'], 422);
        }

        if ($product->stock < $request->quantity) {
            return response()->json(['message' => "Stock insuficiente para: {$product->name}"], 422);
        }

        DB::beginTransaction();

        try {
            $user = $request->user();

            // Busca carrito existente o crea uno nuevo
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
            return new TransactionResource($transaction->load('user', 'items.product'));

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al añadir el producto', 'error' => $e->getMessage()], 500);
        }
    }

    // CLIENTE — elimina un item del carrito
    public function removeItem(Request $request, TransactionItem $item)
    {
        $transaction = $item->transaction;

        if ($transaction->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        if ($transaction->status !== 'pending') {
            return response()->json(['message' => 'No se puede modificar un pedido que no está pendiente'], 422);
        }

        $item->delete();

        // Si no quedan items, borra la transaction entera
        if ($transaction->items()->count() === 0) {
            $transaction->delete();
            return response()->json(['message' => 'Carrito eliminado al quedar vacío'], 200);
        }

        $this->recalculate($transaction);

        return new TransactionResource($transaction->load('user', 'items.product'));
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
        $subtotal = $transaction->items()->sum('subtotal');
        $transaction->update([
            'subtotal' => $subtotal,
            'total'    => $subtotal - $transaction->discount_applied + $transaction->shipping_cost,
        ]);
    }
}
