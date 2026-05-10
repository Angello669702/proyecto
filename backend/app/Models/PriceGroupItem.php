<?php

namespace App\Models;

use App\Traits\Loggable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PriceGroupItem extends Model
{
    use HasUuids, Loggable;

    protected $fillable = [
        'price_group_id',
        'product_id',
        'price',
    ];
    public function priceGroup(): BelongsTo
    {
        return $this->belongsTo(PriceGroup::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
