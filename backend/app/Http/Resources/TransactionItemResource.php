<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'quantity'   => $this->quantity,
            'unit_price' => $this->unit_price,
            'subtotal'   => $this->subtotal,
            'product'    => $this->whenLoaded('product', fn() => [
                'id'    => $this->product->id,
                'name'  => $this->product->name,
                'sku'   => $this->product->sku,
                'image' => $this->product->image ? asset('storage/' . $this->product->image) : null,
            ]),
        ];
    }
}
