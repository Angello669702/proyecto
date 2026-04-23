<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'status'           => $this->status,
            'subtotal'         => $this->subtotal,
            'discount_applied' => $this->discount_applied,
            'shipping_cost'    => $this->shipping_cost,
            'total'            => $this->total,
            'shipping_address' => $this->shipping_address,
            'payment_status'   => $this->payment_status,
            'notes'            => $this->notes,
            'user'             => $this->whenLoaded('user', fn() => [
                'id'           => $this->user->id,
                'name'         => $this->user->name,
                'company_name' => $this->user->company_name,
                'email'        => $this->user->email,
            ]),
            'items'            => TransactionItemResource::collection($this->whenLoaded('items')),
            'created_at'       => $this->created_at->toDateTimeString(),
            'updated_at'       => $this->updated_at->toDateTimeString(),
        ];
    }
}
