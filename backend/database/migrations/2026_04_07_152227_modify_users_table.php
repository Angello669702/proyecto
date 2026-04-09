<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('company_name')->after('name');
            $table->string('nif', 20)->unique()->after('company_name');
            $table->string('phone', 20)->nullable()->after('nif');
            $table->text('address')->nullable()->after('phone');
            $table->string('profile_photo')->nullable()->after('address');
            $table->enum('role', ['admin', 'client'])->default('client')->after('profile_photo');
            $table->boolean('is_active')->default(true)->after('role');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['price_group_id']);
            $table->dropColumn([
                'company_name',
                'nif',
                'phone',
                'address',
                'profile_photo',
                'role',
                'is_active',
                'price_group_id',
            ]);
        });
    }
};
