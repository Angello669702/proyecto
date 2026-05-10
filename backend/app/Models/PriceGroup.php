<?php

namespace App\Models;

use App\Traits\Loggable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PriceGroup extends Model
{
    use HasUuids, Loggable;

    protected $fillable = [
        'name',
        'description',
    ];
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PriceGroupItem::class);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'price_group_items')->withPivot('price')->withTimestamps();
    }

    public function getPriceForProduct(string $productId): ?float
    {
        $item = $this->items()->where('product_id', $productId)->first();
        return $item?->price;
    }
}
