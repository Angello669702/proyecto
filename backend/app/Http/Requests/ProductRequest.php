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

        $rules = [
            'category'               => ['required', 'string', 'max:255'],
            'name'                   => ['required', 'string', 'max:255'],
            'sku'                    => ['required', 'string', 'max:100', 'unique:products,sku,' . $productId],
            'description'            => ['nullable', 'string'],
            'price'                  => ['required', 'numeric', 'min:0'],
            'stock'                  => ['required', 'integer', 'min:0'],
            'stock_alert_threshold'  => ['nullable', 'integer', 'min:0'],
            'is_active'              => ['nullable', 'boolean'],
        ];

        if ($this->hasFile('cover_image') || $this->hasFile('images')) {
            $rules['cover_image'] = ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'];
            $rules['images'] = ['nullable', 'array'];
            $rules['images.*'] = ['image', 'mimes:jpeg,png,jpg,webp', 'max:2048'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'category.required' => 'La categoría es obligatoria.',
            'name.required' => 'El nombre del producto es obligatorio.',
            'sku.required' => 'El SKU es obligatorio.',
            'sku.unique' => 'Este SKU ya está en uso.',
            'price.required' => 'El precio es obligatorio.',
            'price.min' => 'El precio no puede ser negativo.',
            'stock.required' => 'El stock es obligatorio.',
            'stock.integer' => 'El stock debe ser un número entero.',
            'cover_image.image' => 'El archivo de portada debe ser una imagen.',
            'cover_image.max' => 'La imagen de portada no puede superar los 2MB.',
            'images.*.image' => 'Cada archivo debe ser una imagen válida.',
            'images.*.max' => 'Cada imagen no puede superar los 2MB.',
        ];
    }
}
