<?php

namespace App\Models;

use App\Enums\ActionType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActionLog extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'action',
        'entity_type',
        'entity_id',
        'description',
        'ip_address',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'action' => ActionType::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public static function log(
        ActionType|string $action,
        string $entityType,
        string $entityId,
        ?string $description = null,
        ?string $userId = null
    ): self {
        return self::create([
            'user_id' => $userId ?? Auth::id(),
            'action' => $action instanceof ActionType ? $action->value : $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'description' => $description,
        ]);
    }
}
