<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PriceGroupResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'items_count' => $this->whenCounted('items'),
            'users_count' => $this->whenCounted('users'),
            'items' => PriceGroupItemResource::collection($this->whenLoaded('items')),
            'users' => UserResource::collection($this->whenLoaded('users')),
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
