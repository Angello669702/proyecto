<?php

namespace App\Http\Resources;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'status'           => $this->status,
            'subtotal'         => (float) ($this->subtotal ?? 0),
            'discount_applied' => (float) ($this->discount_applied ?? 0),
            'vat_total'        => (float) ($this->vat_total ?? 0),
            'shipping_cost'    => (float) ($this->shipping_cost ?? 0),
            'total'            => (float) ($this->total ?? 0),
            'shipping_address' => $this->shipping_address ?? '',
            'payment_status'   => $this->payment_status,
            'notes'            => $this->notes ?? '',
            'user'             => new UserResource($this->whenLoaded('user')),
            'transactions_items' => TransactionItemResource::collection($this->whenLoaded('items')),
            'created_at'       => $this->created_at->toDateTimeString(),
            'updated_at'       => $this->updated_at->toDateTimeString(),
        ];
    }
}
