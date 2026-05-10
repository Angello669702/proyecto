<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $originalPrice = (float) ($this->product->price ?? 0);
        $unitPrice     = (float) ($this->unit_price ?? 0);
        $vatRate       = (float) ($this->vat_rate ?? 0);
        $vatAmount     = (float) ($this->vat_amount ?? 0);
        $subtotal      = (float) ($this->subtotal ?? 0);

        return [
            'id'              => $this->id,
            'quantity'        => (int) ($this->quantity ?? 0),
            'unit_price'      => $unitPrice,
            'original_price'  => $originalPrice,
            'discount'        => $originalPrice - $unitPrice,
            'vat_rate'        => $vatRate,
            'vat_amount'      => $vatAmount,
            'subtotal'        => $subtotal,
            'subtotal_with_vat' => $subtotal + $vatAmount,
            'product'         => new ProductResource($this->whenLoaded('product')),
        ];
    }
}
