<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PriceGroupResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'description' => $this->description,
            'items'       => $this->whenLoaded('items', fn() =>
            $this->items->map(fn($item) => [
                'product_id'   => $item->product_id,
                'product_name' => $item->product->name ?? null,
                'price'        => $item->price,
            ])
            ),
            'created_at'  => $this->created_at->toDateTimeString(),
            'updated_at'  => $this->updated_at->toDateTimeString(),
        ];
    }
}
