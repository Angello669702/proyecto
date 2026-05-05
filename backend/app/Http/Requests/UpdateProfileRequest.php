<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = auth()->id();

        return [
            'name'          => ['required', 'string', 'max:255'],
            'full_name'     => ['required', 'string', 'max:255'],
            'email'         => ['required', 'email', 'unique:users,email,' . $userId],
            'company_name'  => ['required', 'string', 'max:255'],
            'nif'           => ['required', 'string', 'max:20', 'unique:users,nif,' . $userId],
            'phone'         => ['nullable', 'string', 'max:20'],
            'address'       => ['nullable', 'string'],
            'profile_photo' => ['nullable', 'image', 'max:2048'],
        ];
    }
}
