<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegistrationRequestRequest;
use App\Http\Resources\RegistrationRequestResource;
use App\Models\RegistrationRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class RegistrationRequestController extends Controller
{
    public function index(Request $request)
    {
        $requests = RegistrationRequest::with('reviewedBy')
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return RegistrationRequestResource::collection($requests);
    }

    public function show(RegistrationRequest $registrationRequest)
    {
        return new RegistrationRequestResource($registrationRequest->load('reviewedBy'));
    }

    public function store(RegistrationRequestRequest $request)
    {
        $registrationRequest = RegistrationRequest::create($request->validated());
        return new RegistrationRequestResource($registrationRequest);
    }

    public function approve(Request $request, RegistrationRequest $registrationRequest)
    {
        if ($registrationRequest->status !== 'pending') {
            return response()->json(['message' => 'Esta solicitud ya ha sido procesada'], 409);
        }

        $password = Str::random(12);

        $user = User::create([
            'name'         => $registrationRequest->contact_name,
            'company_name' => $registrationRequest->company_name,
            'nif'          => $registrationRequest->nif,
            'email'        => $registrationRequest->email,
            'phone'        => $registrationRequest->phone,
            'address'      => $registrationRequest->address,
            'password'     => bcrypt($password),
            'role'         => 'client',
            'is_active'    => true,
        ]);

        $registrationRequest->update([
            'status'      => 'approved',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        // TODO: Mail::to($user->email)->send(new WelcomeMail($user, $password));

        return response()->json([
            'message' => 'Solicitud aprobada y usuario creado correctamente',
            'user'    => new \App\Http\Resources\UserResource($user),
        ], 201);
    }

    public function reject(Request $request, RegistrationRequest $registrationRequest)
    {
        if ($registrationRequest->status !== 'pending') {
            return response()->json(['message' => 'Esta solicitud ya ha sido procesada'], 409);
        }

        $registrationRequest->update([
            'status'      => 'rejected',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return new RegistrationRequestResource($registrationRequest->load('reviewedBy'));
    }
}
