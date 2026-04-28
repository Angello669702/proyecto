<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\PriceGroupItem;
use App\Models\Category;
use App\Models\PriceGroup;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $wine = Category::where('name', 'Vinos')->firstOrFail();
        $beer = Category::where('name', 'Cervezas')->firstOrFail();
        $dest = Category::where('name', 'Destilados')->firstOrFail();
        $esp  = Category::where('name', 'Espumosos')->firstOrFail();
        $soft = Category::where('name', 'Sin alcohol')->firstOrFail();

        $products = [
            ['category_id' => $wine->id, 'name' => 'Rioja Reserva 2018',       'sku' => 'VIN-001', 'description' => '...', 'price' => 12.50, 'stock' => 200,  'stock_alert_threshold' => 20],
            ['category_id' => $wine->id, 'name' => 'Albariño Rías Baixas',      'sku' => 'VIN-002', 'description' => '...', 'price' => 9.80,  'stock' => 150,  'stock_alert_threshold' => 15],
            ['category_id' => $wine->id, 'name' => 'Rosado Navarra',            'sku' => 'VIN-003', 'description' => '...', 'price' => 7.20,  'stock' => 100,  'stock_alert_threshold' => 10],
            ['category_id' => $beer->id, 'name' => 'Cerveza Rubia Lager',       'sku' => 'CER-001', 'description' => '...', 'price' => 1.20,  'stock' => 500,  'stock_alert_threshold' => 50],
            ['category_id' => $beer->id, 'name' => 'Cerveza IPA Artesana',      'sku' => 'CER-002', 'description' => '...', 'price' => 2.50,  'stock' => 300,  'stock_alert_threshold' => 30],
            ['category_id' => $beer->id, 'name' => 'Cerveza Tostada',           'sku' => 'CER-003', 'description' => '...', 'price' => 2.20,  'stock' => 8,    'stock_alert_threshold' => 30],
            ['category_id' => $dest->id, 'name' => 'Whisky Single Malt 12 años','sku' => 'DES-001', 'description' => '...', 'price' => 35.00, 'stock' => 80,   'stock_alert_threshold' => 10],
            ['category_id' => $dest->id, 'name' => 'Ginebra London Dry',        'sku' => 'DES-002', 'description' => '...', 'price' => 18.00, 'stock' => 120,  'stock_alert_threshold' => 15],
            ['category_id' => $dest->id, 'name' => 'Ron Añejo 7 años',          'sku' => 'DES-003', 'description' => '...', 'price' => 22.00, 'stock' => 90,   'stock_alert_threshold' => 10],
            ['category_id' => $esp->id,  'name' => 'Cava Brut Nature',          'sku' => 'ESP-001', 'description' => '...', 'price' => 8.50,  'stock' => 180,  'stock_alert_threshold' => 20],
            ['category_id' => $soft->id, 'name' => 'Agua Mineral 1.5L',         'sku' => 'SIN-001', 'description' => '...', 'price' => 0.60,  'stock' => 1000, 'stock_alert_threshold' => 100],
            ['category_id' => $soft->id, 'name' => 'Refresco Cola',             'sku' => 'SIN-002', 'description' => '...', 'price' => 0.80,  'stock' => 800,  'stock_alert_threshold' => 80],
        ];

        $picsumIds = [
            'VIN-001' => [10, 11, 12],
            'VIN-002' => [20, 21, 22],
            'VIN-003' => [30, 31, 32],
            'CER-001' => [40, 41, 42],
            'CER-002' => [50, 51, 52],
            'CER-003' => [60, 61, 62],
            'DES-001' => [70, 71, 72],
            'DES-002' => [80, 81, 82],
            'DES-003' => [90, 91, 92],
            'ESP-001' => [100, 101, 102],
            'SIN-001' => [110, 111, 112],
            'SIN-002' => [120, 121, 122],
        ];

        foreach ($products as $product) {
            $p = Product::updateOrCreate(
                ['sku' => $product['sku']],
                $product
            );

            $p->images()->delete();

            foreach ($picsumIds[$product['sku']] as $index => $picsumId) {
                ProductImage::create([
                    'product_id' => $p->id,
                    'path'       => "https://picsum.photos/id/{$picsumId}/600/600",
                    'order'      => $index,
                    'is_cover'   => $index === 0,
                ]);
            }
        }

        // Price group items
        $p1 = Product::where('sku', 'VIN-001')->first();
        $p2 = Product::where('sku', 'VIN-002')->first();
        $p4 = Product::where('sku', 'CER-001')->first();
        $p7 = Product::where('sku', 'DES-001')->first();
        $p8 = Product::where('sku', 'DES-002')->first();

        $tarifaA = PriceGroup::where('name', 'Tarifa A')->firstOrFail();
        $tarifaB = PriceGroup::where('name', 'Tarifa B')->firstOrFail();

        $priceGroupItems = [
            ['price_group_id' => $tarifaA->id, 'product_id' => $p1->id, 'price' => 10.00],
            ['price_group_id' => $tarifaA->id, 'product_id' => $p2->id, 'price' => 8.00],
            ['price_group_id' => $tarifaA->id, 'product_id' => $p4->id, 'price' => 0.90],
            ['price_group_id' => $tarifaA->id, 'product_id' => $p7->id, 'price' => 28.00],
            ['price_group_id' => $tarifaA->id, 'product_id' => $p8->id, 'price' => 14.00],
            ['price_group_id' => $tarifaB->id, 'product_id' => $p1->id, 'price' => 11.00],
            ['price_group_id' => $tarifaB->id, 'product_id' => $p4->id, 'price' => 1.00],
            ['price_group_id' => $tarifaB->id, 'product_id' => $p8->id, 'price' => 16.00],
        ];

        foreach ($priceGroupItems as $item) {
            PriceGroupItem::updateOrCreate(
                ['price_group_id' => $item['price_group_id'], 'product_id' => $item['product_id']],
                $item
            );
        }
    }
}