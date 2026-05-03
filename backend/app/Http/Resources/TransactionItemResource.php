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
            'original_price'=> $this->product->price,
            'discount'      => $this->product->price - $this->unit_price,
            'vat_rate'      => (int) $this->vat_rate,
            'vat_amount'    => $this->vat_amount,
            'subtotal'      => $this->subtotal,
            'subtotal_with_vat' => $this->subtotal + $this->vat_amount,
            'product'    => new ProductResource($this->whenLoaded('product')),
        ];
    }
}
