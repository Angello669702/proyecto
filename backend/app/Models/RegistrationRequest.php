<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RegistrationRequest extends Model
{
    use HasUuids;

    protected $table = 'registration_requests';

    protected $fillable = [
        'company_name', 'nif', 'contact_name', 'email',
        'phone', 'address', 'notes', 'status',
        'reviewed_by', 'reviewed_at',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];
    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
