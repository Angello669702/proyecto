<?php

namespace App\Http\Controllers;

use App\Http\Requests\PriceGroupRequest;
use App\Http\Resources\PriceGroupResource;
use App\Models\PriceGroup;

class PriceGroupController extends Controller
{
    public function index()
    {
        $priceGroups = PriceGroup::with('items.product')->paginate(20);
        return PriceGroupResource::collection($priceGroups);
    }

    public function show(PriceGroup $priceGroup)
    {
        return new PriceGroupResource($priceGroup->load('items.product'));
    }

    public function store(PriceGroupRequest $request)
    {
        $priceGroup = PriceGroup::create($request->validated());

        if ($request->has('items')) {
            foreach ($request->items as $item) {
                $priceGroup->items()->create([
                    'product_id' => $item['product_id'],
                    'price'      => $item['price'],
                ]);
            }
        }

        return new PriceGroupResource($priceGroup->load('items.product'));
    }

    public function update(PriceGroupRequest $request, PriceGroup $priceGroup)
    {
        $priceGroup->update($request->validated());

        if ($request->has('items')) {
            $priceGroup->items()->delete();
            foreach ($request->items as $item) {
                $priceGroup->items()->create([
                    'product_id' => $item['product_id'],
                    'price'      => $item['price'],
                ]);
            }
        }

        return new PriceGroupResource($priceGroup->load('items.product'));
    }

    public function destroy(PriceGroup $priceGroup)
    {
        if ($priceGroup->users()->exists()) {
            return response()->json(['message' => 'No se puede eliminar un grupo de precios asignado a usuarios'], 409);
        }

        $priceGroup->delete();
        return response()->json(['message' => 'Grupo de precios eliminado correctamente'], 200);
    }
}
