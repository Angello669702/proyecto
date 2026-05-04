@component('mail::message')
    # Bienvenido, {{ $user->name }}

    Tu solicitud de acceso ha sido aprobada.

    **Empresa:** {{ $user->company_name }}
    **Usuario:** `{{ $user->name }}`
    **Contraseña temporal:** `{{ $password }}`

    Te recomendamos cambiar tu contraseña al iniciar sesión por primera vez.

    @component('mail::button', ['url' => config('app.url')])
        Iniciar sesión
    @endcomponent

@endcomponent
