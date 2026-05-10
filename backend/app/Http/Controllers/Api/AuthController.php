<?php

namespace App\Http\Controllers\Api;

use App\Enums\ActionType;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\ActionLog;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // VER QUÉ ESTÁ RECIBIENDO EXACTAMENTE
        $content = $request->getContent();
        $json = json_decode($content, true);
        
        if (!$json) {
            return response()->json([
                'error' => 'JSON inválido o vacío',
                'content_type' => $request->header('Content-Type'),
                'raw_body' => $content,
                'method' => $request->method()
            ], 400);
        }
        
        $username = $json['username'] ?? null;
        $password = $json['password'] ?? null;
        
        if (!$username || !$password) {
            return response()->json([
                'error' => 'Faltan credenciales',
                'received' => $json
            ], 400);
        }
        
        $user = User::where('name', $username)->first();
        
        if (!$user) {
            return response()->json([
                'error' => 'Usuario no encontrado: ' . $username,
                'users_count' => User::count()
            ], 404);
        }
        
        if (!Hash::check($password, $user->password)) {
            return response()->json([
                'error' => 'Contraseña incorrecta'
            ], 401);
        }
        
        Auth::login($user);
        
        try {
            $token = $user->createToken('auth_token')->plainTextToken;
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al crear token: ' . $e->getMessage()
            ], 500);
        }
        
        return response()->json([
            'token' => $token,
            'user' => new UserResource($user)
        ]);
    }

    public function me(Request $request)
    {
        return new UserResource(
            $request->user()->load(['favourites', 'priceGroup.items.product', 'transactions'])
        );
    }
}
