<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productId = $this->route('product')?->id;

        return [
            'category_id'            => ['required', 'integer', 'exists:categories,id'],
            'name'                   => ['required', 'string', 'max:255'],
            'sku'                    => ['required', 'string', 'max:100', 'unique:products,sku,' . $productId],
            'description'            => ['nullable', 'string'],
            'image'                  => ['nullable', 'image', 'max:2048'],
            'price'                  => ['required', 'numeric', 'min:0'],
            'stock'                  => ['required', 'integer', 'min:0'],
            'stock_alert_threshold'  => ['nullable', 'integer', 'min:0'],
            'is_active'              => ['nullable', 'boolean'],
        ];
    }
}
