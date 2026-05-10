<?php

namespace App\Http\Controllers\Api;

use App\Enums\ActionType;
use App\Http\Controllers\Controller;
use App\Http\Resources\TransactionResource;
use App\Models\ActionLog;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Transaction::with('user', 'items.product')
            ->where(function ($q) {
                $q->where('status', '!=', 'pending')
                    ->orWhere(function ($q2) {
                        $q2->where('status', 'pending')
                            ->where('subtotal', '>', 0);
                    });
            });

        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        $transactions = $query
            ->orderBy('status')
            ->paginate(20);

        return TransactionResource::collection($transactions);
    }

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

                ActionLog::log(
                    ActionType::TRANSACTION_CREATED,
                    'Transaction',
                    $transaction->id,
                    "{$user->name} creó un nuevo carrito"
                );
            }

            $existingItem = $transaction->items()
                ->where('product_id', $product->id)
                ->first();

            $unitPrice = $user->priceGroup
                ? ($user->priceGroup->items()->where('product_id', $product->id)->value('price') ?? $product->price)
                : $product->price;

            if ($existingItem) {
                $newQuantity = $existingItem->quantity + $request->quantity;

                if ($newQuantity > $product->stock) {
                    return response()->json([
                        'message' => "Stock insuficiente para: {$product->name}. Stock disponible: {$product->stock}"
                    ], 422);
                }

                $subtotal = $unitPrice * $newQuantity;

                $existingItem->update([
                    'quantity'   => $newQuantity,
                    'subtotal'   => $subtotal,
                    'vat_rate'   => $product->vat_rate,
                    'vat_amount' => $subtotal * ($product->vat_rate / 100),
                ]);
            } else {
                $subtotal = $unitPrice * $request->quantity;

                $transaction->items()->create([
                    'product_id' => $product->id,
                    'quantity'   => $request->quantity,
                    'unit_price' => $unitPrice,
                    'subtotal'   => $subtotal,
                    'vat_rate'   => $product->vat_rate,
                    'vat_amount' => $subtotal * ($product->vat_rate / 100),
                ]);
            }

            $this->recalculate($transaction);

            DB::commit();
            $transaction->refresh();

            ActionLog::log(
                ActionType::CART_ITEM_ADDED,
                'Transaction',
                $transaction->id,
                "{$user->name} añadió {$request->quantity} x '{$product->name}' al carrito"
            );

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
            $productName = $item->product->name;
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
            ActionLog::log(
                ActionType::CART_ITEM_REMOVED,
                'Transaction',
                $transaction->id,
                "{$user->name} quitó {$request->quantity} x '{$productName}' del carrito"
            );
            return new TransactionResource($transaction->load('user', 'items.product'));

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al eliminar el producto', 'error' => $e->getMessage()], 500);
        }
    }

    public function repeat(Request $request)
    {
        $request->validate([
            'id' => ['required', 'uuid', 'exists:transactions,id'],
        ]);

        $user = $request->user();

        $source = Transaction::with('items.product')
            ->where('id', $request->id)
            ->where('user_id', $user->id)
            ->where('status', 'delivered')
            ->firstOrFail();

        DB::beginTransaction();

        try {
            $user->transactions()->where('status', 'pending')->delete();

            $cart = Transaction::create([
                'user_id'          => $user->id,
                'status'           => 'pending',
                'subtotal'         => 0,
                'discount_applied' => 0,
                'shipping_cost'    => 0,
                'vat_total'        => 0,
                'total'            => 0,
                'shipping_address' => $user->address ?? '',
                'payment_status'   => 'unpaid',
            ]);

            foreach ($source->items as $item) {
                $product = $item->product;

                if (!$product->is_active || $product->stock < $item->quantity) {
                    continue;
                }

                $unitPrice = $user->priceGroup
                    ? ($user->priceGroup->items()->where('product_id', $product->id)->value('price') ?? $product->price)
                    : $product->price;

                $cart->items()->create([
                    'product_id' => $product->id,
                    'quantity'   => $item->quantity,
                    'unit_price' => $unitPrice,
                    'subtotal'   => $unitPrice * $item->quantity,
                    'vat_rate'   => $product->vat_rate,
                    'vat_amount' => ($unitPrice * $item->quantity) * ($product->vat_rate / 100),
                ]);
            }

            $this->recalculate($cart);

            DB::commit();

            return new TransactionResource($cart->load('user', 'items.product'));

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al repetir el pedido',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function changeStatus(Request $request)
    {
        $request->validate([
            'id'     => ['required', 'uuid', 'exists:transactions,id'],
            'status' => ['required', 'in:pending,preparing,shipped,delivered,cancelled'],
        ]);

        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $transaction = Transaction::findOrFail($request->id);
        $oldStatus = $transaction->status;
        $transaction->update(['status' => $request->status]);

        ActionLog::log(
            ActionType::TRANSACTION_STATUS_CHANGED,
            'Transaction',
            $transaction->id,
            "Admin {$request->user()->name} cambió el estado de la transacción #{$transaction->id} de '{$oldStatus}' a '{$request->status}'"
        );

        return new TransactionResource($transaction->load('user', 'items.product'));
    }

    private function recalculate(Transaction $transaction): void
    {
        $transaction->load('items.product');

        $subtotal = $transaction->items()->sum('subtotal');

        $subtotalOriginal = $transaction->items->sum(
            fn($item) => $item->product->price * $item->quantity
        );

        $discountApplied = $subtotalOriginal - $subtotal;

        $vatTotal = $transaction->items()->sum('vat_amount');

        $total = $subtotal + $vatTotal + $transaction->shipping_cost;

        $transaction->update([
            'subtotal'         => $subtotal,
            'discount_applied' => $discountApplied,
            'vat_total'        => $vatTotal,
            'total'            => $total,
        ]);
    }
}
