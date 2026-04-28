<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Models\PriceGroup;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $group1 = PriceGroup::where('name', 'Tarifa A')->first();
        $group2 = PriceGroup::where('name', 'Tarifa B')->first();
        
        User::create([
            'name'         => 'Admin Principal',
            'company_name' => 'Distribuidora S.L.',
            'nif'          => 'A12345678',
            'email'        => 'admin@distribuidora.com',
            'password'     => Hash::make('password'),
            'phone'        => '600000001',
            'address'      => 'Calle Principal 1, Madrid',
            'role'         => 'admin',
            'is_active'    => true,
        ]);

        
        User::create([
            'name'           => 'Carlos López',
            'company_name'   => 'Bar El Rincón S.L.',
            'nif'            => 'B11111111',
            'email'          => 'carlos@elrincon.com',
            'password'       => Hash::make('password'),
            'phone'          => '600000002',
            'address'        => 'Calle Mayor 10, Sevilla',
            'role'           => 'client',
            'is_active'      => true,
            'price_group_id' => $group1->id,
        ]);

        User::create([
            'name'           => 'María García',
            'company_name'   => 'Restaurante La Plaza',
            'nif'            => 'B22222222',
            'email'          => 'maria@laplaza.com',
            'password'       => Hash::make('password'),
            'phone'          => '600000003',
            'address'        => 'Avenida Central 5, Valencia',
            'role'           => 'client',
            'is_active'      => true,
            'price_group_id' => $group2->id
        ]);

        User::create([
            'name'         => 'Pedro Martínez',
            'company_name' => 'Hotel Las Palmas',
            'nif'          => 'B33333333',
            'email'        => 'pedro@laspalmas.com',
            'password'     => Hash::make('password'),
            'phone'        => '600000004',
            'address'      => 'Paseo Marítimo 20, Málaga',
            'role'         => 'client',
            'is_active'    => true,
        ]);

        User::create([
            'name'         => 'Ana Torres',
            'company_name' => 'Cafetería Sol',
            'nif'          => 'B44444444',
            'email'        => 'ana@cafeteriasol.com',
            'password'     => Hash::make('password'),
            'phone'        => '600000005',
            'address'      => 'Calle Sol 3, Barcelona',
            'role'         => 'client',
            'is_active'    => false,
        ]);
    }
}