<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('price_groups', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('price_group_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('price_group_id')->constrained('price_groups')->cascadeOnDelete();
            $table->foreignUuid('product_id')->constrained('products')->cascadeOnDelete();
            $table->decimal('price', 10, 2);
            $table->timestamps();

            $table->unique(['price_group_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('price_group_items');
        Schema::dropIfExists('price_groups');
    }
};
