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
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        if (!Auth::attempt([
            'name' => $request->username,
            'password' => $request->password,
        ])) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        $user = Auth::user();

        $user->load('favourites');

        $token = $user->createToken('auth_token')->plainTextToken;

        ActionLog::log(
            ActionType::USER_LOGIN,
            'User',
            $user->id,
            "{$user->name} inició sesión"
        );

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
