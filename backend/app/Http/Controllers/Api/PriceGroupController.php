<?php

namespace App\Http\Controllers\Api;

use App\Enums\ActionType;
use App\Http\Controllers\Controller;
use App\Http\Resources\PriceGroupResource;
use App\Http\Resources\PriceGroupItemResource;
use App\Models\ActionLog;
use App\Models\PriceGroup;
use App\Models\PriceGroupItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PriceGroupController extends Controller
{
    public function index()
    {
        $groups = PriceGroup::withCount(['items', 'users'])
            ->with(['items.product', 'users'])
            ->paginate(20);
        return PriceGroupResource::collection($groups);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:price_groups'],
            'description' => ['nullable', 'string'],
            'items' => ['nullable', 'array'],
            'items.*.product_id' => ['required', 'uuid', 'exists:products,id'],
            'items.*.price' => ['required', 'numeric', 'min:0'],
        ]);

        $priceGroup = PriceGroup::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
        ]);

        if (!empty($data['items'])) {
            foreach ($data['items'] as $item) {
                PriceGroupItem::create([
                    'price_group_id' => $priceGroup->id,
                    'product_id' => $item['product_id'],
                    'price' => $item['price'],
                ]);
            }
        }

        ActionLog::log(
            ActionType::PRICE_GROUP_CREATED,
            'PriceGroup',
            $priceGroup->id,
            "{$request->user()->name} creó el grupo de precios '{$priceGroup->name}'"
        );

        return new PriceGroupResource($priceGroup->load('items.product'));
    }

    public function addItem(Request $request, PriceGroup $priceGroup)
    {
        $data = $request->validate([
            'id' => ['required', 'uuid', 'exists:products,id'],
            'price' => ['required', 'numeric', 'min:0'],
        ]);

        $item = $priceGroup->items()->updateOrCreate(
            ['product_id' => $data['id']],
            ['price' => $data['price']]
        );

        $product = $item->product;

        ActionLog::log(
            ActionType::PRICE_GROUP_ITEM_UPDATED,
            'PriceGroup',
            $priceGroup->id,
            "{$request->user()->name} " . ($item->wasRecentlyCreated ? 'añadió' : 'actualizó') .
            " el precio de '{$product->name}' a {$data['price']}€ en el grupo '{$priceGroup->name}'"
        );

        return new PriceGroupItemResource($item->load('product'));
    }

    public function removeItem(PriceGroup $priceGroup, PriceGroupItem $item)
    {
        $productName = $item->product->name;
        $item->delete();
        $user = Auth::user();
        ActionLog::log(
            ActionType::PRICE_GROUP_ITEM_DELETED,
            'PriceGroup',
            $priceGroup->id,
            "{$user->name} eliminó el producto '{$productName}' del grupo '{$priceGroup->name}'"
        );

        return response()->json(['message' => 'Producto eliminado del grupo']);
    }
    public function assignUser(Request $request, PriceGroup $priceGroup)
    {
        $data = $request->validate([
            'id' => ['required', 'uuid', 'exists:users,id'],
        ]);

        $user = \App\Models\User::findOrFail($data['id']);
        $user->update(['price_group_id' => $priceGroup->id]);

        ActionLog::log(
            ActionType::USER_ASSIGNED_TO_GROUP,
            'PriceGroup',
            $priceGroup->id,
            "{$request->user()->name} asignó al usuario '{$user->name}' al grupo '{$priceGroup->name}'"
        );

        return response()->json([
            'message' => "Usuario '{$user->name}' asignado al grupo '{$priceGroup->name}'"
        ]);
    }

    public function removeUser(Request $request, PriceGroup $priceGroup)
    {
        $data = $request->validate([
            'id' => ['required', 'uuid', 'exists:users,id'],
        ]);

        $user = \App\Models\User::findOrFail($data['id']);

        if ($user->price_group_id !== $priceGroup->id) {
            return response()->json([
                'message' => 'El usuario no pertenece a este grupo'
            ], 422);
        }

        $user->update(['price_group_id' => null]);

        ActionLog::log(
            ActionType::USER_REMOVED_FROM_GROUP,
            'PriceGroup',
            $priceGroup->id,
            "{$request->user()->name} quitó al usuario '{$user->name}' del grupo '{$priceGroup->name}'"
        );

        return response()->json([
            'message' => "Usuario '{$user->name}' eliminado del grupo '{$priceGroup->name}'"
        ]);
    }
}
