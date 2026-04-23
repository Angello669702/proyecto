<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'company_name'  => $this->company_name,
            'nif'           => $this->nif,
            'email'         => $this->email,
            'phone'         => $this->phone,
            'address'       => $this->address,
            'profile_photo' => $this->profile_photo ? asset('storage/' . $this->profile_photo) : null,
            'role'          => $this->role,
            'is_active'     => $this->is_active,
            'price_group'   => $this->whenLoaded('priceGroup', fn() => [
                'id'   => $this->priceGroup->id,
                'name' => $this->priceGroup->name,
            ]),
            'created_at'    => $this->created_at->toDateTimeString(),
            'updated_at'    => $this->updated_at->toDateTimeString(),
        ];
    }
}
