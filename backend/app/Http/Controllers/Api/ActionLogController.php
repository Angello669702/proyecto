<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActionLogResource;
use App\Models\ActionLog;
use Illuminate\Http\Request;

class ActionLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = ActionLog::with('user')
            ->when($request->user_id, fn($q) => $q->where('user_id', $request->user_id))
            ->when($request->entity_type, fn($q) => $q->where('entity_type', $request->entity_type))
            ->when($request->action, fn($q) => $q->where('action', 'like', "%{$request->action}%"))
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return ActionLogResource::collection($logs);
    }

    public function show(ActionLog $actionLog)
    {
        return new ActionLogResource($actionLog->load('user'));
    }
}
