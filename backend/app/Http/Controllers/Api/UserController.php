<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Requests\UserRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('priceGroup')->paginate(20);
        return UserResource::collection($users);
    }

    public function show(User $user)
    {
        return new UserResource($user->load('priceGroup'));
    }

    public function store(UserRequest $request)
    {
        $data = $request->validated();
        $data['password'] = bcrypt($data['password']);

        if ($request->hasFile('profile_photo')) {
            $data['profile_photo'] = $request->file('profile_photo')
                ->store('profile_photos', 'public');
        }

        $user = User::create($data);
        return new UserResource($user->load('priceGroup'));
    }

    public function destroy(User $user)
    {
        $user->update(['is_active' => false]);
        return response()->json(['message' => 'Usuario desactivado correctamente']);
    }

    public function update(UserRequest $request, User $user)
    {
        $data = $request->validated();

        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        if ($request->hasFile('profile_photo')) {
            if ($user->profile_photo) {
                Storage::disk('public')->delete($user->profile_photo);
            }
            $data['profile_photo'] = $request->file('profile_photo')
                ->store('profile_photos', 'public');
        }

        $user->update($data);
        return new UserResource($user->fresh());
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
