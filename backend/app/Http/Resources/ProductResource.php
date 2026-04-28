<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $cover  = $this->images->firstWhere('is_cover', true);
        $images = $this->images->sortBy('order');

        return [
            'id'                    => $this->id,
            'name'                  => $this->name,
            'sku'                   => $this->sku,
            'description'           => $this->description,
            'cover_image'           => $cover ? $cover->path : null,
            'images'                => $images->pluck('path')->values(),
            'price'                 => $this->price,
            'stock'                 => $this->stock,
            'stock_alert_threshold' => $this->stock_alert_threshold,
            'is_active'             => $this->is_active,
            'category'              => [
                'id'   => $this->category->id,
                'name' => $this->category->name,
            ],
            'created_at'            => $this->created_at->toDateTimeString(),
            'updated_at'            => $this->updated_at->toDateTimeString(),
        ];
    }
}