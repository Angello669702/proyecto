<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class StripeController extends Controller
{
    public function createCheckoutSession(Request $request)
    {
        $transaction = Transaction::with('items.product')
            ->where('user_id', $request->user()->id)
            ->where('status', 'pending')
            ->first();

        Stripe::setApiKey(config('services.stripe.secret'));

        $lineItems = $transaction->items->map(function ($item) {
            return [
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => $item->product->name,
                    ],
                    'unit_amount' => (int) round($item->unit_price * (1 + $item->vat_rate / 100) * 100),
                ],
                'quantity' => $item->quantity,
            ];
        })->toArray();

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'mode' => 'payment',
            'success_url' => config('app.frontend_url') . '/home?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => config('app.frontend_url') . '/transactions/cart',
            'metadata' => [
                'transaction_id' => $transaction->id,
            ],
        ]);

        return response()->json(['url' => $session->url]);
    }

    public function handleWebhook(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $sigHeader,
                config('services.stripe.webhook_secret')
            );
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $transactionId = $session->metadata->transaction_id;

            $transaction = Transaction::with('items.product')
                ->find($transactionId);

            if ($transaction) {
                foreach ($transaction->items as $item) {
                    $item->product->decrement('stock', $item->quantity);
                }

                $transaction->update([
                    'status' => 'preparing',
                    'payment_status' => 'paid',
                    'payment_intent_id' => $session->payment_intent,
                ]);
            }
        }

        return response()->json(['received' => true]);
    }
}
