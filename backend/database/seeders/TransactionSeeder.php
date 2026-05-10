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
            'vat_total'        => 9.53,
            'shipping_cost'    => 0.00,
            'total'            => 92.03,
            'shipping_address' => $carlos->address ?? '',
            'payment_intent_id'=> 'pi_test_001',
            'payment_status'   => 'paid',
            'notes'            => '',
        ]);

        TransactionItem::create(['transaction_id' => $t1->id, 'product_id' => $p('VIN-001')->id, 'quantity' => 5,  'unit_price' => 10.00, 'vat_rate' => '10', 'vat_amount' => 5.00,  'subtotal' => 50.00]);
        TransactionItem::create(['transaction_id' => $t1->id, 'product_id' => $p('CER-001')->id, 'quantity' => 25, 'unit_price' => 0.90,  'vat_rate' => '10', 'vat_amount' => 2.25,  'subtotal' => 22.50]);
        TransactionItem::create(['transaction_id' => $t1->id, 'product_id' => $p('ESP-001')->id, 'quantity' => 2,  'unit_price' => 8.50,  'vat_rate' => '21', 'vat_amount' => 3.57,  'subtotal' => 17.00]);

        $t2 = Transaction::create([
            'user_id'          => $maria->id,
            'status'           => 'shipped',
            'subtotal'         => 130.00,
            'discount_applied' => 0.00,
            'vat_total'        => 20.46,
            'shipping_cost'    => 5.00,
            'total'            => 155.46,
            'shipping_address' => $maria->address ?? '',
            'payment_intent_id'=> 'pi_test_002',
            'payment_status'   => 'paid',
            'notes'            => 'Entregar por la mañana',
        ]);

        TransactionItem::create(['transaction_id' => $t2->id, 'product_id' => $p('DES-001')->id, 'quantity' => 2,  'unit_price' => 35.00, 'vat_rate' => '21', 'vat_amount' => 14.70, 'subtotal' => 70.00]);
        TransactionItem::create(['transaction_id' => $t2->id, 'product_id' => $p('DES-002')->id, 'quantity' => 2,  'unit_price' => 16.00, 'vat_rate' => '21', 'vat_amount' => 6.72,  'subtotal' => 32.00]);
        TransactionItem::create(['transaction_id' => $t2->id, 'product_id' => $p('DES-003')->id, 'quantity' => 1,  'unit_price' => 22.00, 'vat_rate' => '21', 'vat_amount' => 4.62,  'subtotal' => 22.00]);
        TransactionItem::create(['transaction_id' => $t2->id, 'product_id' => $p('SIN-001')->id, 'quantity' => 10, 'unit_price' => 0.60,  'vat_rate' => '10', 'vat_amount' => 0.60,  'subtotal' => 6.00]);

        $t3 = Transaction::create([
            'user_id'          => $pedro->id,
            'status'           => 'preparing',
            'subtotal'         => 44.00,
            'discount_applied' => 0.00,
            'vat_total'        => 5.32,
            'shipping_cost'    => 0.00,
            'total'            => 49.32,
            'shipping_address' => $pedro->address ?? '',
            'payment_intent_id'=> 'pi_test_003',
            'payment_status'   => 'paid',
            'notes'            => '',
        ]);

        TransactionItem::create(['transaction_id' => $t3->id, 'product_id' => $p('VIN-002')->id, 'quantity' => 2, 'unit_price' => 9.80,  'vat_rate' => '10', 'vat_amount' => 1.96, 'subtotal' => 19.60]);
        TransactionItem::create(['transaction_id' => $t3->id, 'product_id' => $p('CER-002')->id, 'quantity' => 8, 'unit_price' => 2.50,  'vat_rate' => '10', 'vat_amount' => 2.00, 'subtotal' => 20.00]);
        TransactionItem::create(['transaction_id' => $t3->id, 'product_id' => $p('SIN-002')->id, 'quantity' => 4, 'unit_price' => 0.80,  'vat_rate' => '10', 'vat_amount' => 0.32, 'subtotal' => 3.20]);

        $t4 = Transaction::create([
            'user_id'          => $carlos->id,
            'status'           => 'pending',
            'subtotal'         => 28.00,
            'discount_applied' => 0.00,
            'vat_total'        => 5.88,
            'shipping_cost'    => 0.00,
            'total'            => 33.88,
            'shipping_address' => $carlos->address ?? '',
            'payment_status'   => 'unpaid',
            'notes'            => '',
        ]);

        TransactionItem::create(['transaction_id' => $t4->id, 'product_id' => $p('DES-002')->id, 'quantity' => 2, 'unit_price' => 14.00, 'vat_rate' => '21', 'vat_amount' => 5.88, 'subtotal' => 28.00]);

        $t5 = Transaction::create([
            'user_id'          => $pedro->id,
            'status'           => 'pending',
            'subtotal'         => 37.50,
            'discount_applied' => 0.00,
            'vat_total'        => 3.75,
            'shipping_cost'    => 0.00,
            'total'            => 41.25,
            'shipping_address' => $pedro->address ?? '',
            'payment_status'   => 'unpaid',
            'notes'            => '',
        ]);

        TransactionItem::create(['transaction_id' => $t5->id, 'product_id' => $p('VIN-001')->id, 'quantity' => 3, 'unit_price' => 12.50, 'vat_rate' => '10', 'vat_amount' => 3.75, 'subtotal' => 37.50]);
    }
}
