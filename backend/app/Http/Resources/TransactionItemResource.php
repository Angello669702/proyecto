<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $originalPrice = (float) $this->product->price;
        $unitPrice = (float) $this->unit_price;
        $vatRate = (float) $this->vat_rate;
        $vatAmount = (float) $this->vat_amount;
        $subtotal = (float) $this->subtotal;

        return [
            'id' => $this->id,

            'quantity' => (int) $this->quantity,

            'unit_price' => $unitPrice,

            'original_price' => $originalPrice,

            'discount' => $originalPrice - $unitPrice,

            'vat_rate' => $vatRate,

            'vat_amount' => $vatAmount,

            'subtotal' => $subtotal,

            'subtotal_with_vat' => $subtotal + $vatAmount,

            'product' => new ProductResource(
                $this->whenLoaded('product')
            ),
        ];
    }
}
