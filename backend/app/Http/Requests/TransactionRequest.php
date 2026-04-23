<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id'                   => ['required', 'integer', 'exists:users,id'],
            'shipping_address'          => ['required', 'string'],
            'discount_applied'          => ['nullable', 'numeric', 'min:0'],
            'shipping_cost'             => ['nullable', 'numeric', 'min:0'],
            'notes'                     => ['nullable', 'string'],
            'items'                     => ['required', 'array', 'min:1'],
            'items.*.product_id'        => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity'          => ['required', 'integer', 'min:1'],
            'items.*.unit_price'        => ['required', 'numeric', 'min:0'],
        ];
    }
}
