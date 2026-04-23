<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RegistrationRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'company_name' => $this->company_name,
            'nif'          => $this->nif,
            'contact_name' => $this->contact_name,
            'email'        => $this->email,
            'phone'        => $this->phone,
            'address'      => $this->address,
            'notes'        => $this->notes,
            'status'       => $this->status,
            'reviewed_by'  => $this->whenLoaded('reviewedBy', fn() => [
                'id'   => $this->reviewedBy->id,
                'name' => $this->reviewedBy->name,
            ]),
            'reviewed_at'  => $this->reviewed_at?->toDateTimeString(),
            'created_at'   => $this->created_at->toDateTimeString(),
            'updated_at'   => $this->updated_at->toDateTimeString(),
        ];
    }
}
