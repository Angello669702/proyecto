<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $transactions = Transaction::with('user', 'items.product')
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->user_id, fn($q) => $q->where('user_id', $request->user_id))
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return TransactionResource::collection($transactions);
    }

    public function show(Transaction $transaction)
    {
        return new TransactionResource($transaction->load('user', 'items.product'));
    }

    public function store(TransactionRequest $request)
    {
        DB::beginTransaction();

        try {
            $data     = $request->validated();
            $items    = $data['items'];
            $subtotal = 0;

            foreach ($items as $item) {
                $product = Product::findOrFail($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    return response()->json([
                        'message' => "Stock insuficiente para el producto: {$product->name}"
                    ], 422);
                }

                $subtotal += $item['unit_price'] * $item['quantity'];
            }

            $discount = $data['discount_applied'] ?? 0;
            $shipping = $data['shipping_cost'] ?? 0;

            $transaction = Transaction::create([
                'user_id'          => $data['user_id'],
                'status'           => 'pending',
                'subtotal'         => $subtotal,
                'discount_applied' => $discount,
                'shipping_cost'    => $shipping,
                'total'            => $subtotal - $discount + $shipping,
                'shipping_address' => $data['shipping_address'],
                'notes'            => $data['notes'] ?? null,
                'payment_status'   => 'unpaid',
            ]);

            foreach ($items as $item) {
                $transaction->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal'   => $item['unit_price'] * $item['quantity'],
                ]);

                Product::where('id', $item['product_id'])
                    ->decrement('stock', $item['quantity']);
            }

            DB::commit();
            return new TransactionResource($transaction->load('user', 'items.product'));

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al crear el pedido', 'error' => $e->getMessage()], 500);
        }
    }

    public function updateStatus(Request $request, Transaction $transaction)
    {
        $request->validate([
            'status' => ['required', 'in:pending,preparing,shipped,delivered,cancelled'],
        ]);

        $transaction->update(['status' => $request->status]);
        return new TransactionResource($transaction->load('user', 'items.product'));
    }

    public function destroy(Transaction $transaction)
    {
        if (!in_array($transaction->status, ['pending', 'cancelled'])) {
            return response()->json(['message' => 'Solo se pueden eliminar pedidos pendientes o cancelados'], 409);
        }

        $transaction->delete();
        return response()->json(['message' => 'Pedido eliminado correctamente'], 200);
    }
}
