<?php

namespace App\Models;

use App\Traits\Loggable;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasUuids, HasApiTokens, Loggable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */

    protected $fillable = [
        'name',
        'full_name',
        'email',
        'password',
        'company_name',
        'nif',
        'phone',
        'address',
        'profile_photo',
        'role',
        'is_active',
        'price_group_id',
    ];

    protected $hidden = [
        'password',
        'remember_token'
    ];
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function favourites(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'user_product_favorites');
    }

    public function priceGroup(): BelongsTo
    {
        return $this->belongsTo(PriceGroup::class);
    }

    public function actionLogs(): HasMany
    {
        return $this->hasMany(ActionLog::class);
    }

    public function reviewedRequests(): HasMany
    {
        return $this->hasMany(RegistrationRequest::class, 'reviewed_by');
    }
}
