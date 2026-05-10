<?php

namespace App\Http\Controllers\Api;

use App\Enums\ActionType;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Requests\UserRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Resources\UserResource;
use App\Models\ActionLog;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{

    public function all()
    {
        $users = User::with('priceGroup')
            ->where('role', '!=', 'admin')
            ->get();
        return UserResource::collection($users);
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        $user = User::find(auth()->id());
        $data = $request->validated();

        unset($data['role'], $data['is_active'], $data['price_group_id'], $data['password']);

        if ($request->hasFile('profile_photo')) {
            if ($user->profile_photo) {
                Storage::disk('public')->delete($user->profile_photo);
            }
            $data['profile_photo'] = $request->file('profile_photo')
                ->store('profile_photos', 'public');
        }

        $user->update($data);
        ActionLog::log(
            ActionType::USER_UPDATED,
            'User',
            $user->id,
            "{$user->name} actualizó su perfil"
        );
        return new UserResource($user->fresh());
    }
    public function updatePassword(UpdatePasswordRequest $request)
    {
        $user = auth()->user();

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['La contraseña actual no es correcta.'],
            ]);
        }

        $user->update(['password' => bcrypt($request->new_password)]);

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }
}
