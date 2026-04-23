<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PriceGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $priceGroupId = $this->route('price_group')?->id;

        return [
            'name'               => ['required', 'string', 'max:255', 'unique:price_groups,name,' . $priceGroupId],
            'description'        => ['nullable', 'string'],
            'items'              => ['nullable', 'array'],
            'items.*.product_id' => ['required_with:items', 'integer', 'exists:products,id'],
            'items.*.price'      => ['required_with:items', 'numeric', 'min:0'],
        ];
    }
}
