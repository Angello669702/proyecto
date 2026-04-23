<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user')?->id;

        return [
            'name'            => ['required', 'string', 'max:255'],
            'company_name'    => ['required', 'string', 'max:255'],
            'nif'             => ['required', 'string', 'max:20', 'unique:users,nif,' . $userId],
            'email'           => ['required', 'email', 'unique:users,email,' . $userId],
            'password'        => [$this->isMethod('POST') ? 'required' : 'nullable', 'string', 'min:8'],
            'phone'           => ['nullable', 'string', 'max:20'],
            'address'         => ['nullable', 'string'],
            'profile_photo'   => ['nullable', 'image', 'max:2048'],
            'role'            => ['nullable', 'in:admin,client'],
            'is_active'       => ['nullable', 'boolean'],
            'price_group_id'  => ['nullable', 'integer', 'exists:price_groups,id'],
        ];
    }
}
