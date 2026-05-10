<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PriceGroupItemResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product' => new ProductResource($this->whenLoaded('product')),
            'price' => $this->price,
            'discount_percentage' => $this->product->price > 0
                ? round((($this->product->price - $this->price) / $this->product->price) * 100, 2)
                : 0,
        ];
    }
}
