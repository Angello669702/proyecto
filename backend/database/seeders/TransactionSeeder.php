<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\User;
use App\Models\Product;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $carlos = User::where('email', 'carlos@elrincon.com')->firstOrFail();
        $maria  = User::where('email', 'maria@laplaza.com')->firstOrFail();
        $pedro  = User::where('email', 'pedro@laspalmas.com')->firstOrFail();

        $p = fn($sku) => Product::where('sku', $sku)->firstOrFail();

        $t1 = Transaction::create([
            'user_id'          => $carlos->id,
            'status'           => 'delivered',
            'subtotal'         => 87.50,
            'discount_applied' => 5.00,
            'shipping_cost'    => 0.00,
            'total'            => 82.50,
            'shipping_address' => $carlos->address,
            'payment_intent_id'=> 'pi_test_001',
            'payment_status'   => 'paid',
        ]);

        TransactionItem::create(['transaction_id' => $t1->id, 'product_id' => $p('VIN-001')->id, 'quantity' => 5,  'unit_price' => 10.00, 'subtotal' => 50.00]);
        TransactionItem::create(['transaction_id' => $t1->id, 'product_id' => $p('CER-001')->id, 'quantity' => 25, 'unit_price' => 0.90, 'subtotal' => 22.50]);
        TransactionItem::create(['transaction_id' => $t1->id, 'product_id' => $p('ESP-001')->id, 'quantity' => 2,  'unit_price' => 8.50, 'subtotal' => 17.00]);

        $t2 = Transaction::create([
            'user_id'          => $maria->id,
            'status'           => 'shipped',
            'subtotal'         => 130.00,
            'discount_applied' => 0.00,
            'shipping_cost'    => 5.00,
            'total'            => 135.00,
            'shipping_address' => $maria->address,
            'payment_intent_id'=> 'pi_test_002',
            'payment_status'   => 'paid',
            'notes'            => 'Entregar por la mañana',
        ]);

        TransactionItem::create(['transaction_id' => $t2->id, 'product_id' => $p('DES-001')->id, 'quantity' => 2,  'unit_price' => 35.00, 'subtotal' => 70.00]);
        TransactionItem::create(['transaction_id' => $t2->id, 'product_id' => $p('DES-002')->id, 'quantity' => 2,  'unit_price' => 16.00, 'subtotal' => 32.00]);
        TransactionItem::create(['transaction_id' => $t2->id, 'product_id' => $p('DES-003')->id, 'quantity' => 1,  'unit_price' => 22.00, 'subtotal' => 22.00]);
        TransactionItem::create(['transaction_id' => $t2->id, 'product_id' => $p('SIN-001')->id, 'quantity' => 10, 'unit_price' => 0.60, 'subtotal' => 6.00]);

        $t3 = Transaction::create([
            'user_id'          => $pedro->id,
            'status'           => 'preparing',
            'subtotal'         => 44.00,
            'discount_applied' => 0.00,
            'shipping_cost'    => 0.00,
            'total'            => 44.00,
            'shipping_address' => $pedro->address,
            'payment_intent_id'=> 'pi_test_003',
            'payment_status'   => 'paid',
        ]);

        TransactionItem::create(['transaction_id' => $t3->id, 'product_id' => $p('VIN-002')->id, 'quantity' => 2, 'unit_price' => 9.80, 'subtotal' => 19.60]);
        TransactionItem::create(['transaction_id' => $t3->id, 'product_id' => $p('CER-002')->id, 'quantity' => 8, 'unit_price' => 2.50, 'subtotal' => 20.00]);
        TransactionItem::create(['transaction_id' => $t3->id, 'product_id' => $p('SIN-002')->id, 'quantity' => 4, 'unit_price' => 0.80, 'subtotal' => 3.20]);

        $t4 = Transaction::create([
            'user_id'          => $carlos->id,
            'status'           => 'pending',
            'subtotal'         => 28.00,
            'discount_applied' => 0.00,
            'shipping_cost'    => 0.00,
            'total'            => 28.00,
            'shipping_address' => $carlos->address,
            'payment_status'   => 'unpaid',
        ]);

        TransactionItem::create([
            'transaction_id' => $t4->id,
            'product_id'     => $p('DES-002')->id,
            'quantity'       => 2,
            'unit_price'     => 14.00,
            'subtotal'       => 28.00
        ]);

        $t5 = Transaction::create([
            'user_id'          => $pedro->id,
            'status'           => 'pending',
            'subtotal'         => 37.50,
            'discount_applied' => 0.00,
            'shipping_cost'    => 0.00,
            'total'            => 37.50,
            'shipping_address' => $pedro->address,
            'payment_status'   => 'unpaid',
        ]);

        TransactionItem::create([
            'transaction_id' => $t5->id,
            'product_id'     => $p('VIN-001')->id,
            'quantity'       => 3,
            'unit_price'     => 12.50,
            'subtotal'       => 37.50
        ]);
    }
}