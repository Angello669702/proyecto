<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $cover  = $this->images->firstWhere('is_cover', true);
        $images = $this->images->where('is_cover', false)->sortBy('order');

        return [
            'id'                    => $this->id,
            'name'                  => $this->name,
            'sku'                   => $this->sku,
            'description'           => $this->description,
            'cover_image'           => $this->formatImageUrl($cover?->path),
            'images'                => $images->map(fn($img) => $this->formatImageUrl($img->path))->values(),
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

    private function formatImageUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }

        return asset('storage/' . $path);
    }
}
