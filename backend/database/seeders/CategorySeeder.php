<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Vinos', 'description' => 'Vinos tintos, blancos y rosados'],
            ['name' => 'Cervezas', 'description' => 'Cervezas nacionales e importadas'],
            ['name' => 'Destilados', 'description' => 'Whisky, ron, ginebra, vodka y más'],
            ['name' => 'Espumosos', 'description' => 'Cava, champán y otros espumosos'],
            ['name' => 'Sin alcohol', 'description' => 'Refrescos, aguas y zumos'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}