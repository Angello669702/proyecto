<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PriceGroup;

class PriceGroupSeeder extends Seeder
{
    public function run(): void
    {
        PriceGroup::create([
            'name'        => 'Tarifa A',
            'description' => 'Tarifa para grandes clientes con descuento especial',
        ]);

        PriceGroup::create([
            'name'        => 'Tarifa B',
            'description' => 'Tarifa estándar para clientes habituales',
        ]);
    }
}