<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegistrationRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_name' => ['required', 'string', 'max:255'],
            'nif'          => ['required', 'string', 'max:20', 'unique:registration_requests,nif'],
            'contact_name' => ['required', 'string', 'max:255'],
            'email'        => ['required', 'email', 'unique:registration_requests,email'],
            'phone'        => ['nullable', 'string', 'max:20'],
            'address'      => ['nullable', 'string'],
            'notes'        => ['nullable', 'string'],
        ];
    }
}
