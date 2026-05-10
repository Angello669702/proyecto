<?php

namespace App\Traits;

use App\Enums\ActionType;
use App\Models\ActionLog;
use Illuminate\Support\Facades\Auth;

trait Loggable
{
    protected static function bootLoggable(): void
    {
        static::created(function ($model) {
            ActionLog::log(
                ActionType::PRODUCT_CREATED,
                class_basename($model),
                $model->id,
                self::getDescription($model, 'created')
            );
        });

        static::updated(function ($model) {
            ActionLog::log(
                ActionType::PRODUCT_UPDATED,
                class_basename($model),
                $model->id,
                self::getDescription($model, 'updated')
            );
        });

        static::deleted(function ($model) {
            ActionLog::log(
                ActionType::PRODUCT_DELETED,
                class_basename($model),
                $model->id,
                self::getDescription($model, 'deleted')
            );
        });
    }

    protected static function getDescription($model, string $action): string
    {
        $userName = Auth::user()?->name ?? 'Sistema';
        $modelName = class_basename($model);
        $modelIdentifier = $model->name ?? $model->id ?? 'Desconocido';

        return match($action) {
            'created' => "{$userName} creó {$modelName} '{$modelIdentifier}'",
            'updated' => "{$userName} actualizó {$modelName} '{$modelIdentifier}'",
            'deleted' => "{$userName} eliminó {$modelName} '{$modelIdentifier}'",
            default => "{$userName} realizó acción '{$action}' en {$modelName} '{$modelIdentifier}'"
        };
    }
}
